package org.example.stuby_back.controller;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.dto.response.ResponseDto;
import org.example.stuby_back.security.model.PrincipalUser;
import org.example.stuby_back.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /*
      현재 로그인한 사용자의 PrincipalUser 반환
     */
    @GetMapping("/account/principal")
    public ResponseEntity<ResponseDto<?>> principal(@AuthenticationPrincipal(errorOnInvalidType = false) PrincipalUser principalUser) {

        Map<String, Object> body = new LinkedHashMap<>();
        if (principalUser == null) {
            body.put("authenticated", false);
            body.put("user", null);
            return ResponseEntity.ok()
                    .header("Cache-Control", "no-store")
                    .body(ResponseDto.success(body));
        }

        User user = principalUser.getUser();
        Map<String, Object> userView = new LinkedHashMap<>();
        userView.put("userId", user.getUserId());
        userView.put("username", user.getUsername());
        userView.put("email", user.getEmail());
        userView.put("name", user.getName());
        userView.put("gender", user.getGender());
        userView.put("schoolId", user.getSchoolId());
        userView.put("schoolGrade", user.getSchoolGrade());
        userView.put("profileImgPath", user.getProfileImgPath());

        userView.put("signupCompleted", user.getSignupCompleted());
        userView.put("isOauthOnly", user.getIsOauthOnly());

        userView.put("provider", user.getProvider());
        userView.put("providerId", user.getProviderId());

        Integer roleId = null;
        String roleName = null;
        if (user.getUserRoles() != null && !user.getUserRoles().isEmpty()) {
            roleId = user.getUserRoles().get(0).getRoleId();
            roleName = user.getUserRoles().get(0).getRole() != null
                    ? user.getUserRoles().get(0).getRole().getRoleName()
                    : null;
        }
        userView.put("roleId", roleId);
        userView.put("roleName", roleName);

        body.put("authenticated", true);
        body.put("user", userView);

        return ResponseEntity.ok()
                .header("Cache-Control", "no-store")
                .body(ResponseDto.success(body));
    }

    @PostMapping("/account/profile/img")
    public ResponseEntity<ResponseDto<?>> updateProfileImg(@AuthenticationPrincipal PrincipalUser principalUser,
                                                           @RequestParam("profileFile") MultipartFile profileFile) throws IOException {
        String filePath = accountService.updateProfileImg(principalUser.getUser(), profileFile);
        return ResponseEntity.ok(ResponseDto.success(filePath));
    }

}
