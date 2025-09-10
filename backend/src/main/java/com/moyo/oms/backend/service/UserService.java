// src/main/java/com/moyo/oms/backend/service/UserService.java
package com.moyo.oms.backend.service;

import com.moyo.oms.backend.entity.User;
import com.moyo.oms.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // hash password
        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {
    Optional<User> optionalUser = userRepository.findByEmail(email);
    if (optionalUser.isEmpty()) {
        throw new RuntimeException("User not found");
    }

    User user = optionalUser.get();
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    if (!encoder.matches(rawPassword, user.getPassword())) {
        throw new RuntimeException("Incorrect password");
    }

    return user; // optionally return a DTO instead of full User
}

    // UserService.java
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
