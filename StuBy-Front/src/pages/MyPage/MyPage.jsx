// src/pages/MyPage/MyPage.jsx
import {
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  HomeIcon,
  MessageCircleIcon,
  PieChartIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Separator } from "../../components/separator";
import api from "../../api/axios";
import {
  getCurrentUser,
  setCurrentUser,
  getMockGrades,
  // getSchoolGrades,  // 필요 시 사용
} from "../../db";

/* ================= JWT / me 파싱 헬퍼 ================= */

// base64url + JWT parser
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

// 다양한 응답 모양에서 me 파싱
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

// 서버 me → 실패 시 JWT에서 userId 추출
const ensureUserFromAnywhere = async () => {
  // 캐시 우선
  const cached = getCurrentUser();
  if (cached?.id) return cached;

  try {
    const res = await api.get("/api/account/principal");
    const me = extractPrincipal(res);
    if (me?.id) {
      const fixed = { id: Number(me.id), username: me.username ?? undefined };
      setCurrentUser(fixed);
      return fixed;
    }
  } catch (e) {
    const me = extractPrincipal(e?.response);
    if (me?.id) {
      const fixed = { id: Number(me.id), username: me.username ?? undefined };
      setCurrentUser(fixed);
      return fixed;
    }
  }

  const ls = localStorage.getItem("AccessToken");
  const payload = parseJwtPayload(ls);
  const uid = payload?.userId ?? payload?.id ?? null;
  const username = payload?.username ?? payload?.sub ?? undefined;

  if (uid != null) {
    const fixed = { id: Number(uid), username };
    setCurrentUser(fixed);
    return fixed;
  }
  return null;
};
/* ===================================================== */

const navigationItems = [
  { icon: CalendarIcon, label: "캘린더", leftIcon: "left-[50px]", leftLabel: "left-[50px]" },
  { icon: ClockIcon, label: "공부시간", leftIcon: "left-[138px]", leftLabel: "left-[133px]" },
  { icon: HomeIcon, label: "홈", leftIcon: "left-[226px]", leftLabel: "left-[235px]", active: true },
  { icon: PieChartIcon, label: "정보", leftIcon: "left-[314px]", leftLabel: "left-[319px]" },
  { icon: MessageCircleIcon, label: "AI 버디", leftIcon: "left-[402px]", leftLabel: "left-[402px]" },
];

export const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [latestMockGrade, setLatestMockGrade] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfileAndGrades = async () => {
      try {
        // 1) 프로필
        try {
          const res = await api.get("/api/users/profile");
          const payload = res?.data?.data ?? res?.data ?? {};
          const mapped = {
            username: payload.username ?? "",
            name: payload.name ?? "",
            email: payload.email ?? "",
            gender: payload.gender ?? null,
            school: payload.schoolName ?? payload.school ?? "",
            grade: payload.schoolGrade ?? payload.grade ?? "",
            desiredUniversities: payload.desiredUniversities ?? [],
          };
          if (mounted) setUser(mapped);
        } catch (err) {
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            navigate("/auth/login", { replace: true });
            return;
          }
          // 프로필 실패해도 성적 로딩은 계속 시도
          console.error("프로필 조회 실패:", err);
        }

        // 2) 사용자 ID 확보(서버 or JWT) 후 최신 성적 로딩
        const me = await ensureUserFromAnywhere();
        if (me?.id && mounted) {
          const uid = Number(me.id);
          const list = getMockGrades(uid); // 모의고사만 최신 표시
          setLatestMockGrade(list.length ? list[list.length - 1] : null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchProfileAndGrades();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleEditProfile = () => navigate("/mypage/edit");
  const handleBackClick = () => navigate("/home");
  const handleFollowingClick = () => navigate("/following");
  const handleFollowerClick = () => navigate("/followers");
  const handleGradeInputClick = () => navigate("/grade/input");
  const handleGradeViewClick = () => navigate("/grade/view");

  // 마이페이지 상단 성적 카드에 보여줄 점수(최신 모의고사 기준)
  const getSubjectScore = (subjectName) => {
    if (!latestMockGrade) return "0점";
    switch (subjectName) {
      case "국어":
        return `${(latestMockGrade.korean ?? 0)}점`;
      case "영어":
        return `${latestMockGrade.english ?? 0}점`;
      case "수학":
        return `${(latestMockGrade.math ?? 0)}점`;
      case "통합사회":
        return `${latestMockGrade.elective1 ?? 0}점`;
      case "통합과학":
        return `${latestMockGrade.elective2 ?? 0}점`;
      case "한국사":
        return `${latestMockGrade.history ?? 0}점`;
      default:
        return "0점";
    }
  };

  const subjectNamePositions = [
    "left-[35px]",
    "left-[89px]",
    "left-[143px]",
    "left-[199px]",
    "left-[279px]",
    "left-[359px]",
  ];
  const subjectScorePositions = [
    "left-9",
    "left-[90px]",
    "left-36",
    "left-[210px]",
    "left-[290px]",
    "left-[365px]",
  ];
  const separatorPositions = [
    "left-[74px]",
    "left-32",
    "left-[183px]",
    "left-[263px]",
    "left-[343px]",
  ];

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center" data-model-id="24:140">
      <main className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="absolute top-0 left-0 w-[480px] h-[76px] z-10">
          <div className="absolute top-0 left-0 w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a]">
            <div className="h-12 flex-1 bg-[#f8f9ff]" />
          </div>

          <div className="absolute top-[calc(50%_-_6px)] left-[calc(50%_-_46px)] w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="absolute top-[37px] left-6 w-6 h-6 hover:bg-transparent"
          >
            <ChevronLeftIcon className="w-6 h-6 text-[#232323] hover:text-[#628af9] transition-colors" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms] flex flex-col items-center pt-[calc(76px+35px)] px-[25px] pb-[105px]">
          <section className="flex flex-col items-center w-full max-w-[430px]">
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-9-1.png"
                  alt="유저이름"
                />
                <AvatarFallback>유저</AvatarFallback>
              </Avatar>

              <h1 className="mt-[15px] [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[#232323] text-xl tracking-[0] leading-4">
                {user?.name || "테스터"}
              </h1>

              <p className="mt-2.5 [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                {user?.school || "동래여자고등학교"}, {user?.grade || "2학년"}
              </p>

              <p className="mt-[3px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                {user?.desiredUniversities?.[0] || "서울대학교"}
              </p>

              <div className="mt-[3px] flex items-center gap-2">
                <button
                  onClick={handleFollowingClick}
                  className="[font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-xs tracking-[0] leading-4 cursor-pointer"
                >
                  팔로잉 <span className="text-[#23232366]">7명</span>
                </button>
                <Separator orientation="vertical" className="h-2.5 bg-[#232323]" />
                <button
                  onClick={handleFollowerClick}
                  className="[font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-xs tracking-[0] leading-4 cursor-pointer"
                >
                  팔로워 <span className="text-[#23232366]">5명</span>
                </button>
              </div>
            </div>

            {/* 최신 모의고사 성적 카드 */}
            <Card className="w-full mt-[25px] bg-[#628af9] border-0 rounded-[10px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              <CardContent className="p-0 relative h-[70px]">
                {["국어", "영어", "수학", "통합사회", "통합과학", "한국사"].map((subject, index) => (
                  <div key={index} className={`absolute top-[19px] ${subjectNamePositions[index]}`}>
                    <span className="text-[13px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#f8f9ff] tracking-[0] leading-4 whitespace-nowrap">
                      {subject}
                    </span>
                  </div>
                ))}

                {separatorPositions.map((position, index) => (
                  <Separator
                    key={index}
                    orientation="vertical"
                    className={`absolute top-[15px] ${position} h-10 bg-[#f8f9ff] opacity-50`}
                  />
                ))}

                {["국어", "영어", "수학", "통합사회", "통합과학", "한국사"].map((subject, index) => (
                  <div key={index} className={`absolute top-[35px] ${subjectScorePositions[index]}`}>
                    <span className="text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#f8f9ff] tracking-[0] leading-4 whitespace-nowrap">
                      {getSubjectScore(subject)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="w-full mt-[35px] bg-transparent border-2 border-[#628af9] rounded-[10px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
              <CardContent className="p-0 relative h-[174px]">
                <div className="absolute top-[25px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#23232366] text-[10px] tracking-[0] leading-4">
                  계정
                </div>

                <div className="absolute top-14 left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                  아이디
                </div>
                <div className="absolute top-14 left-[372px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] tracking-[0] leading-4">
                  {user?.username || "test1"}
                </div>

                <div className="absolute top-[81px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                  이메일
                </div>
                <div className="absolute top-[81px] left-[322px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] tracking-[0] leading-4">
                  {user?.email || "test1@test.com"}
                </div>

                <div className="absolute top-[107px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                  성별
                </div>
                <div className="absolute top-[107px] left-[377px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] tracking-[0] leading-4">
                  {user?.gender === "male" ? "남성" : user?.gender === "female" ? "여성" : "여성"}
                </div>

                <button
                  onClick={handleEditProfile}
                  className="absolute top-[133px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4 hover:text-[#628af9] transition-colors"
                >
                  내 정보 수정
                </button>
              </CardContent>
            </Card>

            <Card className="w-full mt-2.5 bg-transparent border-2 border-[#628af9] rounded-[10px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
              <CardContent className="p-0 relative h-[123px]">
                <div className="absolute top-[25px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#23232366] text-[9px] tracking-[0] leading-4">
                  성적
                </div>

                <button
                  onClick={handleGradeInputClick}
                  className="absolute top-14 left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4 hover:text-[#628af9] transition-colors"
                >
                  성적 기입
                </button>

                <button
                  onClick={handleGradeViewClick}
                  className="absolute top-[82px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4 hover:text-[#628af9] transition-colors"
                >
                  내 모든 성적 보기
                </button>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                localStorage.removeItem("AccessToken");
                navigate("/auth/login", { replace: true });
              }}
              className="w-[250px] h-[45px] mt-[35px] bg-[#628af9] hover:bg-[#5279e0] rounded-[15px] border-2 border-[#628af9] [font-family:'Inter',Helvetica] font-medium text-[#f8f9ff] text-xs tracking-[0] transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]"
            >
              로그아웃
            </Button>
          </section>
        </div>

        {/* 하단 네비는 비활성 상태 유지 */}
        <nav className="absolute bottom-0 left-0 w-[480px] h-[70px] z-10 hidden" />
      </main>
    </div>
  );
};

export default MyPage;
