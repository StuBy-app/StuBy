package org.example.stuby_back.service;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.domain.user.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserMapper userMapper;
    private final FileService fileService;

    @Transactional(rollbackFor = Exception.class)
    public String updateProfileImg(User user, MultipartFile profileFile) {
        final String UPLOAD_PATH = "/profile";
        String uploadedFile = fileService.uploadFile(profileFile, "profile");
        userMapper.updateProfileImgPath(user.getUserId(),
                UPLOAD_PATH + "/" + uploadedFile); // 로그인을 한 채로 이미지 경로를 수정.
        fileService.deletedFile(user.getProfileImgPath(), "profile"); // 그런 다음 여기서 삭제해준다.
        return UPLOAD_PATH + "/" + uploadedFile;
    }
}
