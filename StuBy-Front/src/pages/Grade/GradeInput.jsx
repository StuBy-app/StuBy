import { ChevronLeftIcon, PlusIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import api from "../../api/axios";
import { saveMockGrade, saveSchoolGrade, setCurrentUser } from "../../db";

/* ================= JWT / me 파싱 헬퍼 ================= */

// 안전한 base64url 디코더 + JWT payload 파서
const b64urlDecode = (s) => {
  try {
    const pad = "=".repeat((4 - (s.length % 4)) % 4);
    const base64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return decodeURIComponent(
      json
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return null;
  }
};
const parseJwtPayload = (token) => {
  if (!token) return null;
  const parts = token.replace(/^Bearer\s+/i, "").split(".");
  if (parts.length < 2) return null;
  try {
    return JSON.parse(b64urlDecode(parts[1]));
  } catch {
    return null;
  }
};

// 다양한 백엔드 응답 형태에서 안전하게 파싱
const extractPrincipal = (resLike) => {
  const d = resLike?.data ?? resLike;
  const inner = d?.data ?? d?.body ?? d;

  const topId = inner?.userId ?? inner?.id ?? null;
  const topName = inner?.username ?? inner?.name ?? null;

  const userLike = inner?.user ?? inner?.principal ?? inner?.account ?? null;

  const nestedId =
    userLike?.userId ??
    userLike?.id ??
    userLike?.user?.id ??
    userLike?.principal?.id ??
    null;

  const nestedName =
    userLike?.username ??
    userLike?.name ??
    userLike?.user?.username ??
    userLike?.principal?.username ??
    null;

  const id = topId ?? nestedId ?? null;
  const username = topName ?? nestedName ?? null;

  return id ? { id, username: username ?? null } : null;
};

// 서버 me 시도 → 실패 시 JWT에서 userId 추출
const ensureUserFromAnywhere = async () => {
  try {
    const res = await api.get("/api/account/principal");
    const me = extractPrincipal(res);
    if (me?.id) return { id: Number(me.id), username: me.username ?? undefined };
  } catch (e) {
    const me = extractPrincipal(e?.response);
    if (me?.id) return { id: Number(me.id), username: me.username ?? undefined };
  }
  const ls = localStorage.getItem("AccessToken");
  const payload = parseJwtPayload(ls);
  const uid = payload?.userId ?? payload?.id ?? null;
  const username = payload?.username ?? payload?.sub ?? undefined;
  return uid != null ? { id: Number(uid), username } : null;
};

/* ===================================================== */

export const GradeInput = () => {
  const navigate = useNavigate();

  // exam type & selects
  const [examType, setExamType] = useState("mock"); // "mock" | "school"
  const [mockMonth, setMockMonth] = useState("3월"); // "3월" | "6월" | "9월" | "11월"
  const [koreanSubject, setKoreanSubject] = useState("화법과 작문");
  const [mathSubject, setMathSubject] = useState("확률과 통계");
  const [elective1, setElective1] = useState("생활과 윤리");
  const [elective2, setElective2] = useState("물리학Ⅰ");

  // scores
  const [scores, setScores] = useState({
    korean: "",
    english: "",
    math: "",
    elective1: "",
    elective2: "",
    history: "",
  });

  const [schoolScores, setSchoolScores] = useState({
    korean: "",
    english: "",
    math: "",
  });

  // custom subjects for school exam
  const [customSubjects, setCustomSubjects] = useState([]);
  const [nextId, setNextId] = useState(1);

  const handleBackClick = () => {
    navigate("/mypage");
  };

  const handleScoreChange = (field, value) => {
    if (examType === "mock") {
      setScores((prev) => ({ ...prev, [field]: value }));
    } else {
      setSchoolScores((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addCustomSubject = () => {
    setCustomSubjects((prev) => [...prev, { id: nextId, name: "", score: "" }]);
    setNextId((n) => n + 1);
  };

  const removeCustomSubject = (id) => {
    setCustomSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateCustomSubject = (id, field, value) => {
    setCustomSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const electiveSubjects = [
    "생활과 윤리",
    "윤리와 사상",
    "한국지리",
    "세계지리",
    "동아시아사",
    "세계사",
    "정치와 법",
    "경제",
    "사회·문화",
    "물리학Ⅰ",
    "화학Ⅰ",
    "생명과학Ⅰ",
    "지구과학Ⅰ",
    "물리학Ⅱ",
    "화학Ⅱ",
    "생명과학Ⅱ",
    "지구과학Ⅱ",
  ];

  const handleSaveGrades = async () => {
    // ✅ 서버/토큰 어디서든 사용자 확보
    const me = await ensureUserFromAnywhere();

    if (!me?.id) {
      alert("로그인된 사용자 정보가 없습니다.");
      return;
    }

    // 숫자형 ID 보장
    const uid = Number(me.id);

    // 프론트 캐시 세션에도 저장 – GradeView가 같은 ID로 조회
    setCurrentUser({ id: uid, username: me.username ?? undefined });

    if (examType === "mock") {
      const total = Object.values(scores).reduce(
        (sum, v) => sum + (Number(v) || 0),
        0
      );
      saveMockGrade(uid, {
        month: mockMonth,
        korean: Number(scores.korean) || 0,
        english: Number(scores.english) || 0,
        math: Number(scores.math) || 0,
        elective1: Number(scores.elective1) || 0,
        elective2: Number(scores.elective2) || 0,
        history: Number(scores.history) || 0,
        total,
      });
    } else {
      const baseTotal =
        (Number(schoolScores.korean) || 0) +
        (Number(schoolScores.english) || 0) +
        (Number(schoolScores.math) || 0);
      const customTotal = customSubjects.reduce(
        (sum, s) => sum + (Number(s.score) || 0),
        0
      );
      const total = baseTotal + customTotal;

      saveSchoolGrade(uid, {
        semester: "새 학기 시험", // TODO: 학기 선택 필드 추가 시 교체
        korean: Number(schoolScores.korean) || 0,
        english: Number(schoolScores.english) || 0,
        math: Number(schoolScores.math) || 0,
        customSubjects: customSubjects.map((s) => ({
          name: s.name,
          score: Number(s.score) || 0,
        })),
        total,
      });
    }

    alert("성적이 성공적으로 저장되었습니다!");
    navigate("/grade/view"); // 저장 후 바로 확인
  };

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
      <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a] flex-shrink-0">
          <nav className="h-12 w-full bg-[#f8f9ff] flex items-center justify-center relative px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="absolute left-6 w-6 h-6 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#232323] hover:text-[#628af9] transition-colors" />
            </Button>

            <div className="w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[25px] pb-[25px]">
          <h1 className="font-bold text-[#232323] text-lg [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] mb-5">
            성적 기입
          </h1>

          <div className="flex gap-2 mb-5">
            <Button
              onClick={() => setExamType("mock")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                examType === "mock"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              모의고사
            </Button>
            <Button
              onClick={() => setExamType("school")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                examType === "school"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              학교시험
            </Button>
          </div>

          {examType === "mock" ? (
            <>
              <div className="flex gap-2 mb-5">
                {["3월", "6월", "9월", "11월"].map((month) => (
                  <Button
                    key={month}
                    onClick={() => setMockMonth(month)}
                    className={`flex-1 h-[35px] rounded-[10px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                      mockMonth === month
                        ? "bg-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                        : "bg-[#e7edff] text-[#628af9] hover:bg-[#d0dcff]"
                    }`}
                  >
                    {month}
                  </Button>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      국어
                    </h3>
                    <div className="flex flex-col gap-2">
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={koreanSubject}
                          onValueChange={(value) => setKoreanSubject(value)}
                        >
                          <SelectTrigger className="w-[100px] h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="화법과 작문">
                              화법과 작문
                            </SelectItem>
                            <SelectItem value="언어와 매체">
                              언어와 매체
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="점수"
                          value={scores.korean}
                          onChange={(e) =>
                            handleScoreChange("korean", e.target.value)
                          }
                          className="flex-1 h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      영어
                    </h3>
                    <Input
                      type="number"
                      placeholder="점수"
                      value={scores.english}
                      onChange={(e) =>
                        handleScoreChange("english", e.target.value)
                      }
                      className="w-full h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      수학
                    </h3>
                    <div className="flex flex-col gap-2">
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={mathSubject}
                          onValueChange={(value) => setMathSubject(value)}
                        >
                          <SelectTrigger className="w-[100px] h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="확률과 통계">
                              확률과 통계
                            </SelectItem>
                            <SelectItem value="미적분">미적분</SelectItem>
                            <SelectItem value="기하">기하</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="점수"
                          value={scores.math}
                          onChange={(e) =>
                            handleScoreChange("math", e.target.value)
                          }
                          className="flex-1 h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      선택과목
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={elective1}
                          onValueChange={(value) => setElective1(value)}
                        >
                          <SelectTrigger className="w-[140px] h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {electiveSubjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="점수"
                          value={scores.elective1}
                          onChange={(e) =>
                            handleScoreChange("elective1", e.target.value)
                          }
                          className="flex-1 h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={elective2}
                          onValueChange={(value) => setElective2(value)}
                        >
                          <SelectTrigger className="w-[140px] h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {electiveSubjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="점수"
                          value={scores.elective2}
                          onChange={(e) =>
                            handleScoreChange("elective2", e.target.value)
                          }
                          className="flex-1 h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      한국사
                    </h3>
                    <Input
                      type="number"
                      placeholder="점수"
                      value={scores.history}
                      onChange={(e) =>
                        handleScoreChange("history", e.target.value)
                      }
                      className="w-full h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      국어
                    </h3>
                    <Input
                      type="number"
                      placeholder="점수"
                      value={schoolScores.korean}
                      onChange={(e) =>
                        handleScoreChange("korean", e.target.value)
                      }
                      className="w-full h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      영어
                    </h3>
                    <Input
                      type="number"
                      placeholder="점수"
                      value={schoolScores.english}
                      onChange={(e) =>
                        handleScoreChange("english", e.target.value)
                      }
                      className="w-full h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                      수학
                    </h3>
                    <Input
                      type="number"
                      placeholder="점수"
                      value={schoolScores.math}
                      onChange={(e) =>
                        handleScoreChange("math", e.target.value)
                      }
                      className="w-full h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                    />
                  </CardContent>
                </Card>

                {customSubjects.map((subject) => (
                  <Card
                    key={subject.id}
                    className="bg-white rounded-[10px] border-2 border-[#628af9]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Input
                          type="text"
                          placeholder="과목명"
                          value={subject.name}
                          onChange={(e) =>
                            updateCustomSubject(subject.id, "name", e.target.value)
                          }
                          className="flex-1 h-[35px] text-sm [font-family:'Noto_Sans_KR',Helvetica] font-bold border-[#628af9]"
                        />
                        <Button
                          onClick={() => removeCustomSubject(subject.id)}
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-[#ff6b6b] hover:bg-[#ff6b6b]/10"
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        type="number"
                        placeholder="점수"
                        value={subject.score}
                        onChange={(e) =>
                          updateCustomSubject(subject.id, "score", e.target.value)
                        }
                        className="w-full h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                      />
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={addCustomSubject}
                  className="w-full h-[45px] bg-[#e7edff] hover:bg-[#d0dcff] text-[#628af9] rounded-[10px] border-2 border-dashed border-[#628af9] text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  과목 추가
                </Button>
              </div>
            </>
          )}

          <Button
            onClick={handleSaveGrades}
            className="w-full h-[45px] bg-[#628af9] hover:bg-[#5279e0] text-[#f8f9ff] rounded-[15px] text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium mt-6"
          >
            저장하기
          </Button>
        </main>
      </div>
    </div>
  );
};

export default GradeInput;
