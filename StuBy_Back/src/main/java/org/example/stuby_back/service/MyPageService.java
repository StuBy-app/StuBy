package org.example.stuby_back.service;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.score.MockExam;
import org.example.stuby_back.domain.score.MockExamMapper;
import org.example.stuby_back.domain.score.MockExamSubject;
import org.example.stuby_back.dto.score.LatestExamDto;
import org.example.stuby_back.dto.score.SubjectScoreDto;
import org.example.stuby_back.security.model.PrincipalUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final MockExamMapper mockExamMapper;
    private final PrincipalUtil principalUtil;

    /*
        가장 최신 본인의 모의고사 성적 보기
     */
    @Transactional(readOnly = true)
    public LatestExamDto getLatestExam(){
        Integer userId = principalUtil.getPrincipalUser().getUser().getUserId();

        LocalDate latestDate = mockExamMapper.findLatestExamDateByUserId(userId);
        if(latestDate == null) return null;

        List<MockExam> records = mockExamMapper.findRecordsByUserIdAndExamDateOrderByCategory(userId, latestDate);

        List<SubjectScoreDto> subjects = records.stream()
                .map(r -> new SubjectScoreDto(r.getExamCategoryId(), r.getExamCategoryName(), r.getExamScore()))
                .collect(Collectors.toList());

        return new LatestExamDto(latestDate, subjects);
    }

}
