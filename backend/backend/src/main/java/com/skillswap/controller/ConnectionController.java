package com.skillswap.controller;

import com.skillswap.model.Connection;
import com.skillswap.model.User;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:5173")
public class ConnectionController {

    @Autowired
    private ConnectionRepository connectionRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private com.skillswap.service.EmailService emailService;

    // 1. Send Request
    @PostMapping("/request")
    public Connection sendRequest(
            @RequestParam Long requesterId,
            @RequestParam Long receiverId,
            @RequestParam(required = false) String message
    ) {
        User requester = userRepo.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        User receiver = userRepo.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Check for duplicates
        if (connectionRepo.existsByRequesterAndReceiver(requester, receiver)) {
            throw new RuntimeException("Request already sent!");
        }

        Connection conn = new Connection();
        conn.setRequester(requester);
        conn.setReceiver(receiver);
        conn.setStatus("PENDING");
        conn.setMessage(message); // Now matches the Model field
        Connection savedConn = connectionRepo.save(conn);
        if (receiver.getEmail() != null && !receiver.getEmail().isEmpty()) {
            emailService.sendConnectionRequestEmail(
                    receiver.getEmail(),
                    requester.getName(),
                    message
            );
        }
        return connectionRepo.save(conn);
    }

    // 2. Get Pending Requests
    @GetMapping("/pending/{userId}")
    public List<Connection> getPendingRequests(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepo.findByReceiverAndStatus(user, "PENDING");
    }

    // 3. UPDATE STATUS (Fixes the 404 Error)
    // This handles both "ACCEPTED" and "REJECTED"
    @PutMapping("/{connectionId}/status")
    public Connection updateStatus(
            @PathVariable Long connectionId,
            @RequestParam String status
    ) {
        Connection conn = connectionRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        // Convert "accepted" -> "ACCEPTED" to match DB convention
        conn.setStatus(status.toUpperCase());

        return connectionRepo.save(conn);
    }

    // 4. Get ALL My Connections (Accepted, Pending, Rejected)
    @GetMapping("/user/{userId}")
    public List<Connection> getMyConnections(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Uses the new clean query with ONE parameter
        return connectionRepo.findAllConnections(user);
    }
}