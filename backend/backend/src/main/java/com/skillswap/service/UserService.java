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

    public User addSkillToUser(Long userId, Long skillId) {
        // 1. Fetch the user and skill objects from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Skills skill = skillsRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        // 2. Add the skill to the user's list
        user.getSkills().add(skill);

        // 3. Save the user back to the database
        return userRepository.save(user);
    }
}
