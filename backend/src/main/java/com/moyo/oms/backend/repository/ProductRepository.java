// src/main/java/com/moyo/oms/backend/repository/ProductRepository.java
package com.moyo.oms.backend.repository;

import com.moyo.oms.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find all products for a specific user
    List<Product> findByUserId(String userId);
}
