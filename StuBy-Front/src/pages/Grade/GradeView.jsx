import { ChevronLeftIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { getCurrentUser, getMockGrades, getSchoolGrades } from "../../db";

type ExamType = "mock" | "school";

interface MockExamData {
  userId: number;
  month: string;
  korean1: number;
  korean2: number;
  english: number;
  math1: number;
  math2: number;
  elective1: number;
  elective2: number;
  history: number;
  total: number;
}

interface SchoolExamData {
  userId: number;
  semester: string;
  korean: number;
  english: number;
  math: number;
  customSubjects: { name: string; score: number }[];
  total: number;
}

export const GradeView = (): JSX.Element => {
  const navigate = useNavigate();
  const [examType, setExamType] = useState<ExamType>("mock");
  const [mockExams, setMockExams] = useState<MockExamData[]>([]);
  const [schoolExams, setSchoolExams] = useState<SchoolExamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setMockExams(getMockGrades(currentUser.id));
      setSchoolExams(getSchoolGrades(currentUser.id));
    }
    setLoading(false);
  }, []);

  const handleBackClick = () => {
    navigate("/u4358u4449u4363u4469u4369u4454u4363u4469u4364u4469");
  };

  if (loading) {
    return (
      <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
        <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col items-center justify-center">
          <p className="text-[#232323] [font-family:'Noto_Sans_KR',Helvetica]">성적 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000] w-full min-h-screen flex items-center justify-center">
      <div className="h-screen w-[480px] relative bg-[#f8f9ff] flex flex-col">
        <header className="w-[480px] h-[76px] flex items-end bg-[#f8f9ff] shadow-[0px_2px_2px_#2323231a] flex-shrink-0">
          <nav className="h-12 w-full bg-[#f8f9ff] flex items-center justify-center relative px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="absolute left-6 w-6 h-6 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#232323] hover:text-[#628af9] transition-colors" />
            </Button>

            <div className="w-[92px] h-[38px] bg-[url(https://c.animaapp.com/mghllw7nnesCnv/img/logo-1-8.png)] bg-cover bg-[50%_50%]" />
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[25px] pb-[25px]">
          <h1 className="font-bold text-[#232323] text-lg [font-family:'Noto_Sans_KR',Helvetica] tracking-[0] leading-[normal] mb-5">
            내 모든 성적 보기
          </h1>

          <div className="flex gap-2 mb-5">
            <Button
              onClick={() => setExamType("mock")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                examType === "mock"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              모의고사
            </Button>
            <Button
              onClick={() => setExamType("school")}
              className={`flex-1 h-[45px] rounded-[15px] border-2 text-xs [font-family:'Noto_Sans_KR',Helvetica] font-medium transition-colors ${
                examType === "school"
                  ? "bg-[#628af9] border-[#628af9] text-[#f8f9ff] hover:bg-[#5279e0]"
                  : "bg-white border-[#628af9] text-[#628af9] hover:bg-[#f0f4ff]"
              }`}
            >
              학교시험
            </Button>
          </div>

          {examType === "mock" ? (
            <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] [font-family:'Noto_Sans_KR',Helvetica]">
                    <thead>
                      <tr className="border-b-2 border-[#628af9]">
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">월</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">국어1</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">국어2</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">영어</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">수학1</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">수학2</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">선택1</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">선택2</th>
                        <th className="py-2 px-1 text-center font-bold text-[#232323]">한국사</th>
                        <th className="py-2 px-1 text-center font-bold text-[#628af9]">총점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockExams.map((exam, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#e7edff] hover:bg-[#f8f9ff] transition-colors"
                        >
                          <td className="py-2 px-1 text-center font-medium text-[#628af9]">
                            {exam.month}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.korean1}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.korean2}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.english}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.math1}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.math2}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.elective1}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.elective2}
                          </td>
                          <td className="py-2 px-1 text-center text-[#232323]">
                            {exam.history}
                          </td>
                          <td className="py-2 px-1 text-center font-bold text-[#628af9]">
                            {exam.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-[#e7edff] rounded-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-[#232323] [font-family:'Noto_Sans_KR',Helvetica]">
                      평균 점수
                    </span>
                    <span className="text-sm font-bold text-[#628af9] [font-family:'Noto_Sans_KR',Helvetica]">
                      {mockExams.length > 0
                        ? Math.round(
                            mockExams.reduce((sum, exam) => sum + exam.total, 0) /
                              mockExams.length
                          )
                        : 0}
                      점
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white rounded-[10px] border-2 border-[#628af9]">
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] [font-family:'Noto_Sans_KR',Helvetica]">
                    <thead>
                      <tr className="border-b-2 border-[#628af9]">
                        <th className="py-2 px-2 text-center font-bold text-[#232323]">학기</th>
                        <th className="py-2 px-2 text-center font-bold text-[#232323]">국어</th>
                        <th className="py-2 px-2 text-center font-bold text-[#232323]">영어</th>
                        <th className="py-2 px-2 text-center font-bold text-[#232323]">수학</th>
                        <th className="py-2 px-2 text-center font-bold text-[#232323]">기타 과목</th>
                        <th className="py-2 px-2 text-center font-bold text-[#628af9]">총점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolExams.map((exam, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#e7edff] hover:bg-[#f8f9ff] transition-colors"
                        >
                          <td className="py-2 px-2 text-center font-medium text-[#628af9]">
                            {exam.semester}
                          </td>
                          <td className="py-2 px-2 text-center text-[#232323]">
                            {exam.korean}
                          </td>
                          <td className="py-2 px-2 text-center text-[#232323]">
                            {exam.english}
                          </td>
                          <td className="py-2 px-2 text-center text-[#232323]">
                            {exam.math}
                          </td>
                          <td className="py-2 px-2 text-center text-[#232323]">
                            {exam.customSubjects.map(s => `${s.name}: ${s.score}`).join(", ")}
                          </td>
                          <td className="py-2 px-2 text-center font-bold text-[#628af9]">
                            {exam.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-[#e7edff] rounded-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-[#232323] [font-family:'Noto_Sans_KR',Helvetica]">
                      평균 점수
                    </span>
                    <span className="text-sm font-bold text-[#628af9] [font-family:'Noto_Sans_KR',Helvetica]">
                      {schoolExams.length > 0
                        ? Math.round(
                            schoolExams.reduce((sum, exam) => sum + exam.total, 0) /
                              schoolExams.length
                          )
                        : 0}
                      점
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};
