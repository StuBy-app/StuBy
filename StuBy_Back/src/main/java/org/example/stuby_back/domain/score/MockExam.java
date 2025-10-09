package org.example.stuby_back.domain.score;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MockExam {
    private Integer mockExamId;
    private Integer examCategoryId;
    private Integer userId;
    private Integer examScore;
    private LocalDate examDate;
    private LocalDateTime createdAt;

    private String examCategoryName;
}
