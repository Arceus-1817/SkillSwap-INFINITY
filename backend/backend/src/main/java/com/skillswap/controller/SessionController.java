package com.skillswap.controller;

import com.skillswap.model.Session;
import com.skillswap.model.User;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ConnectionRepository connectionRepo;

    @Autowired
    private EmailService emailService;

    // 1. Schedule a Session
    @PostMapping("/schedule")
    public Session scheduleSession(
            @RequestParam Long mentorId,
            @RequestParam Long menteeId,
            @RequestParam String startTime
    ) {
        // 🛠️ FIX: React sends "2023-10-25T14:30", Java wants "2023-10-25T14:30:00"
        if (startTime.length() == 16) {
            startTime = startTime + ":00";
        }

        User mentor = userRepo.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        User mentee = userRepo.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("Mentee not found"));

        // 🔒 SECURITY: Must be connected to book!
        if (!connectionRepo.existsByRequesterAndReceiver(mentor, mentee)) {
            throw new RuntimeException("ACCESS DENIED: You must connect with this mentor first!");
        }

        Session session = new Session();
        session.setMentor(mentor);
        session.setMentee(mentee);
        session.setStartTime(LocalDateTime.parse(startTime)); // Now safe to parse
        session.setDurationMinutes(60);
        session.setStatus("CONFIRMED");
        // Auto-generate a video link
        session.setMeetingLink("https://meet.jit.si/SkillSwap-" + UUID.randomUUID());
        session.setCreatedAt(LocalDateTime.now());
        Session savedSession = sessionRepo.save(session);

        // 📧 SEND CONFIRMATION EMAILS
        if(mentee.getEmail() != null) {
            emailService.sendSessionConfirmation(mentee.getEmail(), mentor.getName(), startTime, savedSession.getMeetingLink());
        }
        if(mentor.getEmail() != null) {
            emailService.sendSessionConfirmation(mentor.getEmail(), mentee.getName(), startTime, savedSession.getMeetingLink());
        }
        return sessionRepo.save(session);
    }

    // 2. Get My Sessions (Upcoming)
    @GetMapping("/user/{userId}")
    public List<Session> getMySessions(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        // Return sessions where I am EITHER the mentor OR the mentee
        return sessionRepo.findByMentorOrMentee(user, user);
    }

    @DeleteMapping("/{id}")
    public void cancelSession(@PathVariable Long id) {
        sessionRepo.deleteById(id);
    }


}