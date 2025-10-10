package org.example.stuby_back.dto.auth;

import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.example.stuby_back.domain.user.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Data
public class JoinReqDto {

    // ❌ private final User user;  제거

    @Pattern(regexp = "^(?=.*[a-z])(?=.*\\d).{4,20}$",
            message = "아이디는 영문, 숫자를 포함 4~20자여야 합니다.")
    private String username;

    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{8,20}$",
            message = "비밀번호는 8~20자이며, 영문·숫자·특수문자를 모두 포함해야 합니다.")
    private String password;

    @Pattern(regexp = "[가-힣]{2,20}$",
            message = "이름은 한글 2~20자여야 합니다.")
    private String name;

    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "유효하지 않은 이메일 형식입니다.")
    private String email;

    // 프론트에서 오는 값: "male" | "female" | "남성" | "여성"
    private String gender;

    // 선택값 (없으면 null 허용)
    private Integer schoolId;
    private Integer schoolGrade;
    private Integer age;

    public User toUser(BCryptPasswordEncoder encoder) {
        Integer genderCode = null; // DB가 TINYINT면 숫자로 변환
        if (gender != null) {
            String g = gender.toLowerCase();
            if (g.equals("male") || g.equals("남성")) genderCode = 1;
            else if (g.equals("female") || g.equals("여성")) genderCode = 2;
        }

        return User.builder()
                .username(username)
                .password(encoder.encode(password))
                .name(name)
                .email(email)
                .gender(genderCode)                  // ← 문자열 → 숫자 매핑
                .schoolId(schoolId)                  // null 가능
                .schoolGrade(schoolGrade)            // null 가능
                .age(age)                            // null 가능
                .profileImgPath("/upload/profile/default.jpg")
                .isOauthOnly(false)
                .signupCompleted(true)               // 일반회원은 가입완료
                .emailVerified(false)
                .build();
    }
}
