import {
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Home as HomeIcon,
  PieChart as PieChartIcon,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { getUniversityInfoData } from "../../db";

const navItems = [
  { icon: CalendarIcon, label: "캘린더", path: "/todolist" },
  { icon: ClockIcon, label: "공부시간", path: "/studytime" },
  { icon: HomeIcon, label: "홈", path: "/home" },
  { icon: PieChartIcon, label: "정보", path: "/info" },
  { icon: MessageCircleIcon, label: "AI 버디", path: "/aibuddy" },
];

const calculateDday = (targetDateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(targetDateString);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
};

const formatFullDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.getFullYear()}. ${startDate.getMonth() + 1}. ${startDate.getDate()} ~ ${endDate.getFullYear()}. ${endDate.getMonth() + 1}. ${endDate.getDate()}`;
};

export default function UniversityInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [universityData, setUniversityData] = useState([]);
  const [examsData, setExamsData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [dDayNextExam, setDDayNextExam] = useState(null);
  const [dDaySuneung, setDDaySuneung] = useState(null);

  useEffect(() => {
    const data = getUniversityInfoData();
    setUniversityData(data.universities);
    setExamsData(data.exams);

    if (data.page.selectedUniversityId) {
      const initialSelected = data.universities.find(
        (uni) => uni.id === data.page.selectedUniversityId
      );
      setSelectedUniversity(initialSelected || null);
    }

    if (data.exams.reference.nextImportantDate) {
      setDDayNextExam(calculateDday(data.exams.reference.nextImportantDate));
    }
    setDDaySuneung(200);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUniversities(universityData);
    } else {
      setFilteredUniversities(
        universityData.filter(
          (uni) =>
            uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            uni.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
      );
    }
  }, [searchQuery, universityData]);

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleProfileClick = () => {
    navigate("/mypage");
  };

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
  };

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
          {/* D-day 타이틀 */}
          <section className="flex flex-col items-center gap-2">
            <h1 className="[font-family:'Noto_Sans_KR',Helvetica] font-black text-[#628af9] text-[40px] tracking-[0] leading-[normal]">
              D-day
            </h1>
            <p className="font-normal text-[#000000] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              <span>다음 모의고사까지 </span>
              {/* <span className="font-bold">{dDayNextExam !== null ? dDayNextExam : "N"}일</span> */}
              <span className="font-bold">-일</span>
              <span> 남았습니다!</span>
            </p>
            <p className="font-normal text-[#000000] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              <span>수능까지 </span>
              <span className="font-bold">{dDaySuneung !== null ? dDaySuneung : "M"}일</span>
              {/* <span className="font-bold">22일</span> */}
              <span> 남았습니다!</span>
            </p>
          </section>

          {/* 검색 바 */}
          <div className="relative">
            <SearchIcon className="absolute top-[13px] left-[25px] w-6 h-6 text-[#2323234c]" />
            <Input
              placeholder="대학교 명이나 입시 정보를 검색해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[50px] bg-white rounded-[50px] border-2 border-solid border-[#628af9] pl-16 pr-6 font-normal text-[11px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] placeholder:text-[#2323234c]"
            />
          </div>

          {/* 선택된 대학 상세 카드 */}
          {selectedUniversity && (
            <Card className="bg-[#e7edff] rounded-[10px] border-0 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUniversity.logoUrl}
                  alt={selectedUniversity.name}
                  className="w-10 h-10 object-contain"
                />
                <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                  {selectedUniversity.name}
                </h2>
              </div>
              <div className="flex flex-col gap-1 text-[10px] [font-family:'Noto_Sans_KR',Helvetica] text-[#23232380]">
                <p>📍 {selectedUniversity.location.address}</p>
                <p>수시 경쟁률: {selectedUniversity.admissions.early.competitionRate} : 1</p>
                <p>정시 경쟁률: {selectedUniversity.admissions.regular.competitionRate} : 1</p>
                <p>
                  수시 모집 기간:{" "}
                  {formatFullDateRange(
                    selectedUniversity.admissions.early.applicationPeriod.start,
                    selectedUniversity.admissions.early.applicationPeriod.end
                  )}
                </p>
                <p>
                  정시 모집 기간:{" "}
                  {formatFullDateRange(
                    selectedUniversity.admissions.regular.applicationPeriod.start,
                    selectedUniversity.admissions.regular.applicationPeriod.end
                  )}
                </p>
              </div>
            </Card>
          )}

          {/* 대학 카드 리스트 */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
              내가 가고싶은 대학교의 입시정보는?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {filteredUniversities.map((uni) => (
                <Card
                  key={uni.id}
                  className="bg-white rounded-[10px] border-2 border-[#628af9] p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleUniversitySelect(uni)}
                >
                  <img src={uni.logoUrl} alt={uni.name} className="w-10 h-10 object-contain mb-2" />
                  <h3 className="font-bold text-[#232323] text-xs [font-family:'Noto_Sans_KR',Helvetica] leading-tight">
                    {uni.name}
                  </h3>
                  <p className="text-[9px] text-[#23232380] [font-family:'Noto_Sans_KR',Helvetica] leading-tight mt-1">
                    수시 {uni.admissions.early.competitionRate} : 1
                  </p>
                  <p className="text-[9px] text-[#23232380] [font-family:'Noto_Sans_KR',Helvetica] leading-tight">
                    정시 {uni.admissions.regular.competitionRate} : 1
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* 2025년 모의고사 일정 */}
          {examsData && examsData.mock2025 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                2025년 모의고사 일정
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {examsData.mock2025.map((mock, index) => (
                  <Card
                    key={index}
                    className="bg-[#e7edff] rounded-[10px] border-0 p-3 flex flex-col items-center text-center"
                  >
                    <span className="font-bold text-[#628af9] text-xs [font-family:'Noto_Sans_KR',Helvetica]">
                      {mock.month}월
                    </span>
                    <p className="text-[10px] text-[#232323] [font-family:'Noto_Sans_KR',Helvetica] mt-1">
                      {formatDate(mock.date)}
                    </p>
                    <p className="text-[8px] text-[#23232380] [font-family:'Noto_Sans_KR',Helvetica] mt-1">
                      {mock.name}
                    </p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 2025년 검정고시 일정 */}
          {examsData && examsData.ged2025 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                2025년 검정고시 일정
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {examsData.ged2025.map((ged, index) => (
                  <Card key={index} className="bg-[#e7edff] rounded-[10px] border-0 p-3 flex flex-col gap-2">
                    <h3 className="font-bold text-[#628af9] text-xs [font-family:'Noto_Sans_KR',Helvetica]">
                      {ged.name}
                    </h3>
                    {ged.schedule.map((item, itemIndex) => (
                      <p key={itemIndex} className="text-[10px] text-[#232323] [font-family:'Noto_Sans_KR',Helvetica]">
                        <span className="font-medium text-[#23232380]">{item.label}: </span>
                        {formatDate(item.start)} ~ {formatDate(item.end)}
                      </p>
                    ))}
                  </Card>
                ))}
              </div>
            </section>
          )}
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
                    location.pathname === item.path
                      ? "text-[#628af9] fill-[#628af9]"
                      : "text-[#2323234c]"
                  }`}
                />
                <span
                  className={`font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] ${
                    location.pathname === item.path ? "text-[#628af9]" : "text-[#2323234c]"
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
}
