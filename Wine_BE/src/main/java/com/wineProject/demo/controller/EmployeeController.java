package com.wineProject.demo.controller;

import com.wineProject.demo.dto.EmployeeDto;
import com.wineProject.demo.dto.LoginDto;
import com.wineProject.demo.message.LoginMessage;
import com.wineProject.demo.role.UserRole;
import com.wineProject.demo.service.EmployeeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:44
 */
@RestController
@CrossOrigin
@RequestMapping("api/v1/employee")
public class EmployeeController {
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    @Autowired
    private EmployeeService employeeService;

    @PostMapping(path = "/save")
    public String saveEmployee(@RequestBody EmployeeDto employeeDTO) {
        logger.info("Přijatý požadavek na vytvoření zaměstnance: {}", employeeDTO);

        try {
            String id = employeeService.addEmployee(employeeDTO);
            logger.info("Zaměstnanec úspěšně vytvořen s ID: {}", id);
            return id;
        } catch (Exception e) {
            logger.error("Chyba při vytváření zaměstnance: {}", e.getMessage(), e);
            throw new RuntimeException("Chyba při ukládání zaměstnance", e);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{email}/add-role")
    public ResponseEntity<?> addRoleToEmployee(@PathVariable String email, @RequestParam UserRole role) {
        logger.info(" Požadavek na přidání role '{}' uživateli '{}'", role, email);

        boolean roleAdded = employeeService.addRoleToEmployee(email, role);

        if (!roleAdded) {
            logger.warn(" Uživatel '{}' už má roli '{}'", email, role);
            return ResponseEntity.badRequest().body("User already has role: " + role);
        }

        logger.info(" Role '{}' úspěšně přidána uživateli '{}'", role, email);
        return ResponseEntity.ok("Role " + role + " added to user " + email);
    }

}
