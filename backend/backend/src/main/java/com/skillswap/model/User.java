package com.skillswap.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true) // No duplicate emails!
    private String email;

    // 🔒 SECURITY: Store the hash, but NEVER send it back to Frontend
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String role; // "USER" or "ADMIN"
    private String bio;
    private String avatarUrl;

    @ManyToMany(fetch = FetchType.EAGER) // Load skills automatically
    @JoinTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private List<Skills> skills;
}