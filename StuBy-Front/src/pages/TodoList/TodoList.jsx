import {
  Calendar as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  Clock as ClockIcon,
  Home as HomeIcon,
  MessageCircle as MessageCircleIcon,
  PieChart as PieChartIcon,
  Search as SearchIcon,
  Trash as TrashIcon,
  Plus as PlusIcon,
  X as XIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { Input } from "../../components/input";
import { Avatar, AvatarImage } from "../../components/avatar";
import {
  getCurrentUser,
  getFollowingUsers,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../../db";

// 날짜 포맷: 2025. 10. 23
const formatTime = (date) => {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function TodoList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [following, setFollowing] = useState([]);
  const [todosToday, setTodosToday] = useState([]);
  const [todosTomorrow, setTodosTomorrow] = useState([]);

  const [showAddInputToday, setShowAddInputToday] = useState(false);
  const [newTodoSubjectToday, setNewTodoSubjectToday] = useState("");
  const [newTodoNoteToday, setNewTodoNoteToday] = useState("");

  const [showAddInputTomorrow, setShowAddInputTomorrow] = useState(false);
  const [newTodoSubjectTomorrow, setNewTodoSubjectTomorrow] = useState("");
  const [newTodoNoteTomorrow, setNewTodoNoteTomorrow] = useState("");

  const [swipedTodoId, setSwipedTodoId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const todayDateString = todayDate.toISOString().split("T")[0];
  const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setFollowing(getFollowingUsers(currentUser.id) || []);
      const allTodos = getTodos(currentUser.id) || [];
      setTodosToday(
        allTodos
          .filter((todo) => todo.date === todayDateString)
          .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
      );
      setTodosTomorrow(
        allTodos
          .filter((todo) => todo.date === tomorrowDateString)
          .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
      );
    }
  }, []);

  const handleProfileClick = () => {
    navigate("/mypage");
  };

  const handleCalendarClick = () => {
    navigate("/calendar");
  };

  const handleFriendCalendarClick = (friendId) => {
    navigate(`/calendar/${friendId}`);
  };

  const toggleTodoCompletion = (id, dateString) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const targetList = dateString === todayDateString ? todosToday : todosTomorrow;
    const updatedTodos = targetList.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );

    const updated = updatedTodos.find((t) => t.id === id);
    if (updated) {
      updateTodo(currentUser.id, { ...updated, date: dateString });
    }

    if (dateString === todayDateString) {
      setTodosToday(
        updatedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
      );
    } else {
      setTodosTomorrow(
        updatedTodos.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
      );
    }
  };

  const deleteTodoItem = (id, dateString) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (dateString === todayDateString) {
      setTodosToday((prev) => prev.filter((todo) => todo.id !== id));
    } else {
      setTodosTomorrow((prev) => prev.filter((todo) => todo.id !== id));
    }
    deleteTodo(currentUser.id, id);
    setSwipedTodoId(null);
  };

  const handleAddTodo = (dateString) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인된 사용자 정보가 없습니다.");
      return;
    }

    let subject = "";
    let note = "";
    if (dateString === todayDateString) {
      subject = newTodoSubjectToday;
      note = newTodoNoteToday;
    } else {
      subject = newTodoSubjectTomorrow;
      note = newTodoNoteTomorrow;
    }

    if (!subject.trim() || !note.trim()) {
      alert("과목과 내용을 입력해주세요.");
      return;
    }

    const newTodo = addTodo(currentUser.id, {
      subject,
      note,
      done: false,
      date: dateString,
    });

    if (newTodo) {
      if (dateString === todayDateString) {
        setTodosToday((prev) =>
          [...prev, newTodo].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
        );
        setNewTodoSubjectToday("");
        setNewTodoNoteToday("");
        setShowAddInputToday(false);
      } else {
        setTodosTomorrow((prev) =>
          [...prev, newTodo].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
        );
        setNewTodoSubjectTomorrow("");
        setNewTodoNoteTomorrow("");
        setShowAddInputTomorrow(false);
      }
    }
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (id) => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setSwipedTodoId(id);
    else if (distance < -50) setSwipedTodoId(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (touchStart !== null) setTouchEnd(e.clientX);
  };

  const handleMouseUp = (id) => {
    if (touchStart == null || touchEnd == null) {
      setTouchStart(null);
      return;
    }
    const distance = touchStart - touchEnd;
    if (distance > 50) setSwipedTodoId(id);
    else if (distance < -50) setSwipedTodoId(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const navItems = [
    { icon: CalendarIcon, label: "캘린더", path: "/todolist" },
    { icon: ClockIcon, label: "공부시간", path: "/studytime" },
    { icon: HomeIcon, label: "홈", path: "/home" },
    { icon: PieChartIcon, label: "정보", path: "/info" },
    { icon: MessageCircleIcon, label: "AI 버디", path: "/aibuddy" },
  ];

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
      <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        {/* 헤더 */}
        <header className="w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a] flex-shrink-0">
          <nav className="h-12 w-full bg-[#f8f9ff] flex items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
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

        {/* 본문 */}
        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[25px] pb-[25px] flex flex-col gap-[20px]">
          {/* 팔로잉 친구들 프로필 */}
          <section className="flex overflow-x-auto scrollbar-hide gap-3 pb-2">
            {following.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleFriendCalendarClick(friend.id)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={friend.avatar} alt={friend.name} />
                </Avatar>
                <span className="text-[10px] text-[#232323] [font-family:'Noto_Sans_KR',Helvetica] mt-1">
                  {friend.name}
                </span>
              </button>
            ))}
          </section>

          {/* 캘린더 바로가기 카드 */}
          <Card
            className="bg-[#e7edff] rounded-[10px] border-0 p-4 flex items-center justify-between cursor-pointer hover:bg-[#d0dcff] transition-colors"
            onClick={handleCalendarClick}
          >
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-[#628af9]" />
              <span className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
                캘린더 바로가기!
              </span>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-[#232323] rotate-180" />
          </Card>

          {/* 오늘 섹션 */}
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
              오늘{" "}
              <span className="font-normal text-[10px] text-[#23232380]">
                {formatTime(todayDate)}
              </span>
            </h2>

            <div className="flex flex-col gap-2">
              {todosToday.map((todo) => (
                <div key={todo.id} className="relative w-full h-[50px] overflow-hidden rounded-[10px]">
                  <button
                    onClick={() => deleteTodoItem(todo.id, todayDateString)}
                    className="absolute right-0 top-0 h-full w-[80px] bg-[#ff6b6b] flex items-center justify-center"
                  >
                    <TrashIcon className="w-5 h-5 text-white" />
                  </button>

                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(todo.id)}
                    onMouseDown={handleMouseDown}
                    onMouseUp={() => handleMouseUp(todo.id)}
                    onMouseLeave={() => setSwipedTodoId(null)}
                    className={`w-full h-[50px] rounded-[10px] px-[25px] flex items-center justify-between transition-transform duration-300 cursor-pointer relative ${
                      todo.done ? "bg-[#a8c5f7]" : "bg-[#628af9]"
                    }`}
                    style={{
                      transform:
                        swipedTodoId === todo.id ? "translateX(-80px)" : "translateX(0)",
                    }}
                  >
                    <button
                      onClick={() => toggleTodoCompletion(todo.id, todayDateString)}
                      className="flex-1 flex items-center justify-between h-full"
                    >
                      <div className="text-left">
                        <h3 className="font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] text-[#f8f9ff]">
                          {todo.subject}
                        </h3>
                        <p className="mt-[2px] font-normal text-[10px] [font-family:'Noto_Sans_KR',Helvetica] text-[#f8f9ff]">
                          {todo.note}
                        </p>
                      </div>

                      {todo.done ? (
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

              {showAddInputToday ? (
                <div className="w-full bg-[#23232326] rounded-[10px] p-[10px] flex flex-col gap-2">
                  <Input
                    placeholder="과목"
                    value={newTodoSubjectToday}
                    onChange={(e) => setNewTodoSubjectToday(e.target.value)}
                    className="h-[30px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                  />
                  <Input
                    placeholder="할 일 내용"
                    value={newTodoNoteToday}
                    onChange={(e) => setNewTodoNoteToday(e.target.value)}
                    className="h-[30px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddTodo(todayDateString)}
                      className="flex-1 h-[25px] bg-[#628af9] text-[#f8f9ff] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] hover:bg-[#5279e0]"
                    >
                      추가
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddInputToday(false);
                        setNewTodoSubjectToday("");
                        setNewTodoNoteToday("");
                      }}
                      className="flex-1 h-[25px] bg-[#23232399] text-[#f8f9ff] text-[10px] [font-family:'Noto_Sанс_KR',Helvetica] hover:bg-[#232323]"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAddInputToday(true)}
                  className="w-full h-[35px] bg-[#23232326] rounded-[10px] px-[18px] flex items-center text-left text-[#232323b2] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-normal"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  할 일을 추가해주세요
                </Button>
              )}
            </div>
          </section>

          {/* 내일 섹션 */}
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-[#232323] text-sm [font-family:'Noto_Sans_KR',Helvetica]">
              내일{" "}
              <span className="font-normal text-[10px] text-[#23232380]">
                {formatTime(tomorrowDate)}
              </span>
            </h2>

            <div className="flex flex-col gap-2">
              {todosTomorrow.map((todo) => (
                <div key={todo.id} className="relative w-full h-[50px] overflow-hidden rounded-[10px]">
                  <button
                    onClick={() => deleteTodoItem(todo.id, tomorrowDateString)}
                    className="absolute right-0 top-0 h-full w-[80px] bg-[#ff6b6b] flex items-center justify-center"
                  >
                    <TrashIcon className="w-5 h-5 text-white" />
                  </button>

                  <div
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(todo.id)}
                    onMouseDown={handleMouseDown}
                    onMouseUp={() => handleMouseUp(todo.id)}
                    onMouseLeave={() => setSwipedTodoId(null)}
                    className={`w-full h-[50px] rounded-[10px] px-[25px] flex items-center justify-between transition-transform duration-300 cursor-pointer relative ${
                      todo.done ? "bg-[#a8c5f7]" : "bg-[#628af9]"
                    }`}
                    style={{
                      transform:
                        swipedTodoId === todo.id ? "translateX(-80px)" : "translateX(0)",
                    }}
                  >
                    <button
                      onClick={() => toggleTodoCompletion(todo.id, tomorrowDateString)}
                      className="flex-1 flex items-center justify-between h-full"
                    >
                      <div className="text-left">
                        <h3 className="font-bold text-xs [font-family:'Noto_Sans_KR',Helvetica] text-[#f8f9ff]">
                          {todo.subject}
                        </h3>
                        <p className="mt-[2px] font-normal text-[10px] [font-family:'Noto_Sans_KR',Helvetica] text-[#f8f9ff]">
                          {todo.note}
                        </p>
                      </div>

                      {todo.done ? (
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

              {showAddInputTomorrow ? (
                <div className="w-full bg-[#23232326] rounded-[10px] p-[10px] flex flex-col gap-2">
                  <Input
                    placeholder="과목"
                    value={newTodoSubjectTomorrow}
                    onChange={(e) => setNewTodoSubjectTomorrow(e.target.value)}
                    className="h-[30px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                  />
                  <Input
                    placeholder="할 일 내용"
                    value={newTodoNoteTomorrow}
                    onChange={(e) => setNewTodoNoteTomorrow(e.target.value)}
                    className="h-[30px] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] border-[#628af9]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddTodo(tomorrowDateString)}
                      className="flex-1 h-[25px] bg-[#628af9] text-[#f8f9ff] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] hover:bg-[#5279e0]"
                    >
                      추가
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddInputTomorrow(false);
                        setNewTodoSubjectTomorrow("");
                        setNewTodoNoteTomorrow("");
                      }}
                      className="flex-1 h-[25px] bg-[#23232399] text-[#f8f9ff] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] hover:bg-[#232323]"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAddInputTomorrow(true)}
                  className="w-full h-[35px] bg-[#23232326] rounded-[10px] px-[18px] flex items-center text-left text-[#232323b2] text-[10px] [font-family:'Noto_Sans_KR',Helvetica] font-normal"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  할 일을 추가해주세요
                </Button>
              )}
            </div>
          </section>
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
};

