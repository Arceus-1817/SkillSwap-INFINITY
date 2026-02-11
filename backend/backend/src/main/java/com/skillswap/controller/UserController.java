package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:5173") // This allows React to talk to Java
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{userId}/skills/{skillId}")
    public User addSkill(@PathVariable Long userId, @PathVariable Long skillId) {
        return userService.addSkillToUser(userId, skillId);
    }

    @PostMapping("/login") // Changed from /register to be more generic
    public User login(@RequestBody User loginRequest) {
        // We expect JSON: { "email": "aryaman@isb.edu" }
        // The service logic we wrote earlier handles "Find OR Create"
        return userService.loginOrRegister(loginRequest.getEmail());
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String skill) {
        return userRepository.findBySkills_SkillNameContainingIgnoreCase(skill);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Only update fields that are sent
        if (userDetails.getName() != null) user.setName(userDetails.getName());
        if (userDetails.getBio() != null) user.setBio(userDetails.getBio());
        if (userDetails.getAvatarUrl() != null) user.setAvatarUrl(userDetails.getAvatarUrl());

        return userRepository.save(user);
    }
}