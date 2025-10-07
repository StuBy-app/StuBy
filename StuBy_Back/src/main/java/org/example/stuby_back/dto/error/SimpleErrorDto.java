package org.example.stuby_back.dto.error;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimpleErrorDto {
    private String title;
    private String errorMessage;
}