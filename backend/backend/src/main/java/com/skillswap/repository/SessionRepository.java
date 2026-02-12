package com.skillswap.repository;

import com.skillswap.model.Session;
import com.skillswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Finds all sessions where the user is EITHER the mentor OR the mentee
    List<Session> findByMentorOrMentee(User mentor, User mentee);
}