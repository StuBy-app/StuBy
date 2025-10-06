package org.example.stuby_back.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

import org.example.stuby_back.domain.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/*
  JWT 생성/검증
  만료 12시간
 */
@Component
public class JwtUtil {

    private final long EXPIRED_TIME = 60000 * 60 * 12;
    private final Key KEY;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // base64 디코드로 HMAC 키 생성
        KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    /*
      Access User Token 생성
     */
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject("cheerful_access_token")
                .issuer("cheerful")
                .expiration(new Date(new Date().getTime() + EXPIRED_TIME))
                .claim("userId", user.getUserId())
                .claim("authority", user.getRole())
                .signWith(KEY)
                .compact();
    }

    /*
      Bearer <token> 형태의 헤더 값을 순수 토큰으로 정제
     */
    public String validateBearerToken(String token) {
        boolean isNull = token == null;
        if (isNull) {
            return null;
        }

        final String TOKEN_NAME = "Bearer ";
        boolean isNotStartedBearer = !token.startsWith(TOKEN_NAME);
        if (isNotStartedBearer) {
            return null;
        }
        // 7글자까지 자르기
        return token.substring(TOKEN_NAME.length());
    }

    /*
      JWS 파싱/검증 후 클레임 반환
     */
    public Claims getClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(KEY).build()
                    .parseClaimsJws(token).getPayload();
        } catch (JwtException jwtException) {
            return null;
        }
    }

}
