package org.example.stuby_back.security.model;

import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

/*
    현재 스레드의 SecurityContext에서 PrincipalUser룰 꺼내는 헬퍼
 */
@Component
public class PrincipalUtil {

    private static final PrincipalUser ANONYMOUS;
    static {
        var anonUser = User.builder()
                .userId(0)
                .username("anonymous")
                .name("anonymous")
                .role("ROLE_ANONYMOUS")
                .build();

        ANONYMOUS = PrincipalUser.builder()
                .user(anonUser)
                .attributes(Map.of())
                .build();
    }

    /*
        현재 인증된 PrincipalUser 반환
     */
    public PrincipalUser getPrincipalUser() {

//        return (PrincipalUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var context = SecurityContextHolder.getContext();
        var auth = context != null ? context.getAuthentication() : null;

        if (auth == null) return ANONYMOUS;

        Object principal = auth.getPrincipal();
        if (principal instanceof PrincipalUser pu) {
            return pu;
        }
        // anonymousUser(String) 등일 때
        return ANONYMOUS;
    }

}