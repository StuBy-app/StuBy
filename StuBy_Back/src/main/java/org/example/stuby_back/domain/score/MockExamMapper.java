package org.example.stuby_back.domain.score;

import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface MockExamMapper {
    LocalDate findLatestExamDateByUserId(Integer userId);
    List<MockExam> findRecordsByUserIdAndExamDateOrderByCategory(Integer userId, LocalDate examDate);
}
