package com.skillswap.service;

import com.skillswap.model.Skills;
import com.skillswap.model.User;
import com.skillswap.repository.SkillsRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillsRepository skillsRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔥 ADD THIS MISSING METHOD 🔥
    public User addSkillToUser(Long userId, Long skillId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skills skill = skillsRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        // Add skill only if they don't have it yet
        if (!user.getSkills().contains(skill)) {
            user.getSkills().add(skill);
            return userRepository.save(user); // This saves the link in "user_skills" table
        }
        return user;
    }

    public User loginOrRegister(String email) {
        // 1. Check if user exists
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // 2. If NOT found, create a new one
                    User newUser = new User();
                    newUser.setEmail(email);

                    // Simple hack: use "aryaman" as name if email is "aryaman@isb.edu"
                    String derivedName = email.split("@")[0];
                    newUser.setName(derivedName);

                    return userRepository.save(newUser);
                });
    }
}
