package org.example.stuby_back.security.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.example.stuby_back.security.jwt.JwtUtil;
import org.example.stuby_back.security.model.PrincipalUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/*
  OAuth2 인증 성공 후 호출
  로그인된 PrincipalUser로 Access Token 발급
  프론트엔드로 토근 전달
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.web-host}")
    private String webHost;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        PrincipalUser principalUser = (PrincipalUser) authentication.getPrincipal();
        String accessToken = jwtUtil.generateAccessToken(principalUser.getUser());
        response.sendRedirect(webHost + "/auth/oauth2/login?accessToken=" + accessToken);
    }
}
