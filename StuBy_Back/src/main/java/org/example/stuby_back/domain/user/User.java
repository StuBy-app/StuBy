package org.example.stuby_back.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.stuby_back.domain.userRole.UserRole;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer userId;
    private String username;
    @JsonIgnore
    private String password;
    private Integer schoolId;
    private Integer schoolGrade;
    private String name;
    private Integer age;
    private String email;
    private String gender;
    private String profileImgPath;
    private String provider;
    private String providerId;
    private Boolean isOauthOnly;
    private Boolean signupCompleted;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<UserRole> userRoles;
}