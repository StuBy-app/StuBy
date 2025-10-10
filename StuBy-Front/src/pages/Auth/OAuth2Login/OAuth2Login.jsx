
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const error = searchParams.get("error");
    const rawToken = searchParams.get("accessToken");

    // 에러 콜백이면 로그인으로
    if (error) {
      console.error("OAuth error:", error);
      navigate("/login", { replace: true });
      return;
    }

    if (rawToken) {
      // Bearer 중복 방지
      const token = /^Bearer\s/i.test(rawToken) ? rawToken : `Bearer ${rawToken}`;

      try {
        localStorage.setItem("AccessToken", token);
      } catch (e) {
        console.error("Failed to persist token:", e);
      }

      // 내 정보 쿼리 무효화 → 다음 화면에서 갱신
      queryClient
        .invalidateQueries({ queryKey: ["principal"] })
        .finally(() => {
          // 원하는 초기 진입 경로로 이동 (홈/온보딩 등)
          navigate("/home", { replace: true });
        });
    } else {
      // 토큰이 없으면 로그인으로
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, queryClient]);

  // 굳이 UI 필요 없으면 빈 프래그먼트로 두면 됨
  return null;
}
