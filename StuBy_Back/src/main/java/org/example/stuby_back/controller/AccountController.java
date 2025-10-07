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

//        Map<String, Object> body = new LinkedHashMap<>();
//
//        if(principalUser == null) {
//            body.put("authenticated", false);
//            body.put("user", null);
//            return ResponseEntity.ok(ResponseDto.success(body));
//        }
//        User user = principalUser.getUser();

//        Map<String, Object> userView = new LinkedHashMap<>();
//        userView.put("userId", user.getUserId());
//        userView.put("username", user.getUsername());
//        userView.put("schoolId", user.getSchoolId());
//        userView.put("schoolGrade", user.getSchoolGrade());
//        userView.put("name", user.getName());
//        userView.put("age", user.getAge());
//        userView.put("email", user.getEmail());
//        userView.put("gender", user.getGender());
//        userView.put("role", user.getRole());
//        userView.put("profileImgPath", user.getProfileImgPath());
//        userView.put("provider", user.getProvider());
//        userView.put("providerId", user.getProviderId());
//
//        body.put("authenticated", true);
//        body.put("user", userView);

        return ResponseEntity.ok(ResponseDto.success(principalUser));
    }

    @PostMapping("/account/profile/img")
    public ResponseEntity<ResponseDto<?>> updateProfileImg(@AuthenticationPrincipal PrincipalUser principalUser,
                                                           @RequestParam("profileFile") MultipartFile profileFile) throws IOException {
        String filePath = accountService.updateProfileImg(principalUser.getUser(), profileFile);
        return ResponseEntity.ok(ResponseDto.success(filePath));
    }

}
