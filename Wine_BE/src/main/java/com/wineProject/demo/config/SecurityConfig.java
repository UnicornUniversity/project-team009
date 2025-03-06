package com.wineProject.demo.config;


import com.wineProject.demo.service.CustomerDetailsService;
import com.wineProject.demo.service.EmployeeImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:42
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private EmployeeImpl employeeService;


    @Autowired
    private CustomerDetailsService customerService;

    private JwtFilter jwtFilter;

    @Autowired
    public void setJwtFilter(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/auth/login", "/api/auth/register", "/swagger-ui/**", "/v3/api-docs/**", "/api/v1/customer/*").permitAll()
                        .requestMatchers("/api/v1/employee/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/customer/**").hasRole("CUSTOMER")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin().disable()
                .httpBasic().disable();
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider employeeAuthProvider = new DaoAuthenticationProvider();
        employeeAuthProvider.setUserDetailsService(employeeService);
        employeeAuthProvider.setPasswordEncoder(passwordEncoder());

        DaoAuthenticationProvider customerAuthProvider = new DaoAuthenticationProvider();
        customerAuthProvider.setUserDetailsService(customerService);
        customerAuthProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(List.of(employeeAuthProvider, customerAuthProvider));
    }

}
