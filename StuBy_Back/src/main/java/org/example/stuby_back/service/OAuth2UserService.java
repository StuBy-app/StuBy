package org.example.stuby_back.service;

import java.util.Map;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.role.Role;
import org.example.stuby_back.domain.role.RoleMapper;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.domain.user.UserMapper;
import org.example.stuby_back.domain.userRole.UserRole;
import org.example.stuby_back.domain.userRole.UserRoleMapper;
import org.example.stuby_back.security.model.PrincipalUser;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*
  OAuth2 로그인 시, 프로바이더에서 사용자 정보를 받아
  -> 존재하지 않으면 신규 가입
  -> 존재하면 기존 사용자 반환
 */
@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;
    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = null;
        String providerId = null;
        String profileImgPath = null;
        Boolean emailVerified = false;

        Map<String, Object> attributes = oAuth2User.getAttributes();
        // Google에서 제공하는 정보를 가져옴.
        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            providerId = (String) attributes.get("sub");
            profileImgPath = (String) attributes.get("picture");
            Object ev = attributes.get("email_verified");
            emailVerified = (ev instanceof Boolean) ? (Boolean) ev : false;

        } else if ("kakao".equals(registrationId)) {
            // kakao에서 제공하는 정보를 가져옴.
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
//            attributes = oAuth2User.getAttributes();

            email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
            providerId = String.valueOf(attributes.get("id"));
            profileImgPath = profile != null ? (String) profile.get("profile_image_url") : null;

        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");

            email = response != null ? (String) response.get("email") : null;
            providerId = response != null ? (String) response.get("id") : null;
            profileImgPath = response != null ? (String) response.get("profile_image") : null;

        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인입니다: " + registrationId);
        }

        if (providerId != null) {
            throw new OAuth2AuthenticationException("프로바이더 사용자 식별자가 없습니다.");
        }

        // providerId 기준 식별
        User user = userMapper.findByProviderId(providerId);
//    System.out.println(user);

        // 신규 가입
        // not null 추가
        // 1) providerId로 기존 연결 사용자 조회
        if (user == null) {
            return PrincipalUser.builder().user(user).attributes(oAuth2User.getAttributes()).build();
        }

        // 2) 이메일로 기존 로컬/다른 OAuth 사용자 존재 여부 확인(자동 병합 금지)
        if (email != null) {
            User byEmail = userMapper.findByEmail(email);
            if (byEmail != null) {
                // 자동 병합 금지: 프론트에 "기존 계정 연결" 절차 유도
                throw new OAuth2AuthenticationException("이미 같은 이메일로 가입된 계정이 있습니다. 기존 계정 로그인 후 연결을 진행하세요.");
            }
        }

        // 3) 미완료 사용자 생성 (비밀번호는 랜덤 해시 또는 NULL 허용 정책 중 하나)
        User newUser = User.builder()
                .username(null) // 보완 가입에서 확정
                .password(null)
                .email(email)
                .gender(null)
                .name(null)
                .schoolId(0)
                .schoolGrade(0)
                .profileImgPath(profileImgPath != null ? profileImgPath : "/profile/default.jpg")
                .provider(registrationId)
                .providerId(providerId)
                .isOauthOnly(true)
                .signupCompleted(false)
                .emailVerified(Boolean.TRUE.equals(emailVerified))
                .build();

        userMapper.insert(newUser);

        Role defaultRole = roleMapper.findByRoleName("ROLE_USER");
         if (defaultRole != null) {
             userRoleMapper.insert(UserRole.builder()
                     .userId(newUser.getUserId())
                     .roleId(defaultRole.getRoleId())
                     .build());
         }

        return PrincipalUser.builder()
                .user(user)
                .attributes(oAuth2User.getAttributes())
                .build();

    }
}
