package com.skillswap.repository;

import com.skillswap.model.Connection;
import com.skillswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // 1. Find Pending Requests sent TO me
    List<Connection> findByReceiverAndStatus(User receiver, String status);

    // 2. Check if a connection exists (Boolean check)
    @Query("SELECT COUNT(c) > 0 FROM Connection c WHERE " +
            "(c.requester = :user1 AND c.receiver = :user2) OR " +
            "(c.requester = :user2 AND c.receiver = :user1)")
    boolean existsByRequesterAndReceiver(@Param("user1") User user1, @Param("user2") User user2);

    // 3. SECURE CHECK: Are they specifically ACCEPTED?
    @Query("SELECT COUNT(c) > 0 FROM Connection c WHERE " +
            "(c.requester = :user1 AND c.receiver = :user2 AND c.status = 'ACCEPTED') OR " +
            "(c.requester = :user2 AND c.receiver = :user1 AND c.status = 'ACCEPTED')")
    boolean areConnected(@Param("user1") User user1, @Param("user2") User user2);

    // 🔥 4. THE FIX: Find ALL connections for a specific user (Sent OR Received)
    // This replaces the confusing findByRequesterOrReceiver(user, user)
    @Query("SELECT c FROM Connection c WHERE c.requester = :user OR c.receiver = :user")
    List<Connection> findAllConnections(@Param("user") User user);
}