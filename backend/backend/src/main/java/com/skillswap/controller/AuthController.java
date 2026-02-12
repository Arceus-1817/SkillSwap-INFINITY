package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. SAFE REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if email exists
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            // Return 409 Conflict instead of 500 Error
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Error: Email is already in use!");
        }

        try {
            // Encrypt and Save
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRole("USER");
            User savedUser = userRepo.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving user: " + e.getMessage());
        }
    }

    // 2. SAFE LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOptional = userRepo.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: User not found");
        }

        User user = userOptional.get();

        // Check Password
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid password");
        }
    }
}