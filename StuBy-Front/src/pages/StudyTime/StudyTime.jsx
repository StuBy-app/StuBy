// src/pages/StudyTime/StudyTime.jsx
import {
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Play as PlayIcon,
  Square as SquareIcon,
  X as XIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Home as HomeIcon,
  PieChart as PieChartIcon,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";
import { Input } from "../../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  getCurrentUser,
  getGroups,
  createGroup,
  getTimers,
  updateTimer,
  addTimer,
} from "../../db";

// --- helpers ---
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
};
const groupColors = ["#A8C5F7", "#FFD1A8", "#B8E0D4", "#F7A8D1", "#C5A8F7", "#A8F7C5"];
const getRandomColor = () =>
  groupColors[Math.floor(Math.random() * groupColors.length)];
const isUrl = (s) => typeof s === "string" && /^https?:\/\//i.test(s);

export const StudyTime = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupVisibility, setNewGroupVisibility] = useState("공개");
  const [newGroupCover, setNewGroupCover] = useState(getRandomColor());

  const [timers, setTimers] = useState([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [showAddSubjectInput, setShowAddSubjectInput] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const carouselRef = useRef(null);
  const intervalRefs = useRef({}); // { [timerId]: intervalId }

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setGroups(getGroups(currentUser.id));
      setTimers(getTimers(currentUser.id));
    }
  }, []);

  useEffect(() => {
    setFilteredGroups(
      groups.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, groups]);

  useEffect(() => {
    const newTotal = timers.reduce((sum, t) => sum + t.elapsedTime, 0);
    setTotalStudyTime(newTotal);

    timers.forEach((timer) => {
      if (timer.isRunning) {
        if (!intervalRefs.current[timer.id]) {
          const interval = setInterval(() => {
            setTimers((prev) =>
              prev.map((t) =>
                t.id === timer.id ? { ...t, elapsedTime: t.elapsedTime + 1 } : t
              )
            );
          }, 1000);
          intervalRefs.current[timer.id] = interval;
        }
      } else {
        if (intervalRefs.current[timer.id]) {
          clearInterval(intervalRefs.current[timer.id]);
          intervalRefs.current[timer.id] = undefined;
        }
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach((id) => id && clearInterval(id));
      intervalRefs.current = {};
    };
  }, [timers]);

  const handleBackClick = () => navigate("/u4370u4457u4535");
  const handleProfileClick = () =>
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469");

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.offsetWidth / 3;
    carouselRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCreateGroup = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return alert("로그인된 사용자 정보가 없습니다.");
    if (!newGroupName.trim() || !newGroupDescription.trim())
      return alert("그룹명과 설명을 입력해주세요.");

    const newGroup = createGroup(currentUser.id, {
      thumbnail: newGroupCover, // hex color or url
      name: newGroupName,
      description: newGroupDescription,
      currentMembers: 1,
      maxMembers: 5,
      visibility: newGroupVisibility,
    });

    if (newGroup) {
      setGroups((prev) => [...prev, newGroup]);
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupVisibility("공개");
      setNewGroupCover(getRandomColor());
      setShowCreateGroupModal(false);
    } else {
      alert("그룹 생성에 실패했습니다.");
    }
  };

  const toggleTimer = (id) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === id) {
          const updated = { ...timer, isRunning: !timer.isRunning };
          updateTimer(currentUser.id, updated);
          return updated;
        }
        return timer;
      })
    );
  };

  const handleAddSubject = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return alert("로그인된 사용자 정보가 없습니다.");
    if (!newSubjectName.trim()) return alert("과목명을 입력해주세요.");

    const newTimer = addTimer(currentUser.id, {
      subject: newSubjectName,
      elapsedTime: 0,
      isRunning: false,
    });
    if (newTimer) {
      setTimers((prev) => [...prev, newTimer]);
      setNewSubjectName("");
      setShowAddSubjectInput(false);
    }
  };

  const handleRankingClick = () => navigate("/studytime/ranking");

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
          {/* 그룹 영역 */}
          <section className="flex flex-col gap-4">
            <div className="relative">
              <SearchIcon className="absolute top-[13px] left-[25px] w-6 h-6 text-[#2323234c]" />
              <Input
                placeholder="돌아가고 싶은 그룹명을 검색해보세요!"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[50px] bg-white rounded-[50px] border-2 border-solid border-[#628af9] pl-16 pr-6 font-normal text-[11px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] placeholder:text-[#2323234c]"
              />
            </div>

            <div className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 z-10 w-8 h-8 p-0 bg-white/50 rounded-full hover:bg-white/70"
                aria-label="왼쪽으로 스크롤"
              >
                <ChevronLeftIcon className="w-5 h-5 text-[#232323]" />
              </Button>
              <div
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 py-2"
              >
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="min-w-[120px] w-[120px] h-[150px] rounded-[10px] border-2 border-[#628af9] flex-shrink-0 snap-center cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/studytime/group/${group.id}`)}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      {/* 썸네일: URL이면 이미지, 아니면 배경색 원 */}
                      {isUrl(group.thumbnail) ? (
                        <img
                          src={group.thumbnail}
                          alt={group.name}
                          className="w-14 h-14 rounded-full object-cover mb-2"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full mb-2"
                          style={{ backgroundColor: group.thumbnail }}
                        />
                      )}

                      <h3 className="font-bold text-[#232323] text-xs [font-family:'Noto_Sans_KR',Helvetica] leading-tight">
                        {group.name}
                      </h3>
                      <p className="text-[9px] text-[#23232380] [font-family:'Noto_Sans_KR',Helvetica] leading-tight mt-1">
                        {group.description}
                      </p>
                      <p className="text-[8px] text-[#23232366] [font-family:'Noto_Sans_KR',Helvetica] mt-1">
                        ({group.currentMembers}/{group.maxMembers})
                      </p>
                    </CardContent>
                  </Card>
                ))}
                <Card
                  className="min-w-[120px] w-[120px] h-[150px] rounded-[10px] border-2 border-dashed border-[#628af9] flex-shrink-0 snap-center flex items-center justify-center cursor-pointer hover:bg-[#f0f4ff] transition-colors"
                  onClick={() => setShowCreateGroupModal(true)}
                >
                  <PlusIcon className="w-8 h-8 text-[#628af9]" />
                </Card>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 z-10 w-8 h-8 p-0 bg-white/50 rounded-full hover:bg-white/70"
                aria-label="오른쪽으로 스크롤"
              >
                <ChevronLeftIcon className="w-5 h-5 text-[#232323] rotate-180" />
              </Button>
            </div>
          </section>

          {/* 타이머 섹션 */}
          <section className="flex flex-col gap-4">
            <Card className="bg-[#628af9] rounded-[10px] border-0 p-4 text-center">
              <h2 className="font-bold text-[#f8f9ff] text-sm [font-family:'Noto_Sans_KR',Helvetica] mb-2">
                총 공부시간
              </h2>
              <p className="font-black text-[#f8f9ff] text-[40px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                {formatTime(totalStudyTime)}
              </p>
            </Card>

            <div className="flex flex-col gap-2">
              {timers.map((timer) => (
                <Card
                  key={timer.id}
                  className="bg-white rounded-[10px] border-2 border-[#628af9] p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTimer(timer.id)}
                      className="w-8 h-8 p-0 hover:bg-transparent"
                      aria-label={timer.isRunning ? "정지" : "시작"}
                    >
                      {timer.isRunning ? (
                        <SquareIcon className="w-5 h-5 text-[#628af9]" />
                      ) : (
                        <PlayIcon className="w-5 h-5 text-[#628af9]" />
                      )}
                    </Button>
                    <span className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                      {timer.subject}
                    </span>
                  </div>
                  <span className="font-medium text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                    {formatTime(timer.elapsedTime)}
                  </span>
                </Card>
              ))}

              {showAddSubjectInput ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="과목명"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onBlur={handleAddSubject}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
                    className="flex-1 h-[35px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                    autoFocus
                  />
                  <Button
                    onClick={() => setShowAddSubjectInput(false)}
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 p-0 text-[#ff6b6b] hover:bg-[#ff6b6b]/10"
                    aria-label="과목 추가 취소"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAddSubjectInput(true)}
                  className="w-full h-[35px] bg-[#e7edff] hover:bg-[#d0dcff] text-[#628af9] rounded-[10px] border-2 border-dashed border-[#628af9] text-xs [font-family:'Noto_SANS_KR',Helvetica] font-medium"
                  aria-label="과목 추가"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  과목을 작성해주세요
                </Button>
              )}
            </div>
          </section>

          <Button
            onClick={handleRankingClick}
            className="w-full h-[45px] bg-[#628af9] hover:bg-[#5279e0] text-[#f8f9ff] rounded-[15px] text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium mt-4"
            aria-label="랭킹 보기"
          >
            랭킹 보기
          </Button>
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
            <button className="h-auto flex flex-col items-center gap-[5px]">
              <ClockIcon className="w-7 h-7 text-[#628af9] fill-[#628af9]" />
              <span className="font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#628af9]">
                공부시간
              </span>
            </button>
            <button
              onClick={() => navigate("/u4370u4457u4535")}
              className="h-auto flex flex-col items-center gap-[5px]"
            >
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

      {/* 그룹 생성 모달 */}
      <Dialog open={showCreateGroupModal} onOpenChange={setShowCreateGroupModal}>
        <DialogContent className="w-[350px] bg-[#f8f9ff] rounded-[15px] border-0 p-0 gap-0">
          <DialogHeader className="pt-[25px] px-6 pb-0 space-y-0">
            <DialogTitle className="font-bold text-[#232323] text-lg text-center [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              그룹 생성
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                그룹 커버
              </span>
              <div className="grid grid-cols-4 gap-2">
                {groupColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setNewGroupCover(color)}
                    className={`w-full h-[60px] rounded-[8px] border-2 ${
                      newGroupCover === color
                        ? "border-[#628af9]"
                        : "border-transparent"
                    } hover:border-[#628af9] transition-colors`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                그룹명
              </span>
              <Input
                placeholder="그룹명을 입력해주세요"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="h-[40px] text-sm [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                그룹 설명
              </span>
              <Input
                placeholder="그룹 설명을 입력해주세요"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="h-[40px] text-sm [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                공개 설정
              </span>
              <Select
                value={newGroupVisibility}
                onValueChange={setNewGroupVisibility}
              >
                <SelectTrigger className="w-full h-[40px] text-sm [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]">
                  <SelectValue placeholder="공개 범위" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="공개">공개</SelectItem>
                  <SelectItem value="승인제">승인제</SelectItem>
                  <SelectItem value="비공개">비공개</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-center pt-[20px] pb-[15px] px-0">
            <Button
              onClick={handleCreateGroup}
              className="w-[250px] h-[45px] bg-[#628af9] hover:bg-[#5279e0] text-[#f8f9ff] rounded-[15px] text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium"
            >
              그룹 생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyTime;
