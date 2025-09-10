// src/main/java/com/moyo/oms/backend/controller/ProductController.java
package com.moyo.oms.backend.controller;

import com.moyo.oms.backend.entity.Product;
import com.moyo.oms.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products for a specific user
    @GetMapping
    public List<Product> getUserProducts(@RequestParam String userId) {
        return productService.getProductsByUser(userId);
    }

    // Create a new product
    @PostMapping
    public Product createProduct(@RequestBody Product newProduct) {
        return productService.createProduct(newProduct);
    }

    // Update a product by ID
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct);
    }

    // Delete a product by ID
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}
