package com.wineProject.demo.service;

import com.wineProject.demo.dto.EmployeeDto;
import com.wineProject.demo.dto.LoginDto;
import com.wineProject.demo.message.LoginMessage;
import com.wineProject.demo.role.UserRole;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:27
 */
public interface EmployeeService {
    String addEmployee(EmployeeDto employeeDTO);

    LoginMessage loginEmployee(LoginDto loginDTO);

    boolean addRoleToEmployee(String email, UserRole role);
}
