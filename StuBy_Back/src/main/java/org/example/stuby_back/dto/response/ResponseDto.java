package org.example.stuby_back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class ResponseDto <T> {
    private int code;
    private String message;
    private T body;

    public static <T> ResponseDto<T> success(T body) {
        return new ResponseDto<>(HttpStatus.OK.value(), "요청 성공", body);
    }

    public static <T> ResponseDto<T> fail(HttpStatus status, String message, T body) {
        return new ResponseDto<>(status.value(), message, body);
    }
}
