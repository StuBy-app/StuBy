import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Home as HomeIcon,
  PieChart as PieChartIcon,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { getCurrentUser, getRankingData } from "../../db";

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
};

export default function Ranking() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [category, setCategory] = useState("personal"); // "personal" | "groups" | "friends"
  const [rankingList, setRankingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, category]);

  const fetchRankingData = () => {
    setLoading(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인된 사용자 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const dateString = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const data = getRankingData(currentUser.id, dateString, category);

    // total 내림차순 정렬
    const sortedData = [...data].sort((a, b) => b.total - a.total);
    setRankingList(sortedData);
    setLoading(false);
  };

  const handleBackClick = () => {
    navigate("/studytime"); // 공부시간 메인 페이지로 이동
  };

  const handleProfileClick = () => {
    navigate("/mypage"); // MyPage 화면으로 이동
  };

  const changeDate = (days) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + days);
      return newDate;
    });
  };

  const displayDate = selectedDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  const top3 = rankingList.slice(0, 3);
  const restOfList = rankingList.slice(3);

  const navItems = [
    { icon: CalendarIcon, label: "캘린더", active: false, path: "/calendar" },
    { icon: ClockIcon, label: "공부시간", active: true, path: "/studytime" },
    { icon: HomeIcon, label: "홈", active: false, path: "/u4370u4457u4535" },
    { icon: PieChartIcon, label: "정보", active: false, path: "/info" },
    { icon: MessageCircleIcon, label: "AI 버디", active: false, path: "/aibuddy" },
  ];

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
      <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a] flex-shrink-0">
          <nav className="h-12 w-full bg-[#f8f9ff] flex items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="w-6 h-6 p-0 hover:bg-transparent"
              aria-label="뒤로가기"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#232323] hover:text-[#628af9] transition-colors" />
            </Button>

            <div className="w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />

            <button
              onClick={handleProfileClick}
              className="w-7 h-7 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
              aria-label="프로필 보기"
            >
              <img
                className="w-full h-full object-cover"
                alt="Profile"
                src="https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-9-1.png"
              />
            </button>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[25px] pb-[25px] flex flex-col gap-[20px]">
          {/* 날짜 선택 */}
          <section className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => changeDate(-1)}
              className="w-8 h-8 p-0 hover:bg-transparent"
              aria-label="이전 날짜"
            >
              <ChevronLeftIcon className="w-5 h-5 text-[#232323]" />
            </Button>
            <span className="font-bold text-[#232323] text-lg [font-family:'Noto_Sans_KR',Helvetica]">
              {displayDate}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => changeDate(1)}
              className="w-8 h-8 p-0 hover:bg-transparent"
              aria-label="다음 날짜"
            >
              <ChevronRightIcon className="w-5 h-5 text-[#232323]" />
            </Button>
          </section>

          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-5">
            <Button
              onClick={() => setCategory("personal")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                category === "personal"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              개인
            </Button>
            <Button
              onClick={() => setCategory("groups")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                category === "groups"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              그룹
            </Button>
            <Button
              onClick={() => setCategory("friends")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                category === "friends"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              친구들
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-[#23232380]">랭킹 불러오는 중...</p>
          ) : (
            <>
              {/* TOP3 랭킹 */}
              <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-3">
                월간 TOP3
              </h2>
              <div className="flex justify-around gap-2 mb-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className={`flex-1 h-[100px] rounded-[10px] border-2 ${
                      index === 0 ? "bg-[#628af9] border-[#628af9]" : "bg-white border-[#628af9]"
                    } flex flex-col items-center justify-center text-center`}
                  >
                    <CardContent className="p-2">
                      {top3[index] ? (
                        <>
                          <span
                            className={`font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] ${
                              index === 0 ? "text-[#f8f9ff]" : "text-[#628af9]"
                            }`}
                          >
                            {index + 1}등
                          </span>
                          <p
                            className={`font-medium text-[10px] [font-family:'Noto_Sans_KR',Helvetica] mt-1 ${
                              index === 0 ? "text-[#f8f9ff]" : "text-[#232323]"
                            }`}
                          >
                            {top3[index].name}
                          </p>
                          <p
                            className={`font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] mt-1 ${
                              index === 0 ? "text-[#f8f9ff]" : "text-[#232323]"
                            }`}
                          >
                            {formatTime(top3[index].total)}
                          </p>
                        </>
                      ) : (
                        <span
                          className={`font-medium text-[10px] [font-family:'Noto_Sans_KR',Helvetica] ${
                            index === 0 ? "text-[#f8f9ff]" : "text-[#23232380]"
                          }`}
                        >
                          —
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 전체 랭킹 리스트 */}
              <ul className="flex flex-col gap-3">
                {restOfList.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#628af9] text-sm [font-family:'Noto_Sans_KR',Helvetica] w-6 text-right">
                        {index + 4}
                      </span>
                      <span className="font-medium text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                      {formatTime(item.total)}
                    </span>
                  </li>
                ))}
                {rankingList.length === 0 && (
                  <p className="text-center text-[#23232380] mt-5">
                    해당 날짜에 랭킹 데이터가 없습니다.
                  </p>
                )}
              </ul>
            </>
          )}
        </main>

        {/* 하단 네비게이션 */}
        <nav className="w-[480px] h-[70px] bg-[#f8f9ff] rounded-[15px_15px_0px_0px] shadow-[0px_-2px_8px_#2323231a] flex-shrink-0">
          <div className="h-full flex items-start justify-around pt-3">
            <button className="h-auto flex flex-col items-center gap-[5px]">
              <CalendarIcon className="w-7 h-7 text-[#2323234c]" />
              <span className="font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#2323234c]">
                캘린더
              </span>
            </button>
            <button onClick={() => navigate("/studytime")} className="h-auto flex flex-col items-center gap-[5px]">
              <ClockIcon className="w-7 h-7 text-[#628af9]" />
              <span className="font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#628af9]">
                공부시간
              </span>
            </button>
            <button onClick={() => navigate("/home")} className="h-auto flex flex-col items-center gap-[5px]">
              <HomeIcon className="w-7 h-7 text-[#2323234c]" />
              <span className="font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#2323234c]">
                홈
              </span>
            </button>
            <button className="h-auto flex flex-col items-center gap-[5px]">
              <PieChartIcon className="w-7 h-7 text-[#2323234c]" />
              <span className="font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#2323234c]">
                정보
              </span>
            </button>
            <button className="h-auto flex flex-col items-center gap-[5px]">
              <MessageCircleIcon className="w-7 h-7 text-[#2323234c]" />
              <span className="font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#2323234c]">
                AI 버디
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};
