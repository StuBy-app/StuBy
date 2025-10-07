package org.example.stuby_back.domain.userRole;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserRoleMapper {
    int insert(UserRole userRole);
    int deleteByUserId(Integer userId);
    int deleteByUserIds(List<Integer> userIds);
}