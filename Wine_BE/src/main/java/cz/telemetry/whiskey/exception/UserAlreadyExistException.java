package cz.telemetry.whiskey.exception;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistException extends WhiskeyException {

  public UserAlreadyExistException(String username) {
    super("User already exist", HttpStatus.BAD_REQUEST,
        "User with username " + username + " already exists",
        "002");
  }

}
