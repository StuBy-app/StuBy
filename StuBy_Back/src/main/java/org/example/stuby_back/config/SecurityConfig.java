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
        corsConfiguration.addAllowedOriginPattern(CorsConfiguration.ALL);
        corsConfiguration.addAllowedHeader(CorsConfiguration.ALL);
        corsConfiguration.addAllowedMethod(CorsConfiguration.ALL);

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
            auth.requestMatchers("/", "/login/oauth2/**", "/oauth2/**", "/image/**", "/upload/**", "/api/communities/**",
                    "/api/communities/*/*", "/api/foods/**", "/api/foods/*/*", "/api/map-info/**", "/api/notice/**", "/api/bestcommunity", "/api/bestfood", "/api/search/**", "/api/notice/*/*", "/api/auth/**", "/api/map/**", "/api/account/principal").permitAll();

            // 관리자 전용
            auth.requestMatchers("/api/admin/**").hasRole("ADMIN");
            auth.anyRequest().authenticated();
        });

        // 인증 실패(미인증 접근) 시 401 반환
        http.exceptionHandling(handling ->
                handling.authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                        }
                )
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
