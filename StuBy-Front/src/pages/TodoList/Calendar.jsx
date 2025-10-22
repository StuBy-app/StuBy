import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Trash as TrashIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Home as HomeIcon,
  PieChart as PieChartIcon,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { CalendarComponent } from "../../components/CalendarComponent/CalendarComponent";
import {
  getCurrentUser,
  getTodosByDate,
  getFollowingUsers,
  deleteTodo,
} from "../../db";

const formatFullDate = (date) => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function Calendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { friendId } = useParams();

  const [calendarItems, setCalendarItems] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // 친구 더미 캘린더 데이터
  const friendCalendarMap = {
    f1: [
      { id: "f1-1", subject: "영어", note: "듣기 3세트" },
      { id: "f1-2", subject: "수학", note: "기벡 2단원" },
    ],
    f2: [
      { id: "f2-1", subject: "국어", note: "문학 작품 1편" },
      { id: "f2-2", subject: "한국사", note: "근현대사" },
      { id: "f2-3", subject: "영어", note: "단어 40개" },
    ],
    f4: [
      { id: "f2-1", subject: "국어", note: "오답노트" },
      { id: "f2-2", subject: "한국사", note: "근현대사" },
      { id: "f2-3", subject: "영어", note: "단어 시험 틀린 거 다시 외우기" },
      { id: "f2-3", subject: "과학", note: "수업시간 배운 것 인강 듣기" },
    ],
  };

  const fetchCalendarItems = useCallback(() => {
    setLoading(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인된 사용자 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const dateString = selectedCalendarDate.toISOString().split("T")[0];

    if (friendId) {
      const friendData = friendCalendarMap[friendId];
      setCalendarItems(friendData ? friendData : []);
    } else {
      const myTodosForDate = getTodosByDate(currentUser.id, dateString) || [];
      setCalendarItems(myTodosForDate);
    }
    setLoading(false);
  }, [friendId, selectedCalendarDate, navigate]);

  useEffect(() => {
    fetchCalendarItems();
  }, [fetchCalendarItems]);

  const handleBackClick = () => {
    if (friendId) {
      navigate("/todolist");
    } else {
      navigate("/todolist");
    }
  };

  const deleteCalendarItem = (id) => {
    const currentUser = getCurrentUser();
    if (!currentUser || friendId) return; // 친구 캘린더는 삭제 불가
    if (deleteTodo(currentUser.id, Number(id))) {
      setCalendarItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const navItems = [
    { icon: CalendarIcon, label: "캘린더", path: "/todolist" },
    { icon: ClockIcon, label: "공부시간", path: "/studytime" },
    { icon: HomeIcon, label: "홈", path: "/home" },
    { icon: PieChartIcon, label: "정보", path: "/info" },
    { icon: MessageCircleIcon, label: "AI 버디", path: "/aibuddy" },
  ];

  const getFriendName = (id) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const followingUsers = getFollowingUsers(currentUser.id) || [];
      const friend = followingUsers.find((f) => String(f.id) === String(id));
      return friend ? `${friend.name}의 캘린더` : "친구의 캘린더";
    }
    return "친구의 캘린더";
  };

  const handleDateSelect = useCallback((date) => {
    setSelectedCalendarDate(date);
  }, []);

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
      <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        {/* 헤더 */}
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

            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("햄버거 메뉴 클릭")}
              className="w-6 h-6 p-0 hover:bg-transparent"
              aria-label="메뉴"
            >
              <MenuIcon className="w-6 h-6 text-[#232323]" />
            </Button>
          </nav>
        </header>

        {/* 본문 */}
        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[25px] pb-[25px] flex flex-col gap-[20px]">
          {/* 실제 달력 컴포넌트 (텍스트 박스 X) */}
          <CalendarComponent
            onDateSelect={handleDateSelect}
            initialDate={selectedCalendarDate}
          />

          {/* 하단 파란 패널 - 할 일 리스트 */}
          <Card className="bg-[#628af9] rounded-[10px] border-0 p-4 flex flex-col gap-3">
            <h2 className="font-bold text-[#f8f9ff] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
              {friendId ? getFriendName(friendId) : "내 할 일"}
              <span className="font-normal text-[10px] text-[#f8f9ff] ml-2">
                {formatFullDate(selectedCalendarDate)}
              </span>
            </h2>

            {loading ? (
              <p className="text-[#f8f9ff80]">불러오는 중...</p>
            ) : calendarItems.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {calendarItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between bg-[#5279e0] rounded-[8px] p-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] text-[#f8f9ff]">
                        {item.subject}
                      </span>
                      <span className="font-normal text-[10px] [font-family:'Noto_Sans_KR',Helvetica] text-[#f8f9ff] mt-1">
                        {item.note}
                      </span>
                    </div>

                    {!friendId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCalendarItem(item.id)}
                        className="w-8 h-8 p-0 text-[#f8f9ff] hover:bg-[#f8f9ff]/20"
                        aria-label="삭제"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#f8f9ff80]">할 일이 없습니다.</p>
            )}
          </Card>
        </main>

        {/* 하단 네비게이션 */}
        <nav className="w-[480px] h-[70px] bg-[#f8f9ff] rounded-[15px_15px_0px_0px] shadow-[0px_-2px_8px_#2323231a] flex-shrink-0">
          <div className="h-full flex items-start justify-around pt-3">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="h-auto flex flex-col items-center gap-[5px]"
                aria-label={item.label}
              >
                <item.icon
                  className={`w-7 h-7 ${
                    location.pathname === item.path ||
                    (item.path === "/calendar" && friendId)
                      ? "text-[#628af9] fill-[#628af9]"
                      : "text-[#2323234c]"
                  }`}
                />
                <span
                  className={`font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] ${
                    location.pathname === item.path ||
                    (item.path === "/calendar" && friendId)
                      ? "text-[#628af9]"
                      : "text-[#2323234c]"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
