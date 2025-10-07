package org.example.stuby_back.dto.auth;

import lombok.Data;

@Data
public class LoginReqDto {
    private String username;
    private String password;
}
