package com.resuchain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "resumes")
public class Resume {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String filePath;
    
    @Column(columnDefinition = "LONGTEXT")
    private String rawText;
    
    @Column(columnDefinition = "JSON")
    private String parsedSkills;
    
    @Column(columnDefinition = "JSON")
    private String parsedEducation;
    
    @Column(columnDefinition = "JSON")
    private String parsedExperience;
    
    @Enumerated(EnumType.STRING)
    private ProcessingStatus processingStatus = ProcessingStatus.PENDING;
    
    private int verificationProgress = 0;
    
    @Column(updatable = false)
    private LocalDateTime uploadedAt;
    
    private LocalDateTime processedAt;
    
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Experience> experiences;
    
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Education> educations;
    
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Skill> skills;
    
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Certificate> certificates;
    
    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getRawText() {
        return rawText;
    }
    
    public void setRawText(String rawText) {
        this.rawText = rawText;
    }
    
    public String getParsedSkills() {
        return parsedSkills;
    }
    
    public void setParsedSkills(String parsedSkills) {
        this.parsedSkills = parsedSkills;
    }
    
    public String getParsedEducation() {
        return parsedEducation;
    }
    
    public void setParsedEducation(String parsedEducation) {
        this.parsedEducation = parsedEducation;
    }
    
    public String getParsedExperience() {
        return parsedExperience;
    }
    
    public void setParsedExperience(String parsedExperience) {
        this.parsedExperience = parsedExperience;
    }
    
    public ProcessingStatus getProcessingStatus() {
        return processingStatus;
    }
    
    public void setProcessingStatus(ProcessingStatus processingStatus) {
        this.processingStatus = processingStatus;
    }
    
    public int getVerificationProgress() {
        return verificationProgress;
    }
    
    public void setVerificationProgress(int verificationProgress) {
        this.verificationProgress = verificationProgress;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public List<Experience> getExperiences() {
        return experiences;
    }
    
    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }
    
    public List<Education> getEducations() {
        return educations;
    }
    
    public void setEducations(List<Education> educations) {
        this.educations = educations;
    }
    
    public List<Skill> getSkills() {
        return skills;
    }
    
    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }
    
    public List<Certificate> getCertificates() {
        return certificates;
    }
    
    public void setCertificates(List<Certificate> certificates) {
        this.certificates = certificates;
    }
}

enum ProcessingStatus {
    PENDING, PROCESSING, COMPLETED, FAILED
}
