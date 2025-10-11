import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    const go = async () => {
      const token = localStorage.getItem("AccessToken");

      // 1) 토큰 없으면: 1.5s 로딩 후 로그인으로
      if (!token) {
        await delay(2000);
        if (!cancelled) navigate("/login", { replace: true});
        return;
      }

      // 2) 토큰 있으면: 검증 API + 1.5s 로딩을 병렬로
      try {
        await Promise.all([
          delay(2000),
          api.get("/api/account/principal"), // ← 백엔드의 내 정보/토큰 검증 엔드포인트
        ]);
        if (!cancelled) navigate("/home", { replace: true}); // 홈 경로 (프로젝트에 맞게)
      } catch (e) {
        // 토큰 불량: 지우고 로그인으로
        localStorage.removeItem("AccessToken");
        await delay(500); // 살짝 여유
        if (!cancelled) navigate("/login", { replace: true});
      }
    };

    go();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="3:2"
    >
      <section className="w-[480px] h-screen flex items-center justify-center bg-[#f8f9ff]">
        <div className="w-[309.14px] h-[127px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-center opacity-0 animate-fade-in [--animation-delay:200ms]" />
      </section>
    </main>
  );
}
