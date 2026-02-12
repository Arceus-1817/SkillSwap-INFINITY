package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.UserService; // Ensure you have this service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // 1. GET ALL USERS (For the Dashboard)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2. SEARCH (For the Search Bar)
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String skill) {
        // Ensure your Repository has this method defined!
        return userRepository.findBySkills_SkillNameContainingIgnoreCase(skill);
    }

    // 3. UPDATE USER (For Profile Edit)
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDetails.getName() != null) user.setName(userDetails.getName());
        if (userDetails.getBio() != null) user.setBio(userDetails.getBio());
        if (userDetails.getAvatarUrl() != null) user.setAvatarUrl(userDetails.getAvatarUrl());

        return userRepository.save(user);
    }

    @PutMapping("/{userId}/skills/{skillId}")
    public User addSkill(@PathVariable Long userId, @PathVariable Long skillId) {
        return userService.addSkillToUser(userId, skillId);
    }

    // REMOVED: login() and register() - Use AuthController for those!
}