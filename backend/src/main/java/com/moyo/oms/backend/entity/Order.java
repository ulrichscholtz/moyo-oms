package com.moyo.oms.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDateTime dateOfOrder; 

    @Column(nullable = false)
    private int amount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private String userId; // Owner of the order

    public Order() {}

    public Order(Product product, int amount, String status, BigDecimal total, String userId) {
        this.product = product;
        this.amount = amount;
        this.status = status;
        this.total = total;
        this.userId = userId;
        this.dateOfOrder = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDateTime getDateOfOrder() { return dateOfOrder; }
    public void setDateOfOrder(LocalDateTime dateOfOrder) { this.dateOfOrder = dateOfOrder; }
}
