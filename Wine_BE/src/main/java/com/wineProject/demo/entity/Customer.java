package com.wineProject.demo.entity;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 16:36
 */
import jakarta.persistence.*;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id")
    private Long id;

    @Column(name = "c_email", unique = true, nullable = false)
    private String email;

    @Column(name = "c_username", nullable = false)
    private String username;

    @Column(name = "c_password", nullable = false)
    private String password;

    @CreationTimestamp
    @Column(name = "c_created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "c_updated_at")
    private LocalDateTime updatedAt;

}

