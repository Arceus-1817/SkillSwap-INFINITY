package com.skillswap.scheduler;

import com.skillswap.model.Session;
import com.skillswap.repository.SessionRepository;
import com.skillswap.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class SessionScheduler {

    @Autowired
    private SessionRepository sessionRepo;

    @Autowired
    private EmailService emailService;

    // Runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void checkUpcomingSessions() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fifteenMinutesLater = now.plusMinutes(15);

        // Find sessions starting within 15 mins that haven't been reminded yet
        List<Session> upcomingSessions = sessionRepo.findAll().stream()
                .filter(s -> !s.isReminderSent())
                .filter(s -> s.getStartTime().isAfter(now) && s.getStartTime().isBefore(fifteenMinutesLater))
                .toList();

        for (Session session : upcomingSessions) {
            // Send to Mentor
            emailService.sendMeetingReminder(
                    session.getMentor().getEmail(),
                    session.getMentee().getName(),
                    session.getMeetingLink()
            );

            // Send to Mentee
            emailService.sendMeetingReminder(
                    session.getMentee().getEmail(),
                    session.getMentor().getName(),
                    session.getMeetingLink()
            );

            // Mark as sent so we don't send again
            session.setReminderSent(true);
            sessionRepo.save(session);
            System.out.println("⏰ Reminder sent for Session ID: " + session.getId());
        }
    }
}