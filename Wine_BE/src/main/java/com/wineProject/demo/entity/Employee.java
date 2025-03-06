package com.wineProject.demo.entity;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:04
 */
import com.wineProject.demo.role.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="employee")
public class Employee {
    @Id
    @Column(name = "employee_id", length = 45)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int employeeid;
    @Column(name = "employee_name", length = 255)
    private String employeename;
    @Column(name = "email", length = 255)
    private String email;
    @Column(name = "password", length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public Employee(String employeename, String email, String password, UserRole role) {
        this.employeename = employeename;
        this.email = email;
        this.password = password;
        this.role = role;
    }

}