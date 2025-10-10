package org.example.stuby_back.domain.user;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    int insert(User user);
    
    // 아이디 중복 확인
    User findByUsername(String username);
    User findByEmail(@Param("email") String email);
    User findByUserId(@Param("userId") Integer userId);
    User findByProviderId(@Param("providerId") String providerId);

    int updateForOauthCompletion(User user);

//    List<User> findAllBySearchOption(UserSearchOption option);
//    int getCountOfOptions(UserSearchOption option);
    int deleteByUserId(Integer userId);
    int deleteByUserIds(List<Integer> userIds);


    // 회원삭제
    int deleteByUser(Integer userId);

    // 프로필 수정
    int updateName(Integer userId, String name);
    String getProfileImgPath(Integer userId);
    int updateProfileImgPath(Integer userId, @Param("profileImg") String profileImgPath);
}