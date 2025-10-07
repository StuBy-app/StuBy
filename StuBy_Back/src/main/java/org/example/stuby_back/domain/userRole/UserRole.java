package org.example.stuby_back.domain.userRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.stuby_back.domain.role.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRole {
    private Integer userRoleId;
    private Integer userId;
    private Integer roleId;

    private Role role;
}