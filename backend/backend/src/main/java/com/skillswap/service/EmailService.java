package com.skillswap.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendConnectionRequestEmail(String toEmail, String senderName, String messageContent) {
        sendEmail(toEmail, "New Uplink Request: " + senderName,
                "Agent " + senderName + " wants to connect.\n\nMessage: \"" + messageContent + "\"");
    }

    @Async
    public void sendSessionConfirmation(String toEmail, String withUser, String time, String link) {
        sendEmail(toEmail, "Mission Confirmed: Session with " + withUser,
                "Uplink Established.\n\nTarget: " + withUser + "\nTime: " + time + "\n\nSecure Link: " + link);
    }

    @Async
    public void sendMeetingReminder(String toEmail, String withUser, String link) {
        sendEmail(toEmail, "REMINDER: Session in 15 Minutes",
                "Action Required. Your session with " + withUser + " begins soon.\n\nJoin Link: " + link);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Automatically uses the email from your Render environment
            message.setFrom("patil.shreyansh.18@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            System.out.println("✅ EMAIL SENT to " + to);
        } catch (Exception e) {
            System.err.println("❌ EMAIL FAILED: " + e.getMessage());
            e.printStackTrace();
        }
    }
}