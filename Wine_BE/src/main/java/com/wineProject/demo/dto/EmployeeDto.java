package com.wineProject.demo.dto;

import com.wineProject.demo.role.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:08
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    private int employeeid;
    private String employeename;
    private String email;
    private String password;
    private UserRole userRole;

}
