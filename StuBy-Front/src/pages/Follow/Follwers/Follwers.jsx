import { ChevronLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";

const initialUsers = [
  {
    id: 1,
    avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-10-1.png",
    username: "유저이름1",
    school: "고등학교 이름, 3학년",
    followsMe: "나를 팔로우 합니다",
  },
  {
    id: 2,
    avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-11-1.png",
    username: "유저이름2",
    school: "고등학교 이름, 3학년",
    followsMe: "나를 팔로우 합니다",
  },
  {
    id: 3,
    avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-12-1.png",
    username: "유저이름3",
    school: "고등학교 이름, 3학년",
    followsMe: "나를 팔로우 합니다",
  },
  {
    id: 4,
    avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-13-1.png",
    username: "유저이름4",
    school: "고등학교 이름, 3학년",
    followsMe: "나를 팔로우 합니다",
  },
  {
    id: 5,
    avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-14-1.png",
    username: "유저이름5",
    school: "고등학교 이름, 3학년",
    followsMe: "나를 팔로우 합니다",
  },
];

export const Followers = (): JSX.Element => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [unfollowedUsers, setUnfollowedUsers] = useState<number[]>([]);

  const handleBackClick = () => {
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469");
  };

  const toggleFollow = (userId: number) => {
    setUnfollowedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  return (
    <div
      className="bg-[#000] w-full min-h-screen flex items-center justify-center"
      data-model-id="38:600"
    >
      <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="w-full h-[76px] bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a] flex items-end flex-shrink-0 translate-y-[-1rem] animate-fade-in opacity-0">
          <nav className="h-12 w-full bg-[#f8f9ff] flex items-center justify-center relative px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="absolute left-6 w-6 h-6 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#000000] hover:text-[#628af9] transition-colors" />
            </Button>

            <div className="w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[35px] pb-[35px]">
          <ul className="flex flex-col gap-[15px]">
            {users.map((user, index) => (
              <li
                key={user.id}
                className="flex items-start gap-[15px] translate-y-[-1rem] animate-fade-in opacity-0"
                style={
                  {
                    "--animation-delay": `${(index + 1) * 100}ms`,
                  } as React.CSSProperties
                }
              >
                <Avatar className="w-[60px] h-[60px] flex-shrink-0">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.username}
                    className="object-cover"
                  />
                </Avatar>

                <div className="flex-1 flex flex-col gap-1 pt-[5px]">
                  <div className="flex items-start gap-2">
                    <h3 className="font-bold text-[#000000] text-[13px] [font-family:'Inter',Helvetica] tracking-[0] leading-[normal]">
                      {user.username}
                    </h3>
                    <span className="font-normal text-[#23232366] text-[8px] [font-family:'Inter',Helvetica] tracking-[0] leading-[normal]">
                      {user.followsMe}
                    </span>
                  </div>
                  <p className="font-normal text-[#000000] text-[10px] whitespace-nowrap [font-family:'Inter',Helvetica] tracking-[0] leading-[normal]">
                    {user.school}
                  </p>
                </div>

                <Button 
                  onClick={() => toggleFollow(user.id)}
                  className={`rounded-[49px] h-[25px] px-[26px] text-[10px] font-normal [font-family:'Inter',Helvetica] tracking-[0] leading-[normal] transition-colors flex-shrink-0 ${
                    unfollowedUsers.includes(user.id)
                      ? "bg-white border-2 border-[#628af9] text-[#628af9] hover:bg-[#f8f9ff]"
                      : "bg-[#628af9] hover:bg-[#5279e8] text-[#f8f9ff]"
                  }`}
                >
                  {unfollowedUsers.includes(user.id) ? "팔로우" : "팔로잉"}
                </Button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
};
