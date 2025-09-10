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

    public List<Product> getProductsByUser(String userId) {
        return productRepository.findByUserId(userId);
    }

    public Product createProduct(Product newProduct) {
    // Simply save the new product to the repository
    return productRepository.save(newProduct);
    }


    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) throw new RuntimeException("Product not found");
        Product product = productOpt.get();
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
}
