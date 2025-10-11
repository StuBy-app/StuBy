package org.example.stuby_back.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteOauthDto {
    @NotBlank(message = "username은 필수입니다.")
    private String username;

    @NotBlank(message = "name은 필수입니다.")
    private String name;

    @NotNull(message = "gender는 필수입니다.")
    private String gender;

    // 프론트가 roleId(소속)를 보낼 것이라 가정
    @NotNull(message = "role는 필수입니다.")
    private Integer roleId;

    // 선택: 학교 정보 등
    private Integer schoolId;
    private Integer schoolGrade;
}