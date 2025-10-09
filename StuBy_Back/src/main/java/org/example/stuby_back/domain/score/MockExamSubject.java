package org.example.stuby_back.domain.score;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MockExamSubject {
    private Integer MockExamSubjectId;
    private Integer mockExamId;
    private Integer examCategoryId;
    private Integer score;
    private LocalDateTime createdAt;
}
