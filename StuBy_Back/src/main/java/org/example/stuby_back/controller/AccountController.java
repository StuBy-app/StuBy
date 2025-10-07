package org.example.stuby_back.controller;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.dto.response.ResponseDto;
import org.example.stuby_back.security.model.PrincipalUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AccountController {

//    private final UserService userService;

    /*
      현재 로그인한 사용자의 PrincipalUser 반환
     */
    @GetMapping("/api/account/principal")
    public ResponseEntity<ResponseDto<?>> principal(@AuthenticationPrincipal(errorOnInvalidType = false) PrincipalUser principalUser) {
//    System.out.println(principalUser.getUser());

        Map<String, Object> body = new LinkedHashMap<>();

        if(principalUser == null) {
            body.put("authenticated", false);
            body.put("user", null);
//            body.put("myStatus", null);
            return ResponseEntity.ok(ResponseDto.success(body));
        }
        User user = principalUser.getUser();
//    user.setProfileImgUrl(imageUrlUtil.profile(user.getProfileImgPath()));
//
//    String role = principalUser.getAuthorities().stream()
//        .findFirst().map(GrantedAuthority::getAuthority).orElse(null);
//
//    body.put("authenticated", true);
//    body.put("user", user);

        Map<String, Object> userView = new LinkedHashMap<>();
        userView.put("userId", user.getUserId());
        userView.put("username", user.getUsername());
        userView.put("schoolId", user.getSchoolId());
        userView.put("schoolGrade", user.getSchoolGrade());
        userView.put("name", user.getName());
        userView.put("age", user.getAge());
        userView.put("email", user.getEmail());
        userView.put("gender", user.getGender());
        userView.put("role", user.getRole());
        userView.put("profileImgPath", user.getProfileImgPath());
        userView.put("provider", user.getProvider());
        userView.put("providerId", user.getProviderId());

        body.put("authenticated", true);
        body.put("user", userView);
//        body.put("myStatus", userService.getMyWriteStatus());

        return ResponseEntity.ok(ResponseDto.success(body));

    }

}
