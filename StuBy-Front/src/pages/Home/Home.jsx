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
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const subjects = [
  { name: "국어", myScore: 90, schoolAvg: 75, nationalAvg: 70 },
  { name: "영어", myScore: 95, schoolAvg: 80, nationalAvg: 75 },
  { name: "수학", myScore: 70, schoolAvg: 72, nationalAvg: 68 },
  { name: "통합사회", myScore: 50, schoolAvg: 45, nationalAvg: 48 },
  { name: "통합과학", myScore: 45, schoolAvg: 45, nationalAvg: 40 },
  { name: "한국사", myScore: 65, schoolAvg: 55, nationalAvg: 60 },
];

const navItems = [
  { icon: CalendarIcon, label: "캘린더", active: false },
  { icon: ClockIcon, label: "공부시간", active: false },
  { icon: HomeIcon, label: "홈", active: true },
  { icon: PieChartIcon, label: "정보", active: false },
  { icon: MessageCircleIcon, label: "AI 버디", active: false },
];

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      subject: "수학",
      description: "미적분까지 복습하기",
      completed: false,
    },
    { id: 2, subject: "과목", description: "복습할 내용 작성", completed: false },
  ]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTaskSubject, setNewTaskSubject] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [swipedTaskId, setSwipedTaskId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleProfileClick = () => {
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469");
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      
      const incompleteTasks = updatedTasks.filter((task) => !task.completed);
      const completedTasks = updatedTasks.filter((task) => task.completed);
      
      return [...incompleteTasks, ...completedTasks];
    });
  };

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setSwipedTaskId(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (taskId: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setSwipedTaskId(taskId);
    } else if (isRightSwipe) {
      setSwipedTaskId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = (taskId: number) => {
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setSwipedTaskId(taskId);
    } else if (isRightSwipe) {
      setSwipedTaskId(null);
    }
    
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
      setTasks([...tasks, newTask]);
      setNewTaskSubject("");
      setNewTaskDescription("");
      setShowAddInput(false);
    }
  };

  return (
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="22:250"
    >
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
          <section className="flex flex-col items-center gap-2 opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:0ms]">
            <h1 className="[font-family:'Noto_Sans_KR',Helvetica] font-black text-[#628af9] text-[40px] tracking-[0] leading-[normal]">
              D-day
            </h1>

            <p className="font-normal text-[#000000] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#000000] text-xs tracking-[0]">
                다음 모의고사까지{" "}
              </span>
              <span className="font-bold">105일</span>
              <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#000000] text-xs tracking-[0]">
                {" "}
                남았습니다!
              </span>
            </p>

            <p className="font-normal text-[#000000] text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
              <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#000000] text-xs tracking-[0]">
                수능까지{" "}
              </span>
              <span className="font-bold">200일</span>
              <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#000000] text-xs tracking-[0]">
                {" "}
                남았습니다!
              </span>
            </p>
          </section>

          <div className="relative opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
            <SearchIcon className="absolute top-[13px] left-[25px] w-6 h-6 text-[#2323234c]" />
            <Input
              placeholder="궁금한 모든 것들을 검색해보세요!"
              className="w-full h-[50px] bg-white rounded-[50px] border-2 border-solid border-[#628af9] pl-16 pr-6 font-normal text-[#2323234c] text-[11px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] placeholder:text-[#2323234c]"
            />
          </div>

          <Card className="w-full bg-white rounded-[10px] border-0 shadow-none opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:400ms]">
            <CardContent className="p-0">
              <div className="pt-[25px] px-[35px] pb-[25px]">
                <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                  오늘
                </h2>
                <p className="mt-[19px] font-normal text-[#232323] text-[8px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]">
                  2025. 10. 05 일요일
                </p>

                <img
                  className="w-full h-px object-cover mt-[14px]"
                  alt="Divider"
                  src="https://c.animaapp.com/mghllw7nnesCnv/img/line-11-1.svg"
                />

                <div className="mt-4 flex flex-col gap-[5px]">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="relative w-full h-[50px] overflow-hidden rounded-[10px]"
                    >
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
                          transform: swipedTaskId === task.id ? 'translateX(-80px)' : 'translateX(0)',
                        }}
                      >
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="flex-1 flex items-center justify-between h-full"
                        >
                          <div className="text-left">
                            <h3
                              className={`font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#f8f9ff]`}
                            >
                              {task.subject}
                            </h3>
                            <p
                              className={`mt-[2px] font-normal text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] text-[#f8f9ff]`}
                            >
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
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px] tracking-[0] leading-[normal]">
                      100
                    </span>
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px] tracking-[0] leading-[normal]">
                      75
                    </span>
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px] tracking-[0] leading-[normal]">
                      50
                    </span>
                    <span className="[font-family:'Noto_Sans_KR',Helvetica] font-normal text-[#23232380] text-[11px] tracking-[0] leading-[normal]">
                      25
                    </span>
                  </div>

                  <div className="absolute left-[37px] right-0 top-0 bottom-[25px] flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <img
                        key={index}
                        className="w-full h-px object-cover"
                        alt="Grid line"
                        src="https://c.animaapp.com/mghllw7nnesCnv/img/line-21.svg"
                      />
                    ))}
                  </div>

                  <div className="absolute left-[37px] right-0 top-0 bottom-[25px] flex items-end justify-between px-[31px]">
                    {subjects.map((subject, index) => (
                      <div key={index} className="flex gap-[2px] items-end">
                        <div
                          className="w-2.5 bg-[#628af9]"
                          style={{
                            height: `${(subject.myScore / 100) * 173}px`,
                          }}
                        />
                        <div
                          className="w-2.5 bg-[#ff9d89]"
                          style={{
                            height: `${(subject.schoolAvg / 100) * 173}px`,
                          }}
                        />
                        <div
                          className="w-2.5 bg-[#dedede]"
                          style={{
                            height: `${(subject.nationalAvg / 100) * 173}px`,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="absolute left-[37px] right-0 bottom-0 h-px bg-[#23232380]" />

                  <div className="absolute left-[37px] right-0 bottom-0 flex justify-between px-[4px] pt-[6px]">
                    {subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="font-bold text-[#232323cc] text-[11px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal]"
                      >
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
            {navItems.map((item, index) => (
              <button
                key={index}
                className="h-auto flex flex-col items-center gap-[5px]"
              >
                <item.icon
                  className={`w-7 h-7 ${
                    item.active
                      ? "text-[#628af9] fill-[#628af9]"
                      : "text-[#2323234c]"
                  }`}
                />
                <span
                  className={`font-bold text-[10px] [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] ${
                    item.active ? "text-[#628af9]" : "text-[#2323234c]"
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
