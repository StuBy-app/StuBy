package org.example.stuby_back.security.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.example.stuby_back.domain.user.User;
import org.example.stuby_back.domain.user.UserMapper;
import org.example.stuby_back.security.jwt.JwtUtil;
import org.example.stuby_back.security.model.PrincipalUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/*
  매 요청의 Authorization 헤더에서 Bearer 토큰을 꺼내 검증
  유효하면 DB에서 유저를 조회하여 SecurityContext에 Authentication을 세팅
 */
@Component
@RequiredArgsConstructor
public class JwtFilter implements Filter {

    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        // CORS Preflight는 필터 패스
        boolean isOptions = request.getMethod().equalsIgnoreCase("OPTIONS");
        if (isOptions) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        String authorization = request.getHeader("Authorization");
        authenticate(authorization);

        filterChain.doFilter(servletRequest, servletResponse);
    }

    /*
    Authorization 헤더에서 Bearer 토큰 추출
    -> 서명/만료 검증
    -> SecurityContext 세팅
   */
    private void authenticate(String token) {
        String validatedToken = jwtUtil.validateBearerToken(token);
        if (validatedToken == null) {
            return;
        }

        Claims claims = jwtUtil.getClaims(validatedToken);
        if (claims == null) {
            return;
        }

        setAuthentication(claims);

    }

    /*
      userId로 DB 조회
      -> Principal 구성
      -> Authentication 세팅
     */
    private void setAuthentication(Claims claims) {
        Integer userId = (Integer) claims.get("userId");
        User foundUser = userMapper.findById(userId);
        if (foundUser == null) {
            return;
        }

        PrincipalUser principal = PrincipalUser.builder().user(foundUser).build();
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, "", principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
