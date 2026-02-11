package com.skillswap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "skills")
@Data
@JsonIgnoreProperties("users")
public class Skills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skillName;

    @ManyToMany(mappedBy = "skills")
    private List<User> users;
}