package com.wineProject.demo.message;

/**
 * Created by User: Vu
 * Date: 05.03.2025
 * Time: 9:30
 */
public class LoginMessage {
    String message;
    Boolean status;
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Boolean getStatus() {
        return status;
    }
    public void setStatus(Boolean status) {
        this.status = status;
    }
    public LoginMessage(String message, Boolean status) {
        this.message = message;
        this.status = status;
    }

}
