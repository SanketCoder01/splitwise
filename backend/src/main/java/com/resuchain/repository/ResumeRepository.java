package com.resuchain.repository;

import com.resuchain.model.Resume;
import com.resuchain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    
    List<Resume> findByUser(User user);
    
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    
    Optional<Resume> findByUserAndId(User user, Long id);
    
    long countByUser(User user);
}
