package org.example.stuby_back.controller;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.dto.response.ResponseDto;
import org.example.stuby_back.dto.score.LatestExamDto;
import org.example.stuby_back.service.MyPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("/grade")
    public ResponseEntity<ResponseDto<?>> getMyPageGrade(){
        LatestExamDto latest = myPageService.getLatestExam();

        if(latest == null) {
            return ResponseEntity.ok(ResponseDto.success("입력된 성적 값이 없습니다."));
        };

        return ResponseEntity.ok(ResponseDto.success(latest));
    }

    @PostMapping("/profile")
    public ResponseEntity<ResponseDto<?>> updateProfile() {
        return ResponseEntity.ok(ResponseDto.success(null));
    }

    @PostMapping("/profile/password")
    public ResponseEntity<ResponseDto<?>> changePassword() {
        return ResponseEntity.ok(ResponseDto.success(null));
    }

}
