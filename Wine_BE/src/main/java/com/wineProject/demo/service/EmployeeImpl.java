package com.wineProject.demo.service;

import com.wineProject.demo.dto.EmployeeDto;
import com.wineProject.demo.dto.LoginDto;
import com.wineProject.demo.entity.Employee;
import com.wineProject.demo.message.LoginMessage;
import com.wineProject.demo.repository.EmployeeRepository;
import com.wineProject.demo.role.UserRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:28
 */
@Service("employeeService")
public class EmployeeImpl implements EmployeeService, UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    @Autowired
    private EmployeeRepository employeeRepo;
    @Lazy
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public String addEmployee(EmployeeDto employeeDTO) {
        Employee employee = new Employee(
                employeeDTO.getEmployeeName(),
                employeeDTO.getEmail(),
                passwordEncoder.encode(employeeDTO.getPassword()),
                employeeDTO.getUserRole() != null ? employeeDTO.getUserRole() : UserRole.WORKER
        );

        employeeRepo.save(employee);
        return "User saved: " + employee.getEmployeeName();
    }
    EmployeeDto employeeDTO;

    @Override
    public LoginMessage  loginEmployee(LoginDto loginDTO) {
        String msg = "";
        Employee employee1 = employeeRepo.findByEmail(loginDTO.getEmail()) .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginDTO.getEmail()));;
        if (employee1 != null) {
            String password = loginDTO.getPassword();
            String encodedPassword = employee1.getPassword();
            Boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
            if (isPwdRight) {
                Optional<Employee> employee = employeeRepo.findOneByEmailAndPassword(loginDTO.getEmail(), encodedPassword);
                if (employee.isPresent()) {
                    return new LoginMessage("Login Success", true);
                } else {
                    return new LoginMessage("Login Failed", false);
                }
            } else {
                return new LoginMessage("password Not Match", false);
            }
        }else {
            return new LoginMessage("Email not exits", false);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee employee = employeeRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + employee.getRole())); // ✅ Přidává prefix jen tady

        return new org.springframework.security.core.userdetails.User(
                employee.getEmail(),
                employee.getPassword(),
                authorities
        );
    }


    @Override
    public boolean addRoleToEmployee(String email, UserRole role) {
        logger.info("🔍 Hledám uživatele s emailem '{}'", email);

        Employee employee = employeeRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));;
        if (employee == null) {
            logger.error("Uživatel '{}' neexistuje!", email);
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        logger.info("Uživatel '{}' nalezen. Aktuální role: '{}'", email, employee.getRole());

        if (employee.getRole() == role) {
            logger.warn("Uživatel '{}' už má roli '{}'", email, role);
            return false;
        }

        employee.setRole(role);
        employeeRepo.save(employee);
        logger.info("Role '{}' úspěšně přidána uživateli '{}'", role, email);
        return true;
    }

}