package com.moyo.oms.backend.repository;

import com.moyo.oms.backend.entity.Order;
import com.moyo.oms.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders for a specific user
    List<Order> findByUserId(String userId);

    // Find all orders for a specific product
    List<Order> findByProduct(Product product);

    // Find orders by product and status (optional, for deletion checks)
    List<Order> findByProductAndStatus(Product product, String status);
}
