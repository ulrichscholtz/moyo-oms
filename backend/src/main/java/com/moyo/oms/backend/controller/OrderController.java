package com.moyo.oms.backend.controller;

import com.moyo.oms.backend.entity.Order;
import com.moyo.oms.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // GET all orders by userId
    @GetMapping
    public List<Order> getOrdersByUserId(@RequestParam String userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // GET one order by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id).orElseThrow(() -> 
            new RuntimeException("Order not found with ID " + id)
        );
    }

    // POST create order
    @PostMapping
    public Order createOrder(@RequestBody Map<String, Object> payload) {
        Long productId = Long.parseLong(payload.get("productId").toString());
        int amount = Integer.parseInt(payload.get("amount").toString());
        String status = payload.get("status").toString();
        String userId = payload.get("userId").toString();

        return orderService.createOrder(productId, amount, status, userId);
    }

    // PUT update order status
    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return orderService.updateOrder(id, payload.get("status"));
    }

    // DELETE order
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}
