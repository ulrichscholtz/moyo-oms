// src/main/java/com/moyo/oms/backend/controller/ProductController.java
package com.moyo.oms.backend.controller;

import com.moyo.oms.backend.entity.Product;
import com.moyo.oms.backend.service.ProductService;
import com.moyo.oms.backend.exception.ProductDeletionException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getUserProducts(@RequestParam String userId) {
        return productService.getProductsByUser(userId);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product newProduct) {
        return productService.createProduct(newProduct);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
        } catch (ProductDeletionException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
