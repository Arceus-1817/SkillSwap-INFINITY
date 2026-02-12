package com.skillswap.controller;

import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.MessageRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo;

    // 1. SEND MESSAGE
    @PostMapping("/send")
    public Message sendMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String text = (String) payload.get("text");

        User sender = userRepo.findById(senderId).orElseThrow();
        User receiver = userRepo.findById(receiverId).orElseThrow();

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setText(text);
        msg.setTimestamp(LocalDateTime.now()); // Set time manually to be safe

        return messageRepo.save(msg);
    }

    // 2. GET CONVERSATION (History)
    @GetMapping("/{userId1}/{userId2}")
    public List<Message> getConversation(@PathVariable Long userId1, @PathVariable Long userId2) {
        User user1 = userRepo.findById(userId1).orElseThrow();
        User user2 = userRepo.findById(userId2).orElseThrow();

        return messageRepo.findConversation(user1, user2);
    }
}