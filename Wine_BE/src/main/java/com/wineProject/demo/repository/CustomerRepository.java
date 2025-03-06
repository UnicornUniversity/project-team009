package com.wineProject.demo.repository;

import com.wineProject.demo.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 16:53
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
}
