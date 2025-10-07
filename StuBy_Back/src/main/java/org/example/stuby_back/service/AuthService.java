package org.example.stuby_back.service;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.domain.user.UserMapper;
import org.example.stuby_back.dto.auth.JoinReqDto;
import org.example.stuby_back.dto.auth.LoginReqDto;
import org.example.stuby_back.dto.auth.TokenDto;
import org.example.stuby_back.exception.auth.LoginException;
import org.example.stuby_back.security.jwt.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

//    @Transactional(rollbackFor = Exception.class)
//    public void join(JoinReqDto dto) throws BindException {
//        User founddUser = userMapper.findByUsername(dto.getUsername());
//        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
//        userMapper.insert(dto);
//    }

    public TokenDto login(LoginReqDto dto) {

        User foundUser = userMapper.findByUsername(dto.getUsername());
        if (foundUser == null) {
            throw new LoginException("로그인 오류", "사용자 정보를 다시 확인하세요.");
        }
        if (!passwordEncoder.matches(dto.getPassword(), foundUser.getPassword())) {
            throw new LoginException("로그인 오류", "사용자 정보를 다시 확인하세요.");
        }

//        System.out.println(jwtUtil.generateAccessToken(foundUser));

        return TokenDto.builder()
                .accessToken(jwtUtil.generateAccessToken(foundUser))
                .build();
    }

}
