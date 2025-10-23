import {
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  HomeIcon,
  MessageCircleIcon,
  PieChartIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { getCurrentUser, setCurrentUser, getMockGrades, getUniversityInfoData } from "../../db";
import api from "../../api/axios";

/* ================= JWT / me 파싱 헬퍼 ================= */

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
const ensureUserFromAnywhere = async () => {
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

const navItems = [
  { icon: CalendarIcon, label: "캘린더", path: "/todolist" },
  { icon: ClockIcon,   label: "공부시간", path: "/studytime" },
  { icon: HomeIcon,    label: "홈",       path: "/home" },
  { icon: PieChartIcon,label: "정보",     path: "/info" },
  { icon: MessageCircleIcon, label: "AI 버디", path: "/aibuddy" },
];

/* ================= D-day 헬퍼 ================= */
const toMidnight = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = toMidnight(new Date());
  const target = toMidnight(new Date(dateStr));
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
const getNextMockDate = (mockList = []) => {
  const todayMs = toMidnight(new Date()).getTime();
  const upcoming = mockList
    .map((m) => toMidnight(new Date(m.date)))
    .filter((d) => d.getTime() >= todayMs)
    .sort((a, b) => a - b);
  return upcoming.length ? upcoming[0].toISOString().slice(0, 10) : null;
};
/* ============================================== */

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ D-day 상태
  const [dDayNextExam, setDDayNextExam] = useState(null);
  const [dDaySuneung, setDDaySuneung] = useState(null);

  // ✅ 대시보드에 표시할 과목 막대들 (내 점수만 동적, 평균은 더미값 유지/향후 API 연동)
  const [subjects, setSubjects] = useState([
    { name: "국어", myScore: 0, schoolAvg: 75, nationalAvg: 70 },
    { name: "영어", myScore: 0, schoolAvg: 80, nationalAvg: 75 },
    { name: "수학", myScore: 0, schoolAvg: 72, nationalAvg: 68 },
    { name: "통합사회", myScore: 0, schoolAvg: 45, nationalAvg: 48 },
    { name: "통합과학", myScore: 0, schoolAvg: 45, nationalAvg: 40 },
    { name: "한국사", myScore: 0, schoolAvg: 55, nationalAvg: 60 },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, subject: "수학", description: "미적분까지 복습하기", completed: false },
    { id: 2, subject: "과목", description: "복습할 내용 작성", completed: false },
  ]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTaskSubject, setNewTaskSubject] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [swipedTaskId, setSwipedTaskId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // ✅ 마운트 시 사용자/성적/디데이 세팅
  useEffect(() => {
    (async () => {
      const me = await ensureUserFromAnywhere();

      // 1) 모의고사/수능 D-day 세팅 (DB의 UniversityInfo 데이터 기반)
      try {
        const uinfo = getUniversityInfoData?.() ?? null;
        const nextMock = getNextMockDate(uinfo?.exams?.mock2025 || []);
        setDDayNextExam(nextMock ? daysUntil(nextMock) : null);

        const suneung = uinfo?.exams?.reference?.suneungDate || null;
        setDDaySuneung(suneung ? daysUntil(suneung) : null);
      } catch {
        setDDayNextExam(null);
        setDDaySuneung(null);
      }

      // 2) 최신 모의고사 점수로 대시보드 업데이트
      if (me?.id) {
        const list = getMockGrades(Number(me.id));
        const latest = list.length ? list[list.length - 1] : null;
        if (latest) {
          const next = [
            { name: "국어",   myScore: latest.korean  ?? latest.korean1 ?? 0, schoolAvg: 75, nationalAvg: 70 },
            { name: "영어",   myScore: latest.english ?? 0,               schoolAvg: 80, nationalAvg: 75 },
            { name: "수학",   myScore: latest.math    ?? latest.math1   ?? 0, schoolAvg: 72, nationalAvg: 68 },
            { name: "통합사회", myScore: latest.elective1 ?? 0,           schoolAvg: 45, nationalAvg: 48 },
            { name: "통합과학", myScore: latest.elective2 ?? 0,           schoolAvg: 45, nationalAvg: 40 },
            { name: "한국사", myScore: latest.history ?? 0,              schoolAvg: 55, nationalAvg: 60 },
          ];
          setSubjects(next);
        }
      }
    })();
  }, []);

  const handleProfileClick = () => navigate("/mypage");

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) => {
      const updated = prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const incomplete = updated.filter((t) => !t.completed);
      const completed = updated.filter((t) => t.completed);
      return [...incomplete, ...completed];
    });
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSwipedTaskId(null);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = (taskId) => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setSwipedTaskId(taskId);
    else if (distance < -50) setSwipedTaskId(null);
  };

  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };
  const handleMouseMove = (e) => {
    if (touchStart !== null) setTouchEnd(e.clientX);
  };
  const handleMouseUp = (taskId) => {
    if (touchStart === null || touchEnd === null) {
      setTouchStart(null);
      return;
    }
    const distance = touchStart - touchEnd;
    if (distance > 50) setSwipedTaskId(taskId);
    else if (distance < -50) setSwipedTaskId(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleAddTask = () => {
    if (newTaskSubject.trim() && newTaskDescription.trim()) {
      const newTask = {
        id: tasks.length + 1,
        subject: newTaskSubject,
        description: newTaskDescription,
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskSubject("");
      setNewTaskDescription("");
      setShowAddInput(false);
    }
  };

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center" data-model-id="22:250">
      <div className="h-screen w-[480px] relative bg-[#e7edff] flex flex-col">
        <header className="w-[480px] h-[76px] flex items-end bg-[#e7edff] shadow-[0px_2px_2px_#2323231a] flex-shrink-0">
          <nav className="h-12 w-full bg-[#e7edff] flex items-center justify-between px-6">
            <div className="w-7 h-7" />
            <div className="w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />
            <button
              onClick={handleProfileClick}
              className="w-7 h-7 rounded-full overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                className="w-full h-full object-cover"
                alt="Profile"
                src="https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-9-1.png"
              />
            </button>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[16px] pb-[20px] flex flex-col gap-[15px]">
          {/* D-day */}
          <section className="flex flex-col items-center gap-2 opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:0ms]">
            <h1 className="[font-family:'Noto_Sans_KR',Helvetica] font-black text-[#628af9] text-[40px] tracking-[0] leading-[normal]">
              D-day
            </h1>
            <p className="font-normal text-[#000000] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              <span>다음 모의고사까지 </span>
              <span className="font-bold">
                {dDayNextExam !== null ? `${dDayNextExam}일` : "-일"}
              </span>
              <span> 남았습니다!</span>
            </p>
            <p className="font-normal text-[#000000] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              <span>수능까지 </span>
              <span className="font-bold">
                {dDaySuneung !== null ? `${dDaySuneung}일` : "-일"}
              </span>
              <span> 남았습니다!</span>
            </p>
          </section>

          <div className="relative opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
            <SearchIcon className="absolute top-[13px] left-[25px] w-6 h-6 text-[#2323234c]" />
            <Input
              placeholder="궁금한 모든 것들을 검색해보세요!"
              className="w-full h-[50px] bg-white rounded-[50px] border-2 border-solid border-[#628af9] pl-16 pr-6 font-normal text-[#2323234c] text-[11px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] placeholder:text-[#2323234c]"
            />
          </div>

          {/* 투두 카드 */}
          <Card className="w-full bg-white rounded-[10px] border-0 shadow-none opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:400ms]">
            <CardContent className="p-0">
              <div className="pt-[25px] px-[35px] pb-[25px]">
                <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                  오늘
                </h2>
                <p className="mt-[19px] font-normal text-[#232323] text-[8px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                  2025. 10. 18 토요일
                </p>

                <img
                  className="w-full h-px object-cover mt-[14px]"
                  alt="Divider"
                  src="https://c.animaapp.com/mghllw7nnesCnv/img/line-11-1.svg"
                />

                <div className="mt-4 flex flex-col gap-[5px]">
                  {tasks.map((task) => (
                    <div key={task.id} className="relative w-full h-[50px] overflow-hidden rounded-[10px]">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="absolute right-0 top-0 h-full w-[80px] bg-[#ff6b6b] flex items-center justify-center"
                      >
                        <TrashIcon className="w-5 h-5 text-white" />
                      </button>

                      <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(task.id)}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={() => handleMouseUp(task.id)}
                        onMouseLeave={() => {
                          setTouchStart(null);
                          setTouchEnd(null);
                        }}
                        className={`w-full h-[50px] rounded-[10px] px-[25px] flex items-center justify-between transition-transform duration-300 cursor-pointer relative ${
                          task.completed ? "bg-[#a8c5f7]" : "bg-[#628af9]"
                        }`}
                        style={{
                          transform: swipedTaskId === task.id ? "translateX(-80px)" : "translateX(0)",
                        }}
                      >
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="flex-1 flex items-center justify-between h-full"
                        >
                          <div className="text-left">
                            <h3 className="font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#f8f9ff]">
                              {task.subject}
                            </h3>
                            <p className="mt-[2px] font-normal text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#f8f9ff]">
                              {task.description}
                            </p>
                          </div>

                          {task.completed ? (
                            <img
                              className="w-[13px] h-[13px]"
                              alt="Checked"
                              src="https://c.animaapp.com/mghllw7nnesCnv/img/group-8.png"
                            />
                          ) : (
                            <div className="w-[13px] h-[13px] rounded-[6.5px] border-[1.5px] border-solid border-[#f8f9ff]" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {showAddInput ? (
                    <div className="w-full bg-[#23232326] rounded-[10px] p-[10px] flex flex-col gap-2">
                      <Input
                        placeholder="과목"
                        value={newTaskSubject}
                        onChange={(e) => setNewTaskSubject(e.target.value)}
                        className="h-[30px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                      />
                      <Input
                        placeholder="할 일 내용"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        className="h-[30px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddTask}
                          className="flex-1 h-[25px] bg-[#628af9] text-[#f8f9ff] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] hover:bg-[#5279e0]"
                        >
                          추가
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAddInput(false);
                            setNewTaskSubject("");
                            setNewTaskDescription("");
                          }}
                          className="flex-1 h-[25px] bg-[#23232399] text-[#f8f9ff] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] hover:bg-[#232323]"
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddInput(true)}
                      className="w-full h-[35px] bg-[#23232326] rounded-[10px] px-[18px] flex items-center cursor-pointer"
                    >
                      <p className="font-normal text-[#232323b2] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                        + 할 일을 추가해주세요!
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 성적 대시보드 카드 */}
          <Card className="w-full bg-white rounded-[10px] border-0 shadow-none opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:600ms]">
            <CardContent className="p-0">
              <div className="pt-5 px-[31px] pb-5">
                <h2 className="font-bold text-[#000000] text-sm [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                  나의 모의고사 성적 대시보드
                </h2>

                <div className="mt-[27px] flex items-center gap-[13px]">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#628af9] rounded" />
                    <span className="font-normal text-[#000000] text-[9px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                      내 점수
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#ff9d89] rounded" />
                    <span className="font-normal text-[#000000] text-[9px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                      우리 학교 평균 점수
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#dedede] rounded" />
                    <span className="font-normal text-[#000000] text-[9px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                      전국 평균 점수
                    </span>
                  </div>
                </div>

                <div className="mt-[21px] relative h-[189px]">
                  <div className="absolute left-0 top-0 bottom-[25px] flex flex-col justify-between text-right pr-[6px]">
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px]">100</span>
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px]">75</span>
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px]">50</span>
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px]">25</span>
                  </div>

                  <div className="absolute left-[37px] right-0 top-0 bottom-[25px] flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <img
                        key={idx}
                        className="w-full h-px object-cover"
                        alt="Grid line"
                        src="https://c.animaapp.com/mghllw7nnesCnv/img/line-21.svg"
                      />
                    ))}
                  </div>

                  <div className="absolute left-[37px] right-0 top-0 bottom-[25px] flex items-end justify-between px-[5px]">
                    {subjects.map((subject, index) => (
                      <div key={index} className="flex gap-[1px] items-end">
                        <div
                          className="w-2.5 bg-[#628af9]"
                          style={{ height: `${Math.max(0, Math.min(100, subject.myScore)) / 100 * 173}px` }}
                        />
                        <div
                          className="w-2.5 bg-[#ff9d89]"
                          style={{ height: `${Math.max(0, Math.min(100, subject.schoolAvg)) / 100 * 173}px` }}
                        />
                        <div
                          className="w-2.5 bg-[#dedede]"
                          style={{ height: `${Math.max(0, Math.min(100, subject.nationalAvg)) / 100 * 173}px` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="absolute left-[37px] right-0 bottom-0 flex justify-between px-[4px] pt-[6px]">
                    {subjects.map((subject, index) => (
                      <span key={index} className="font-bold text-[#232323cc] text-[11px] [font-family:'Noto_Sans_KR',Helvetica]">
                        {subject.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <nav className="w-[480px] h-[70px] bg-[#f8f9ff] rounded-[15px_15px_0px_0px] shadow-[0px_-2px_8px_#2323231a] flex-shrink-0">
          <div className="h-full flex items-start justify-around pt-3">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="h-auto flex flex-col items-center gap-[5px]"
                  aria-label={item.label}
                >
                  <item.icon className={`w-7 h-7 ${isActive ? "text-[#628af9] fill-[#628af9]" : "text-[#2323234c]"}`} />
                  <span className={`font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] ${isActive ? "text-[#628af9]" : "text-[#2323234c]"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Home;
