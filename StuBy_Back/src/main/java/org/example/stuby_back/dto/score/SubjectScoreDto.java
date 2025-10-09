package org.example.stuby_back.dto.score;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubjectScoreDto {
    private Integer examCategoryId;
    private String examCategoryName;
    private Integer score;

}
