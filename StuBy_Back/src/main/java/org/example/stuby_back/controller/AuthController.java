package org.example.stuby_back.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.stuby_back.dto.auth.JoinReqDto;
import org.example.stuby_back.dto.auth.LoginReqDto;
import org.example.stuby_back.dto.response.ResponseDto;
import org.example.stuby_back.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /*
        회원가입 API
     */
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody @Valid JoinReqDto dto) throws BindException {
        return ResponseEntity.ok(ResponseDto.success(authService.join(dto)));
    }

    /*
        로그인 API
    */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReqDto dto) {
        return ResponseEntity.ok(ResponseDto.success(authService.login(dto)));
    }

}