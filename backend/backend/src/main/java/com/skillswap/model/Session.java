package com.skillswap.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private User mentor;

    @ManyToOne
    @JoinColumn(name = "mentee_id")
    private User mentee;

    private LocalDateTime startTime;
    private int durationMinutes;
    private String status;
    private String meetingLink;

    // Just a standard field. No fancy annotations.
    // The Controller will fill this in.
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean reminderSent = false;
}