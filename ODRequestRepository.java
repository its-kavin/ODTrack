package com.example.odsystem.repository;

import com.example.odsystem.model.ODRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ODRequestRepository extends JpaRepository<ODRequest, Long> {
    List<ODRequest> findByStatus(String status);
    List<ODRequest> findByStudentId(String studentId);
}
