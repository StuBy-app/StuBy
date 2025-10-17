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

      // 1) 토큰 없으면: 로딩 후 로그인으로
      if (!token) {
        await delay(2000);
        if (!cancelled) navigate("/auth/login", { replace: true }); // ✅ 여기
        return;
      }

      // 2) 토큰 있으면: 검증 API + 로딩 병렬
      try {
        await Promise.all([delay(2000), api.get("/api/account/principal")]);
        if (!cancelled) navigate("/", { replace: true }); // ✅ 여기 (UserRouter index가 Home)
      } catch (e) {
        localStorage.removeItem("AccessToken");
        await delay(500);
        if (!cancelled) navigate("/auth/login", { replace: true }); // ✅ 여기
      }
    };

    go();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <main className="bg-[#000] w-full min-h-screen flex items-center justify-center">
      <section className="w-[480px] h-screen flex items-center justify-center bg-[#f8f9ff]">
        <div className="w-[309.14px] h-[127px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-center opacity-0 animate-fade-in [--animation-delay:200ms]" />
      </section>
    </main>
  );
}
