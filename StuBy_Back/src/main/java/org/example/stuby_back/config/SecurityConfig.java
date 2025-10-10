package org.example.stuby_back.config;

import lombok.RequiredArgsConstructor;
import org.example.stuby_back.security.filter.JwtFilter;
import org.example.stuby_back.security.handler.OAuth2SuccessHandler;
import org.example.stuby_back.service.OAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    private final OAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    /*
    CORS 설정
   */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOriginPattern("*");
        corsConfiguration.setAllowCredentials(true); // ✅ 쿠키/인증정보 포함 허용
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        // 프론트에서 읽어야 할 헤더 노출 (JWT 토큰 등)
        corsConfiguration.addExposedHeader("Authorization");
        corsConfiguration.addExposedHeader("Location");
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    /*
      Spring Security HTTP 보안 설정
      CSRF 비활성(Stateless API)
      Stateless : 매 요청을 JWT 기반으로 인증
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CORS / CSRF / FORM 로그인 비활성화
        http.cors(Customizer.withDefaults());
        http.csrf(csrf -> csrf.disable());
        http.formLogin(formLogin -> formLogin.disable());
        // Restful API -> 무상태성
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Filter Setting
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // 접근 제어 규칙
        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/", "/login/oauth2/**", "/oauth2/**", "/image/**", "/upload/**", "/api/auth/login", "/api/auth/join", "/api/account/principal").permitAll();

            auth.requestMatchers("/api/auth/complete-oauth").authenticated()
                    .requestMatchers("/api/account/**").authenticated();

            // 관리자 전용
            auth.requestMatchers("/api/admin/**").hasRole("ADMIN");
            auth.anyRequest().authenticated();
        });

        // 예외 처리기
        http.exceptionHandling(handling -> handling
                // 401: 미인증
                .authenticationEntryPoint((request, response, ex) -> {
                    response.setStatus(401);
                    response.setContentType("application/json;charset=UTF-8");
                    response.setHeader("Cache-Control", "no-store");
                    // ResponseDto.fail("401", "Unauthorized") 형태에 맞춰 직접 JSON 작성
                    response.getWriter().write(
                            "{\"success\":false,\"code\":\"401\",\"message\":\"Unauthorized\"}"
                    );
                })
                // 403: 권한 없음
                .accessDeniedHandler((request, response, ex) -> {
                    response.setStatus(403);
                    response.setContentType("application/json;charset=UTF-8");
                    response.setHeader("Cache-Control", "no-store");
                    response.getWriter().write(
                            "{\"success\":false,\"code\":\"403\",\"message\":\"Forbidden\"}"
                    );
                })
        );

        // OAuth2 로그인 설정: 사용자 정보 로딩, 성공/실패 후처리
        http.oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                .successHandler(oAuth2SuccessHandler)
                .failureHandler((request, response, exception) -> {
                    System.out.println("oauth2 인증 실패");
                    exception.printStackTrace();
                })
        );


        return http.build();
    }
}
