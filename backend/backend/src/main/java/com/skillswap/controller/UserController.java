package com.skillswap.controller;

import com.skillswap.model.User;
import com.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // This allows React to talk to Java
public class UserController {

    @Autowired
    private UserService userService;

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
}