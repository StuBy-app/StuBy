package org.example.stuby_back.exception.auth;

import lombok.Data;
import org.example.stuby_back.dto.error.SimpleErrorDto;

@Data
public class LoginException extends RuntimeException {

    private SimpleErrorDto errorDto;

    public LoginException(String title, String errorMessage) {
        super(errorMessage);
        this.errorDto = new SimpleErrorDto(title, errorMessage);
    }
}
