package com.resuchain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "skills")
public class Skill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
    
    @Column(nullable = false)
    private String name;
    
    private String category;
    
    private int level = 0; // 0-5 scale
    
    private boolean assessed = false;
    
    private int assessmentScore = 0;
    
    @Enumerated(EnumType.STRING)
    private AssessmentStatus assessmentStatus = AssessmentStatus.NOT_STARTED;
    
    private LocalDateTime assessmentDate;
    
    @Column(columnDefinition = "TEXT")
    private String assessmentNotes;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Resume getResume() {
        return resume;
    }
    
    public void setResume(Resume resume) {
        this.resume = resume;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public int getLevel() {
        return level;
    }
    
    public void setLevel(int level) {
        this.level = level;
    }
    
    public boolean isAssessed() {
        return assessed;
    }
    
    public void setAssessed(boolean assessed) {
        this.assessed = assessed;
    }
    
    public int getAssessmentScore() {
        return assessmentScore;
    }
    
    public void setAssessmentScore(int assessmentScore) {
        this.assessmentScore = assessmentScore;
    }
    
    public AssessmentStatus getAssessmentStatus() {
        return assessmentStatus;
    }
    
    public void setAssessmentStatus(AssessmentStatus assessmentStatus) {
        this.assessmentStatus = assessmentStatus;
    }
    
    public LocalDateTime getAssessmentDate() {
        return assessmentDate;
    }
    
    public void setAssessmentDate(LocalDateTime assessmentDate) {
        this.assessmentDate = assessmentDate;
    }
    
    public String getAssessmentNotes() {
        return assessmentNotes;
    }
    
    public void setAssessmentNotes(String assessmentNotes) {
        this.assessmentNotes = assessmentNotes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

enum AssessmentStatus {
    NOT_STARTED, IN_PROGRESS, COMPLETED, FAILED
}
