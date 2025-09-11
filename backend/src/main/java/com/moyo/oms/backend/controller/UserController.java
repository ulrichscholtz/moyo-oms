// src/main/java/com/moyo/oms/backend/controller/UserController.java
package com.moyo.oms.backend.controller;

import com.moyo.oms.backend.entity.User;
import com.moyo.oms.backend.service.UserService;
import com.moyo.oms.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
    return userService.login(user.getEmail(), user.getPassword());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

}
