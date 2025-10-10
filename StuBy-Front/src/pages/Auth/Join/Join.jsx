
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/select";

import api from "../../../api/axios";

export default function Join() {
  const navigate = useNavigate();

  // 기본 폼 상태
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 선택/조건부 상태 (TS 제네릭 제거, 문자열로 통일)
  const [gender, setGender] = useState(""); // "male" | "female" | ""
  const [affiliation, setAffiliation] = useState(""); // "중학생" | "고등학생" | "기타" | ""
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState(""); // "grade1" | "grade2" | "grade3" | ""

  const [isGradeDisabled, setIsGradeDisabled] = useState(false);
  const [isSchoolDisabled, setIsSchoolDisabled] = useState(false);

  // UX 상태
  const [formIncomplete, setFormIncomplete] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 비밀번호 일치 검사
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  // 소속이 '기타'면 학년/학교 비활성화
  useEffect(() => {
    if (affiliation === "기타") {
      setIsGradeDisabled(true);
      setIsSchoolDisabled(true);
      setGrade("");
      setSchool("");
    } else {
      setIsGradeDisabled(false);
      setIsSchoolDisabled(false);
    }
  }, [affiliation]);

  const handleConfirm = async () => {
    if (submitting) return;
    setFormIncomplete(false);

    // 필수값 체크
    const required = [username, password, confirmPassword, name, email, gender, affiliation];
    if (affiliation !== "기타") {
      required.push(school, grade);
    }
    const allFilled = required.every((v) => v !== null && v !== "" && v !== "N/A");

    if (!allFilled) {
      setFormIncomplete(true);
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }
    if (passwordMismatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      username,
      password,
      name,
      email,
      gender,                       // "male" | "female"
      affiliation,                  // "중학생" | "고등학생" | "기타"
      school: affiliation === "기타" ? "" : school,
      grade: affiliation === "기타" ? null : grade, // 백엔드 스키마에 맞춰 null 전달
      desiredUniversities: [],
    };

    try {
      setSubmitting(true);
      // 우리 axios 인스턴스로 호출 (baseURL + 인터셉터 적용됨)
      await api.post("/api/auth/join", payload);
      alert("회원가입이 완료되었습니다!");
      navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      // 에러 메시지 추출
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "회원가입에 실패했습니다.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="15:191"
    >
      <div className="w-[480px] h-screen bg-[#f8f9ff] overflow-y-auto scrollbar-hide flex flex-col items-center justify-center">
        <div className="w-[345px] relative flex flex-col items-center py-5">
          <img
            className="w-[250px] h-[102px] object-cover translate-y-[-1rem] animate-fade-in opacity-0"
            alt="Logo"
            src="https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png"
          />

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[36px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
            <Input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:300ms]">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <Input
              type="password"
              placeholder="비밀번호 재확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {passwordMismatch && (
            <p className="text-[#ff6b6b] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] mt-1 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:450ms]">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
          {formIncomplete && !passwordMismatch && (
            <p className="text-[#ff6b6b] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] mt-1 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:450ms]">
              모든 필수 정보를 입력해주세요.
            </p>
          )}

          <div className="flex gap-[7px] mt-[15px] w-80 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:500ms]">
            <Button
              type="button"
              onClick={() => setGender("male")}
              className={`w-[155px] h-[45px] rounded-[15px] border-2 border-solid [font-family:'Noto_Sans_KR',Helvetica] font-medium text-xs transition-colors ${
                gender === "male"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#628af9]/90"
                  : "bg-white border-[#628af9] text-[#23232366] hover:bg-white hover:text-[#23232366]"
              }`}
            >
              남성
            </Button>
            <Button
              type="button"
              onClick={() => setGender("female")}
              className={`w-[155px] h-[45px] rounded-[15px] border-2 border-solid [font-family:'Noto_Sans_KR',Helvetica] font-medium text-xs transition-colors ${
                gender === "female"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#628af9]/90"
                  : "bg-white border-[#628af9] text-[#23232366] hover:bg-white hover:text-[#23232366]"
              }`}
            >
              여성
            </Button>
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
            <Input
              type="text"
              placeholder="성명"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_SANS_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:700ms]">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
            <Select value={affiliation} onValueChange={(v) => setAffiliation(v)}>
              <SelectTrigger className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="소속" className="text-[#232323]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="중학생">중학생</SelectItem>
                <SelectItem value="고등학생">고등학생</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-0 mt-[15px] w-80 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:900ms]">
            <div className="w-[230px] h-[45px] bg-white rounded-[15px_0px_0px_15px] border-2 border-solid border-[#628af9]">
              <Input
                type="text"
                placeholder="학교 입력"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                disabled={isSchoolDisabled}
                className={`w-full h-full border-0 bg-transparent rounded-[15px_0px_0px_15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  isSchoolDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <Button
              type="button"
              className={`w-[85px] h-[45px] rounded-[0px_15px_15px_0px] border-0 text-[#f8f9ff] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-xs transition-colors ${
                isSchoolDisabled
                  ? "bg-[#a8c5f7] cursor-not-allowed"
                  : "bg-[#628af9] hover:bg-[#628af9]/90"
              }`}
              disabled={isSchoolDisabled}
            >
              학교 찾기
            </Button>
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
            <Select value={grade} onValueChange={(v) => setGrade(v)} disabled={isGradeDisabled}>
              <SelectTrigger className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="학년" className="text-[#232323]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grade1">1학년</SelectItem>
                <SelectItem value="grade2">2학년</SelectItem>
                <SelectItem value="grade3">3학년</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="w-80 h-[45px] bg-[#628af9] rounded-[15px] border-0 text-[#f8f9ff] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-xs hover:bg-[#628af9]/90 transition-colors mt-[35px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1100ms]"
          >
            {submitting ? "처리 중..." : "확인"}
          </Button>
        </div>
      </div>
    </div>
  );
}
