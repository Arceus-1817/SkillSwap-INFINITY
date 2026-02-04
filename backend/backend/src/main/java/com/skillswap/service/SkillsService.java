package com.skillswap.service;

import com.skillswap.model.Skills;
import com.skillswap.repository.SkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillsService {
    @Autowired
    private SkillsRepository skillsRepository;

    public Skills AddSkills(Skills skills) {
        return skillsRepository.save(skills);
    }

    public List<Skills> getAllSkills() {
        return skillsRepository.findAll();
    }
}
