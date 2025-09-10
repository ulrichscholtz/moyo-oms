// src/main/java/com/moyo/oms/backend/service/ProductService.java
package com.moyo.oms.backend.service;

import com.moyo.oms.backend.entity.Product;
import com.moyo.oms.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products for a specific user
    public List<Product> getProductsByUser(String userId) {
        return productRepository.findByUserId(userId);
    }

    // Create a new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Update an existing product
    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) throw new RuntimeException("Product not found");
        Product product = productOpt.get();
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setUserId(updatedProduct.getUserId());
        return productRepository.save(product);
    }

    // Delete a product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
