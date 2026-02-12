package com.skillswap.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "connections")
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    private String status; // "PENDING", "ACCEPTED", "REJECTED"

    private String message; // 👈 Renamed from 'requestMessage' to match React!

    private LocalDateTime createdAt = LocalDateTime.now();
}