package org.example.stuby_back.service;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.role.Role;
import org.example.stuby_back.domain.role.RoleMapper;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.domain.user.UserMapper;
import org.example.stuby_back.domain.userRole.UserRole;
import org.example.stuby_back.domain.userRole.UserRoleMapper;
import org.example.stuby_back.dto.auth.JoinReqDto;
import org.example.stuby_back.dto.auth.LoginReqDto;
import org.example.stuby_back.dto.auth.TokenDto;
import org.example.stuby_back.exception.auth.LoginException;
import org.example.stuby_back.security.jwt.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final RoleMapper roleMapper;
    private final UserRoleMapper userRoleMapper;

    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Transactional(rollbackFor = BindException.class)
    public User join(JoinReqDto dto) throws BindException {
        // 유효성 검사 (Login ID 중복 확인)
        User foundUser = userMapper.findByUsername(dto.getUsername());
        if (foundUser == null) {
            BindingResult bindingResult = new BeanPropertyBindingResult(foundUser, "");
            FieldError fieldError = new FieldError("username", "username", "이미 존재하는 아이디입니다.");
            bindingResult.addError(fieldError);
            throw new BindException(bindingResult);
        }

        User joinUser = dto.toUser(passwordEncoder);
        userMapper.insert(joinUser);

        final String DEFAULT_USER_ROLE = "ROLE_USER";
        Role foundRole = roleMapper.findByRoleName(DEFAULT_USER_ROLE);

        UserRole userRole = UserRole.builder()
                .userId(joinUser.getUserId())
                .roleId(foundRole.getRoleId())
                .build();
        userRoleMapper.insert(userRole);

        userRole.setRole(foundRole);
        joinUser.setUserRoles(List.of(userRole));

        return joinUser;
    }

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
