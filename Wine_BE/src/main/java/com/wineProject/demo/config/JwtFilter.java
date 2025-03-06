package com.wineProject.demo.config;

import com.wineProject.demo.service.EmployeeService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserDetailsService employeeService;
    private final UserDetailsService customerService;



    @Autowired
    public JwtFilter(JwtUtil jwtUtil,
                     @Qualifier("employeeService") UserDetailsService employeeService,
                     @Qualifier("customerDetailsService") UserDetailsService customerService) {
        this.jwtUtil = jwtUtil;
        this.employeeService = employeeService;
        this.customerService = customerService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = extractJwtFromRequest(request);

        if (token != null && jwtUtil.validateToken(token,jwtUtil.extractEmail(token))) {
            String email = jwtUtil.extractEmail(token);
            UserDetails userDetails = employeeService.loadUserByUsername(email);

            if (userDetails == null) {
                userDetails = customerService.loadUserByUsername(email);
            }

            if (userDetails != null) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("🔍 JWT ověřen pro uživatele: " + userDetails.getUsername());
                System.out.println("🔍 Role uživatele: " + userDetails.getAuthorities());
            } else {
                System.out.println("❌ Uživatel nebyl nalezen v EmployeeService ani CustomerService");
            }
        } else {
            System.out.println("❌ Token není platný nebo chybí!");
        }

        chain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Odstraní "Bearer " prefix a vrátí jen JWT token
        }

        return null; // Pokud token není přítomen nebo není ve správném formátu
    }


}
