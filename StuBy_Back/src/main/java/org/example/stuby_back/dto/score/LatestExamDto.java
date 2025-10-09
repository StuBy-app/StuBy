package org.example.stuby_back.dto.score;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class LatestExamDto {
//    private Integer mockExamId;
//    private Integer examCategoryId;
    private LocalDate examDate;
//    private LocalDateTime createdAt;
//    private Integer examScore;
    private List<SubjectScoreDto> subjects;
}
