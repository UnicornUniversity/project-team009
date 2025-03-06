package com.wineProject.demo.controller;

import com.wineProject.demo.config.JwtUtil;
import com.wineProject.demo.dto.LoginDto;
import com.wineProject.demo.repository.EmployeeRepository;
import com.wineProject.demo.service.CustomerDetailsService;
import com.wineProject.demo.service.EmployeeImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 11:32
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmployeeImpl employeeService;

    @Autowired
    private CustomerDetailsService customerService;

    @Autowired
    EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        logger.info("🔍 Přihlašování uživatele: {}", loginDto.getEmail());

        try {
            boolean isEmployee = employeeRepository.findByEmail(loginDto.getEmail()) != null;

            logger.info("Kontroluji, zda uživatel je zaměstnanec: {}", isEmployee);

            UserDetails userDetails;
            if (isEmployee) {
                logger.info("Uživatel je zaměstnanec, načítám z EmployeeService");
                userDetails = employeeService.loadUserByUsername(loginDto.getEmail());
            } else {
                logger.info("Uživatel je zákazník, načítám z CustomerService");
                userDetails = customerService.loadUserByUsername(loginDto.getEmail());
            }

            logger.info("Provádím autentizaci...");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("Autentizace úspěšná pro uživatele: {}", loginDto.getEmail());

            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .orElseThrow(() -> {
                        logger.error("⚠️ Uživatel nemá žádné role!");
                        return new RuntimeException("User has no roles");
                    })
                    .getAuthority();

            logger.info("Role uživatele: {}", role);

            String token = jwtUtil.generateToken(userDetails.getUsername(), role);
            logger.info("Token úspěšně vygenerován");

            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            logger.error("Chyba při přihlašování: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

}
