import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { registerUser } from "../../db";

export const Join = (): JSX.Element => {  // 이게 뭔지 알아야 함. 
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [affiliation, setAffiliation] = useState<string | null>(null);
  const [grade, setGrade] = useState<string | null>(null);
  const [isGradeDisabled, setIsGradeDisabled] = useState(false);
  const [isSchoolDisabled, setIsSchoolDisabled] = useState(false);
  const [formIncomplete, setFormIncomplete] = useState(false);

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (affiliation === "기타") {
      setIsGradeDisabled(true);
      setGrade(null);
      setIsSchoolDisabled(true);
      setSchool("");
    } else {
      setIsGradeDisabled(false);
      setIsSchoolDisabled(false);
    }
  }, [affiliation]);

  const handleConfirm = () => {
    setFormIncomplete(false); // 초기화

    const requiredFields = [
      username,
      password,
      confirmPassword,
      name,
      email,
      gender,
      affiliation,
    ];

    // '기타' 소속이 아닐 경우 학교와 학년도 필수
    if (affiliation !== "기타") {
      requiredFields.push(school);
      requiredFields.push(grade);
    }

    const allFieldsFilled = requiredFields.every(field => field !== null && field !== "" && field !== "N/A");

    if (!allFieldsFilled) {
      setFormIncomplete(true);
      return;
    }

    if (passwordMismatch) {
      return;
    }

    const newUser = registerUser({
      username,
      password,
      name,
      email,
      gender,
      affiliation,
      school: affiliation === "기타" ? "" : school,
      grade: affiliation === "기타" ? null : grade,
      desiredUniversities: [], // 회원가입 시 희망 대학은 비어있음
    });

    if (newUser) {
      alert("회원가입이 완료되었습니다!");
      navigate("/u4357u4457u4352u4467u4363u4469u4523-u4363u4457u4357u4466");
    } else {
      alert("회원가입에 실패했습니다. 아이디 또는 이메일이 이미 존재합니다.");
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
              className="w-full h-full border-0 bg-transparent rounded-[15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0"
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
            <Select value={affiliation || ""} onValueChange={setAffiliation}>
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
                className={`w-full h-full border-0 bg-transparent rounded-[15px_0px_0px_15px] px-4 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] placeholder:text-[#23232366] focus-visible:ring-0 focus-visible:ring-offset-0 ${isSchoolDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
            </div>
            <Button 
              className={`w-[85px] h-[45px] rounded-[0px_15px_15px_0px] border-0 text-[#f8f9ff] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-xs transition-colors ${
                isSchoolDisabled ? "bg-[#a8c5f7] cursor-not-allowed" : "bg-[#628af9] hover:bg-[#628af9]/90"
              }`}
              disabled={isSchoolDisabled}
            >
              학교 찾기
            </Button>
          </div>

          <div className="w-80 bg-white rounded-[15px] border-2 border-solid border-[#628af9] h-[45px] mt-[15px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
            <Select value={grade || ""} onValueChange={setGrade} disabled={isGradeDisabled}>
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
            onClick={handleConfirm}
            className="w-80 h-[45px] bg-[#628af9] rounded-[15px] border-0 text-[#f8f9ff] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-xs hover:bg-[#628af9]/90 transition-colors mt-[35px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1100ms]"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
