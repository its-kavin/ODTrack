package com.example.odsystem.controller;

import com.example.odsystem.model.ODRequest;
import com.example.odsystem.repository.ODRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/od")
public class ODRequestController {

    @Autowired
    private ODRequestRepository repository;

    // 🧑 Student submits OD request
    @PostMapping("/request")
    public ODRequest submitRequest(@RequestBody ODRequest request) {
        return repository.save(request);
    }

    // 👨‍🏫 Counsellor sees all pending requests
    @GetMapping("/pending")
    public List<ODRequest> getPendingRequests() {
        return repository.findByStatus("Pending");
    }

    // ✅ Counsellor approves OD request
    @PutMapping("/approve/{id}")
    public String approveRequest(@PathVariable Long id) {
        ODRequest request = repository.findById(id).orElse(null);
        if (request != null) {
            request.setStatus("Approved");
            repository.save(request);
            return "Request Approved";
        } else {
            return "Request not found";
        }
    }

    // 👨‍🎓 Student views their requests
    @GetMapping("/student/{studentId}")
    public List<ODRequest> getStudentRequests(@PathVariable String studentId) {
        return repository.findByStudentId(studentId);
    }
}
