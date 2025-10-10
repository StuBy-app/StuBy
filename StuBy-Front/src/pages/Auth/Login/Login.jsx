// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/dialog";
import { Input } from "../../../components/input";
import { Separator } from "../../../components/separator";
import api from "../../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 서버 응답에서 토큰 추출 → localStorage에 저장
  const saveAccessToken = (res) => {
    const data = res?.data || {};
    const inner = data?.data || data; // 백엔드가 ResponseDto.success(payload) 형태면 inner에 실제 payload가 담김
    let token =
      inner?.accessToken ||
      inner?.token ||
      inner?.Authorization ||
      res?.headers?.authorization ||
      res?.headers?.Authorization;

    if (!token) return false;

    // 인터셉터가 Authorization 헤더로 쓸 수 있게 Bearer 접두어 보장
    if (!/^Bearer\s/i.test(token)) {
      token = `Bearer ${token}`;
    }
    localStorage.setItem("AccessToken", token);
    return true;
  };

  // 일반 로그인: /api/auth/login
  const handleLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await api.post("/api/auth/login", {
        username,
        password,
      });

      const ok = saveAccessToken(res);
      if (!ok) {
        throw new Error("토큰이 응답에 없습니다.");
      }

      // 로그인 성공 → 홈으로
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "로그인에 실패했습니다.";
      setErrorMessage(msg);
      setShowErrorDialog(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 변경점 1: OAuth는 백엔드의 Spring Security 리다이렉트 엔드포인트로 보냄
  //    - (기존) POST /api/auth/oauth/{provider} 호출 ❌
  //    - (변경) window.location.href = /oauth2/authorization/{provider} ⭕
  //    백엔드 성공 핸들러가 webHost + "/auth/oauth2/login?accessToken=..." 로 리다이렉트 해줌
  const handleOAuthLogin = (provider) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
    window.location.href = `${apiBase}/oauth2/authorization/${provider}`;
  };

  const handleSignupClick = () => {
    navigate("/join");
  };

  return (
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="15:146"
    >
      <main className="h-screen w-[480px] relative bg-[#f8f9ff] overflow-y-auto">
        <div className="absolute top-[calc(50.00%_-_218px)] left-[calc(50.00%_-_160px)] w-[331px] h-[436px] translate-y-[-1rem] animate-fade-in opacity-0">
          <img
            className="absolute top-0 left-[calc(50.00%_-_130px)] w-[250px] h-[102px] object-cover"
            alt="StuBy Logo"
            src="https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png"
          />

          <div className="absolute top-[148px] left-1/2 -translate-x-1/2 w-[321px]">
            <Input
              id="username"
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full h-[45px] bg-white rounded-[15px] border-2 border-[#628af9] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="absolute top-[203px] left-1/2 -translate-x-1/2 w-[321px]">
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full h-[45px] bg-white rounded-[15px] border-2 border-[#628af9] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* UX 소폭 개선: 입력값 없으면 버튼 비활성 */}
          <Button
            onClick={handleLogin}
            disabled={submitting || !username || !password}
            className="absolute top-[285px] left-1/2 -translate-x-1/2 w-[321px] h-[45px] bg-[#628af9] rounded-[15px] border-2 border-solid hover:bg-[#5279e0] transition-colors h-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="font-medium text-white text-xs whitespace-nowrap [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              {submitting ? "처리 중..." : "로그인"}
            </span>
          </Button>

          <button
            onClick={handleSignupClick}
            className="absolute top-[268px] left-1/2 -translate-x-1/2 font-normal text-[#23232366] text-[10px] whitespace-nowrap [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] hover:text-[#232323] transition-colors"
          >
            회원가입
          </button>

          <div className="absolute top-[360px] left-1/2 -translate-x-1/2 w-[300px] flex items-center justify-center gap-2">
            <Separator className="flex-1 bg-[#23232366]" />
            <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232366] text-xs whitespace-nowrap tracking-[0] leading-[normal]">
              SNS 계정으로 로그인
            </span>
            <Separator className="flex-1 bg-[#23232366]" />
          </div>

          <div className="absolute top-[396px] left-1/2 -translate-x-1/2 flex gap-[15px]">
            {/* ✅ 변경점 2: OAuth 버튼 클릭 시 리다이렉트 플로우로 변경 */}
            <Button
              onClick={() => handleOAuthLogin("google")}
              className="w-10 h-10 bg-[#4285f4] rounded-[20px] hover:bg-[#3c78d8] transition-colors p-0 h-auto"
              aria-label="Google login"
            >
              <img
                className="w-[18px] h-[18px]"
                alt="Google"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              />
            </Button>
            <Button
              onClick={() => handleOAuthLogin("naver")}
              className="w-10 h-10 bg-[#34a853] rounded-[20px] hover:bg-[#2e9a4a] transition-colors p-0 h-auto"
              aria-label="Naver login"
            >
              <span className="[font-family:'AppleSDGothicNeoH00-Regular',Helvetica] font-normal text-[#f8f9ff] text-2xl">
                N
              </span>
            </Button>
            <Button
              onClick={() => handleOAuthLogin("kakao")}
              className="w-10 h-10 bg-[#ffc421] rounded-[20px] hover:bg-[#e6b01e] transition-colors p-0 h-auto"
              aria-label="Kakao login"
            >
              <span className="[font-family:'AppleSDGothicNeoH00-Regular',Helvetica] font-normal text-[#f8f9ff] text-2xl">
                K
              </span>
            </Button>
          </div>
        </div>

        <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <DialogContent className="w-[270px] bg-[#f8f9ff] rounded-[15px] border-0 p-0 gap-0">
            <DialogHeader className="pt-[40px] px-6 pb-0 space-y-0">
              <DialogTitle className="font-bold text-[#232323] text-sm text-center [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                로그인에 실패했습니다.
              </DialogTitle>
              <DialogDescription className="font-normal text-[#23232399] text-[11px] text-center [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] pt-[22px]">
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col items-center pt-[20px] pb-[15px] px-0">
              <Separator className="w-full bg-[#23232333]" />
              <Button
                onClick={() => setShowErrorDialog(false)}
                className="font-bold text-[#628af9] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] bg-transparent hover:bg-transparent shadow-none border-0 h-auto pt-3"
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
