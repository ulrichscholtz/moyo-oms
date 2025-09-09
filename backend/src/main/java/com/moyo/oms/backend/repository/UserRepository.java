// src/main/java/com/moyo/oms/backend/repository/UserRepository.java
package com.moyo.oms.backend.repository;

import com.moyo.oms.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
