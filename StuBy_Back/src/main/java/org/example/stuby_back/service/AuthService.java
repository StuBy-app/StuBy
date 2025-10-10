package org.example.stuby_back.service;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.role.Role;
import org.example.stuby_back.domain.role.RoleMapper;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.domain.user.UserMapper;
import org.example.stuby_back.domain.userRole.UserRole;
import org.example.stuby_back.domain.userRole.UserRoleMapper;
import org.example.stuby_back.dto.auth.CompleteOauthDto;
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
        if (foundUser != null) {
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

    /**
     * OAuth로 생성된 미완료 유저를 보완하여 가입 완료 처리.
     * - 트랜잭션으로 묶음
     */
    @Transactional(rollbackFor = Exception.class)
    public void completeOauthSignup(Integer userId, CompleteOauthDto dto) {
        // 1. 대상 유저 조회
        User target = userMapper.findByUserId(userId);
        if (target == null) {
            throw new IllegalArgumentException("해당 사용자를 찾을 수 없습니다.");
        }

        if (Boolean.TRUE.equals(target.getSignupCompleted())) {
            throw new IllegalStateException("이미 가입이 완료된 계정입니다.");
        }

        // 2. username 중복 검사
        User byUsername = userMapper.findByUsername(dto.getUsername());
        if (byUsername != null && !byUsername.getUserId().equals(userId)) {
            // 이미 존재하면 즉시 예외
            throw new IllegalStateException("이미 존재하는 아이디입니다.");
            // 필요하면 사용자 정의 예외로 바꾸기 (DuplicateUsernameException)
        }

        // 3. 업데이트: username, name, gender, school, signupCompleted
        User update = new User();
        update.setUserId(userId);
        update.setUsername(dto.getUsername());
        update.setName(dto.getName());
        update.setGender(dto.getGender());
        update.setSchoolId(dto.getSchoolId() != null ? dto.getSchoolId() : target.getSchoolId());
        update.setSchoolGrade(dto.getSchoolGrade() != null ? dto.getSchoolGrade() : target.getSchoolGrade());
        // signupCompleted는 매퍼에서 1로 세팅
        try {
            userMapper.updateForOauthCompletion(update);
        } catch (org.springframework.dao.DuplicateKeyException ex) {
            // DB 레벨에서 username 유니크 제약 위반 발생 시 사용자 친화적 예외로 변환
            throw new IllegalStateException("이미 사용중인 아이디입니다. 다른 아이디를 선택하세요.");
        }

        // 4. user_role_tb에 소속(role) 추가
        Integer roleIdToAssign = dto.getRoleId(); // 프론트에서 roleId를 전달받는 경우

        if (roleIdToAssign == null) {
            // 프론트에서 roleId를 전달하지 않았다면 기본값 사용
            final String DEFAULT_USER_ROLE = "ROLE_USER"; // 또는 "기타"
            Role defaultRole = roleMapper.findByRoleName(DEFAULT_USER_ROLE);
            if (defaultRole == null) {
                throw new IllegalStateException("기본 역할(Role) 정보를 찾을 수 없습니다.");
            }
            roleIdToAssign = defaultRole.getRoleId();
        }

        UserRole userRole = UserRole.builder()
                .userId(userId)
                .roleId(roleIdToAssign)
                .build();

        userRoleMapper.insert(userRole);
    }

}
