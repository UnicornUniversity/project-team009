package com.wineProject.demo.message;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 13:41
 */
public class LoginResponse {
    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}