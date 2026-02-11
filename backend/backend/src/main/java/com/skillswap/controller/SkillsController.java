package com.skillswap.controller;


import com.skillswap.model.Skills;
import com.skillswap.service.SkillsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
// @CrossOrigin(origins = "http://localhost:5173")
public class SkillsController {

    @Autowired
    private SkillsService skillsService;

    @PostMapping
    public Skills AddSkills(@RequestBody Skills skills) {
        return skillsService.AddSkills(skills);
    }

    @GetMapping
    public List<Skills> getSkills() {
        return skillsService.getAllSkills();
    }
}
