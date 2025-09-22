package com.resuchain.controller;

import com.resuchain.model.Resume;
import com.resuchain.model.User;
import com.resuchain.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/resume")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file,
                                        Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Resume resume = resumeService.uploadResume(user, file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Resume uploaded successfully");
            response.put("resumeId", resume.getId());
            response.put("status", resume.getProcessingStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to upload resume: " + e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getUserResumes(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Resume> resumes = resumeService.getUserResumes(user);
            return ResponseEntity.ok(resumes);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to fetch resumes: " + e.getMessage()));
        }
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getResume(@PathVariable Long resumeId,
                                     Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Resume> resume = resumeService.getUserResume(user, resumeId);
            
            if (resume.isPresent()) {
                return ResponseEntity.ok(resume.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to fetch resume: " + e.getMessage()));
        }
    }

    @PutMapping("/{resumeId}/progress")
    public ResponseEntity<?> updateProgress(@PathVariable Long resumeId,
                                          @RequestParam int progress,
                                          Authentication authentication) {
        try {
            Resume resume = resumeService.updateVerificationProgress(resumeId, progress);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to update progress: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<?> deleteResume(@PathVariable Long resumeId,
                                        Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            resumeService.deleteResume(user, resumeId);
            return ResponseEntity.ok(new MessageResponse("Resume deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to delete resume: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getResumeStats(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> stats = resumeService.getResumeStats(user);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Failed to fetch stats: " + e.getMessage()));
        }
    }

    // Helper class for response messages
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
