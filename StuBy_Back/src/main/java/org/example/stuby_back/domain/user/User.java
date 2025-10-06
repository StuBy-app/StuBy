package org.example.stuby_back.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer userId;
    private String username;
    private String password;
    private Integer schoolId;
    private Integer schoolGrade;
    private String name;
    private Integer age;
    private String email;
    private Integer gender;
    private String profileImgPath;
    private String role;
    private String provider;
    private String providerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}