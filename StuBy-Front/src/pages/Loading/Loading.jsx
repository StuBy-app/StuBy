import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Loading = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/u4357u4457u4352u4467u4363u4469u4523-u4363u4457u4357u4466");
    }, 1500);

    return () => clearTimeout(timer);
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
};
