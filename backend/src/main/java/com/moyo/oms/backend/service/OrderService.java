package com.moyo.oms.backend.service;

import com.moyo.oms.backend.entity.Order;
import com.moyo.oms.backend.entity.Product;
import com.moyo.oms.backend.repository.OrderRepository;
import com.moyo.oms.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // Get all orders by userId
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    // Get single order by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Create order with random date in the last 30 days
    public Order createOrder(Long productId, int amount, String status, String userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < amount) {
            throw new RuntimeException("Not enough stock for this product");
        }

        // Reduce stock
        product.setStock(product.getStock() - amount);
        productRepository.save(product);

        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(amount));

        // Create order
        Order order = new Order(product, amount, status, total, userId);

        // Generate random date within the last 30 days
        LocalDateTime now = LocalDateTime.now();
        long startEpoch = now.minusDays(30).toEpochSecond(java.time.ZoneOffset.UTC);
        long endEpoch = now.toEpochSecond(java.time.ZoneOffset.UTC);
        long randomEpoch = ThreadLocalRandom.current().nextLong(startEpoch, endEpoch + 1);
        LocalDateTime randomDate = LocalDateTime.ofEpochSecond(randomEpoch, 0, java.time.ZoneOffset.UTC);
        order.setDateOfOrder(randomDate);

        return orderRepository.save(order);
    }

    // Update order status
    public Order updateOrder(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepository.save(order);
    }

    // Delete order
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
