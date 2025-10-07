package org.example.stuby_back.service;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.util.AppProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final AppProperties appProperties;

    /*
        파일 업로드 후 생성된 새 파일명을 반환 (DB에는 새 파일명만 저장하는 패턴)
     */
    public String uploadFile(MultipartFile file, String imageConfigName) {
        String dirPath = appProperties.getImageConfigs().get(imageConfigName).getDirPath();

        String newFileName = generatedRandomFilename(file.getOriginalFilename());

        mkdirs(dirPath);

        Path path = Paths.get(dirPath + "/" + newFileName);

        try {
            Files.write(path, file.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return newFileName;
    }

    private String generatedRandomFilename(String originalFileName) {
        // 새로운 파일명 만들기 위한 string builder 객체생성
        StringBuilder newFileName = new StringBuilder();
        // 겹치지 않는 새로운 파일명 생성을 위해 랜덤 UUID 문자열 생성
        newFileName.append(UUID.randomUUID().toString().replaceAll("-", ""));
        // UUID와 원본 파일명을 구분할 _(언더바) 추가
        newFileName.append("_");
        // 마지막 원본 파일명 추가
        newFileName.append(originalFileName);

        return newFileName.toString();
    }

    /*
        업로드 디렉토리 없으면 생성
     */
    private void mkdirs(String path) {
        // 해당 경로를 제어할 수 있는 File 객체 생성
        File file = new File(path);
        // 해당 File 객체를 생성할 때 주입한 경로가 존재하는지 여부 확인
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    /*
        업로드 파일 삭제 (기본 이미지 보호)
     */
//    public void deletedFile(String path) {
//
//        if (path == null || path.isEmpty()) {
//            return;
//        }
//        if (path.substring(path.lastIndexOf("/")).contains("default")) {
//            return;
//        }
//        File file = new File(path);
    ////        if (!file.exists()) {
    ////            return;
    ////        }
//        file.delete();
//    }

    /*
        업로드 파일 삭제 (기본 이미지 보호)
     */
    public void deletedFile(String file, String imageConfigName) {
        if (file == null || file.isEmpty()) return;
        if (file.contains("default")) return;

        // 이미지 설정에서 업로드 디렉토리 가져오기
        String dirPath = appProperties.getImageConfigs().get(imageConfigName).getDirPath();
        File files = new File(dirPath + "/" + file);

        if (files.exists()) {
            files.delete();
        }
    }


//    private static final Set<String> DEFAULT_NAMES = Set.of(
//        "default.png", "default.jpg", "default_profile.png", "default_profile.jpg"
//    );
//
//    public boolean deleteFile(String imageConfigName, String fileName) {
//        if(fileName == null || fileName.isBlank()) return false;
//        String lower = fileName.toLowerCase();
//        if(DEFAULT_NAMES.contains(lower) || lower.startsWith("default")) return false;
//
////        try {
////            Path base =
////        }
//    }
}