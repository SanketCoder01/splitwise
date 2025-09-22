package com.resuchain.service;

import com.resuchain.model.*;
import com.resuchain.repository.ResumeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Resume uploadResume(User user, MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || (!fileName.toLowerCase().endsWith(".pdf") && 
                                !fileName.toLowerCase().endsWith(".docx") && 
                                !fileName.toLowerCase().endsWith(".doc"))) {
            throw new IllegalArgumentException("Only PDF and DOCX files are supported");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file
        String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // Extract text from file
        String extractedText = extractTextFromFile(filePath.toFile());

        // Create resume entity
        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFileName(fileName);
        resume.setFilePath(filePath.toString());
        resume.setRawText(extractedText);
        resume.setProcessingStatus(ProcessingStatus.PENDING);

        // Save resume
        resume = resumeRepository.save(resume);

        // Process resume asynchronously
        processResumeAsync(resume);

        return resume;
    }

    private String extractTextFromFile(File file) throws IOException {
        String fileName = file.getName().toLowerCase();
        
        if (fileName.endsWith(".pdf")) {
            return extractTextFromPDF(file);
        } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
            return extractTextFromDOCX(file);
        }
        
        throw new IllegalArgumentException("Unsupported file format");
    }

    private String extractTextFromPDF(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDOCX(File file) throws IOException {
        try (XWPFDocument document = new XWPFDocument(Files.newInputStream(file.toPath()));
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    private void processResumeAsync(Resume resume) {
        // This would typically be done in a separate thread or using @Async
        try {
            resume.setProcessingStatus(ProcessingStatus.PROCESSING);
            resumeRepository.save(resume);

            // Call AI service to parse resume
            Map<String, Object> parsedData = callAIServiceForParsing(resume.getRawText());

            // Update resume with parsed data
            resume.setParsedSkills(objectMapper.writeValueAsString(parsedData.get("skills")));
            resume.setParsedEducation(objectMapper.writeValueAsString(parsedData.get("education")));
            resume.setParsedExperience(objectMapper.writeValueAsString(parsedData.get("experience")));
            resume.setProcessingStatus(ProcessingStatus.COMPLETED);
            resume.setProcessedAt(LocalDateTime.now());
            resume.setVerificationProgress(25); // Initial parsing complete

            resumeRepository.save(resume);

        } catch (Exception e) {
            resume.setProcessingStatus(ProcessingStatus.FAILED);
            resumeRepository.save(resume);
            throw new RuntimeException("Failed to process resume", e);
        }
    }

    private Map<String, Object> callAIServiceForParsing(String resumeText) {
        try {
            String url = aiServiceUrl + "/parse-resume-text";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("text", resumeText);
            
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("AI service returned error: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to call AI service", e);
        }
    }

    public List<Resume> getUserResumes(User user) {
        return resumeRepository.findByUserOrderByUploadedAtDesc(user);
    }

    public Optional<Resume> getUserResume(User user, Long resumeId) {
        return resumeRepository.findByUserAndId(user, resumeId);
    }

    public Resume updateVerificationProgress(Long resumeId, int progress) {
        Resume resume = resumeRepository.findById(resumeId)
            .orElseThrow(() -> new RuntimeException("Resume not found"));
        
        resume.setVerificationProgress(Math.min(progress, 100));
        return resumeRepository.save(resume);
    }

    public void deleteResume(User user, Long resumeId) {
        Resume resume = resumeRepository.findByUserAndId(user, resumeId)
            .orElseThrow(() -> new RuntimeException("Resume not found"));
        
        // Delete file from filesystem
        try {
            Files.deleteIfExists(Paths.get(resume.getFilePath()));
        } catch (IOException e) {
            // Log error but don't fail the operation
        }
        
        resumeRepository.delete(resume);
    }

    public Map<String, Object> getResumeStats(User user) {
        List<Resume> resumes = resumeRepository.findByUser(user);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalResumes", resumes.size());
        stats.put("completedResumes", resumes.stream().mapToLong(r -> 
            r.getProcessingStatus() == ProcessingStatus.COMPLETED ? 1 : 0).sum());
        stats.put("averageProgress", resumes.stream().mapToInt(Resume::getVerificationProgress)
            .average().orElse(0.0));
        
        return stats;
    }
}
