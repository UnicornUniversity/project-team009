package com.wineProject.demo.repository;

import com.wineProject.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:26
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Integer> {
    Optional<Employee> findOneByEmailAndPassword(String email, String password);
    Optional<Employee>findByEmail(String email);
}
