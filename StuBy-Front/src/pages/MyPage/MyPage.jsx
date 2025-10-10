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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { getCurrentUser, getMockGrades } from "../../db"; // DB에서 현재 사용자 정보 가져오기

const navigationItems = [
  {
    icon: CalendarIcon,
    label: "캘린더",
    leftIcon: "left-[50px]",
    leftLabel: "left-[50px]",
  },
  {
    icon: ClockIcon,
    label: "공부시간",
    leftIcon: "left-[138px]",
    leftLabel: "left-[133px]",
  },
  {
    icon: HomeIcon,
    label: "홈",
    leftIcon: "left-[226px]",
    leftLabel: "left-[235px]",
    active: true,
  },
  {
    icon: PieChartIcon,
    label: "정보",
    leftIcon: "left-[314px]",
    leftLabel: "left-[319px]",
  },
  {
    icon: MessageCircleIcon,
    label: "AI 버디",
    leftIcon: "left-[402px]",
    leftLabel: "left-[402px]",
  },
];

export const MyPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser()); // 현재 로그인된 사용자 정보
  const [latestMockGrade, setLatestMockGrade] = useState<any>(null);

  useEffect(() => {
    const fetchUserDataAndGrades = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const mockGrades = getMockGrades(currentUser.id);
        if (mockGrades.length > 0) {
          setLatestMockGrade(mockGrades[mockGrades.length - 1]);
        } else {
          setLatestMockGrade(null);
        }
      }
    };

    fetchUserDataAndGrades();
    // 마이페이지 수정 후 돌아왔을 때 데이터를 다시 불러오기 위해
    // 라우터 상태 변경을 감지하는 방법이 필요하지만, 여기서는 간단히 페이지 로드 시점에만 처리
    // 실제 앱에서는 Context API나 전역 상태 관리 라이브러리를 통해 사용자 정보를 관리하는 것이 효율적입니다.
  }, [navigate]); // navigate가 변경될 때 (즉, 페이지 이동 후) 다시 불러오도록 설정

  const handleEditProfile = () => {
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469u45u4370u4460u4363u4463u4523u4361u4462u4364u4453u4540");
  };

  const handleBackClick = () => {
    navigate("/u4370u4457u4535");
  };

  const handleFollowingClick = () => {
    navigate("/u4369u4449u4527u4357u4457u4363u4469u4540");
  };

  const handleFollowerClick = () => {
    navigate("/u4369u4449u4527u4357u4457u4363u4463");
  };

  const handleGradeInputClick = () => {
    navigate("/u4370u4453u4364u4461u45u4352u4469u4363u4469u4536");
  };

  const handleGradeViewClick = () => {
    navigate("/u4370u4453u4364u4461u45u4357u4449u4352u4469");
  };

  const getSubjectScore = (subjectName: string) => {
    if (!latestMockGrade) return "0점";
    switch (subjectName) {
      case "국어":
        return `${latestMockGrade.korean1 + latestMockGrade.korean2}점`;
      case "영어":
        return `${latestMockGrade.english}점`;
      case "수학":
        return `${latestMockGrade.math1 + latestMockGrade.math2}점`;
      case "통합사회": // 모의고사에는 통합사회/과학이 없으므로 임시로 선택과목1/2로 대체
        return `${latestMockGrade.elective1}점`;
      case "통합과학":
        return `${latestMockGrade.elective2}점`;
      case "한국사":
        return `${latestMockGrade.history}점`;
      default:
        return "0점";
    }
  };

  const subjects = [
    { name: "국어", score: getSubjectScore("국어"), leftClass: "left-[35px]" },
    { name: "영어", score: getSubjectScore("영어"), leftClass: "left-[89px]" },
    { name: "수학", score: getSubjectScore("수학"), leftClass: "left-[143px]" },
    { name: "통합사회", score: getSubjectScore("통합사회"), leftClass: "left-[199px]" },
    { name: "통합과학", score: getSubjectScore("통합과학"), leftClass: "left-[279px]" },
    { name: "한국사", score: getSubjectScore("한국사"), leftClass: "left-[359px]" },
  ];

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
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="24:140"
    >
      <main className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="absolute top-0 left-0 w-[480px] h-[76px] z-10">
          <div className="absolute top-0 left-0 w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a]">
            <div className="h-12 flex-1 bg-[#f8f9ff]" />
          </div>

          <div className="absolute top-[calc(50.00%_-_6px)] left-[calc(50.00%_-_46px)] w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />

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
                {user?.name || "유저이름"}
              </h1>

              <p className="mt-2.5 [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                {user?.school || "고등학교 이름"}, {user?.grade || "학년"}
              </p>

              <p className="mt-[3px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                {user?.desiredUniversities?.[0] || "지망 대학교를 작성해주세요."}
              </p>

              <div className="mt-[3px] flex items-center gap-2">
                <button
                  onClick={handleFollowingClick}
                  className="[font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-xs tracking-[0] leading-4 cursor-pointer"
                >
                  팔로잉 <span className="text-[#23232366]">23명</span>
                </button>
                <Separator
                  orientation="vertical"
                  className="h-2.5 bg-[#232323]"
                />
                <button
                  onClick={handleFollowerClick}
                  className="[font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-xs tracking-[0] leading-4 cursor-pointer"
                >
                  팔로워 <span className="text-[#23232366]">23명</span>
                </button>
              </div>
            </div>

            <Card className="w-full mt-[25px] bg-[#628af9] border-0 rounded-[10px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              <CardContent className="p-0 relative h-[70px]">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`absolute top-[19px] ${subjectNamePositions[index]}`}
                  >
                    <span className="text-[13px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#f8f9ff] tracking-[0] leading-4 whitespace-nowrap">
                      {subject.name}
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

                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`absolute top-[35px] ${subjectScorePositions[index]}`}
                  >
                    <span className="text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#f8f9ff] tracking-[0] leading-4 whitespace-nowrap">
                      {subject.score}
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
                  {user?.username || "아이디"}
                </div>

                <div className="absolute top-[81px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                  이메일
                </div>
                <div className="absolute top-[81px] left-[313px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] tracking-[0] leading-4">
                  {user?.email || "이메일"}
                </div>

                <div className="absolute top-[107px] left-[35px] [font-family:'Noto_Sans_KR',Helvetica] font-medium text-[#232323] text-sm tracking-[0] leading-4">
                  성별
                </div>
                <div className="absolute top-[107px] left-[377px] [font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[10px] tracking-[0] leading-4">
                  {user?.gender === "male" ? "남성" : user?.gender === "female" ? "여성" : "미지정"}
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

            <Button className="w-[250px] h-[45px] mt-[35px] bg-[#628af9] hover:bg-[#5279e0] rounded-[15px] border-2 border-[#628af9] [font-family:'Inter',Helvetica] font-medium text-[#f8f9ff] text-xs tracking-[0] transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
              로그아웃
            </Button>
          </section>
        </div>

        <nav className="absolute bottom-0 left-0 w-[480px] h-[70px] z-10 hidden">
          <div className="absolute left-0 w-[480px] h-[70px] bg-[#f8f9ff] rounded-[15px_15px_0px_0px] shadow-[0px_-2px_2px_#23232340]" />

          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="absolute top-3"
                style={{
                  left: item.leftIcon.replace("left-[", "").replace("]", ""),
                }}
              >
                <Icon
                  className={`w-7 h-7 ${
                    item.active ? "text-[#628af9]" : "text-[#2323234c]"
                  }`}
                />
                <span
                  className={`absolute top-[33px] left-1/2 -translate-x-1/2 [font-family:'Noto_Sans_KR',Helvetica] font-bold text-[10px] tracking-[0] leading-[normal] whitespace-nowrap ${
                    item.active ? "text-[#628af9]" : "text-[#2323234c]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

      </main>
    </div>
  );
};
