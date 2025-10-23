// src/routers/UserRouter.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout/MainLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import MyPage from "../pages/MyPage/MyPage.jsx";
import MyPageModify from "../pages/MyPage/MyPageModify.jsx";
import Following from "../pages/Follow/Following/Following.jsx";
import Followers from "../pages/Follow/Followers/Followers.jsx";
import GradeInput from "../pages/Grade/GradeInput.jsx";
import GradeView from "../pages/Grade/GradeView.jsx";
import StudyTime from "../pages/StudyTime/StudyTime.jsx";
import Ranking from "../pages/StudyTime/Ranking.jsx";
import TodoList from "../pages/TodoList/TodoList.jsx";
import Calendar from "../pages/TodoList/Calendar.jsx";
import UniversityInfo from "../pages/UniversityInfo/UniversityInfo.jsx";


const NotFound = () => <div style={{ padding: 24 }}>페이지를 찾을 수 없어요 😢</div>;

export default function UserRouter() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        <Route path="mypage" element={<MyPage />} />
        <Route path="mypage/edit" element={<MyPageModify />} />

        <Route path="following" element={<Following />} />
        <Route path="followers" element={<Followers />} />

        <Route path="grade/input" element={<GradeInput />} />
        <Route path="grade/view" element={<GradeView />} />

        <Route path="studytime" element={<StudyTime />} />
        <Route path="studytime/ranking" element={<Ranking />} />

        <Route path="todolist" element={<TodoList />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/:friendId" element={<Calendar />} />

        <Route path="info" element={<UniversityInfo />} />

        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </MainLayout>
  );
}
