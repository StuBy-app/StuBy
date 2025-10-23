import {
  ChevronLeft as ChevronLeftIcon,
  Send as SendIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Home as HomeIcon,
  PieChart as PieChartIcon,
  MessageCircle as MessageCircleIcon,
  Plus as PlusIcon,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Avatar, AvatarImage } from "../../components/avatar";
import {
  getCurrentUser,
  getAIBuddyChatData,
  addAIBuddyMessage,
  findUniversityByText,
  getUniversityAdmissions,
  getSuneungDate,
  getMockExamByMonth,
  getLatestMockGrade,
  evaluateAdmissionForUniversity,
  evaluateAdmissionAll,
  getLatestSchoolGrade,
} from "../../db";

const navItems = [
  { icon: CalendarIcon, label: "캘린더", path: "/todolist" },
  { icon: ClockIcon, label: "공부시간", path: "/studytime" },
  { icon: HomeIcon, label: "홈", path: "/home" },
  { icon: PieChartIcon, label: "정보", path: "/info" },
  { icon: MessageCircleIcon, label: "AI 버디", path: "/aibuddy" },
];

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const now = new Date();
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target - new Date(now.toDateString())) / (1000 * 60 * 60 * 24));
};

// 딱딱하지 않게 붙이는 꼬리 멘트
const friendlyTail = "\n\n또 궁금한게 있나요?";

// ========= 자연어 → 응답 생성 =========
const generateAIResponse = (rawText, userId) => {
  const text = String(rawText || "").trim();
  if (!text) return null;

  // 종료 인사
  if (/(고마워|고맙|감사|땡큐|thanks?|thx|수고)/i.test(text)) {
    return "고맙긴요! 다음에 또 궁금한게 있다면 버디를 찾아와주세요!";
  }

  // 인사
  if (/(^|\s)(안녕|안녕하세요|하이|hello|hi)(\s|$)/i.test(text)) {
    return "안녕하세요! AI 챗봇 버디입니다. 무엇을 도와드릴까요?";
  }

  // 대학명 추출(축약형 ‘서울대’ 처리 포함)
  const uni =
    findUniversityByText(text) ||
    (text.includes("서울대") ? findUniversityByText("서울대학교") : null);

  // ===== A) 공부 방향/약점 보완 요청 =====
  if (/(어떤\s*공부|무엇을\s*더|보완|약한\s*과목|약점|약해)/i.test(text)) {
    // 로컬 헬퍼: 평균 계산 & 약점 추출
    const avgFromMock = (g) => ({
      kor: (g.korean1 + g.korean2) / 2,
      math: (g.math1 + g.math2) / 2,
      eng: g.english,
      elective: (g.elective1 + g.elective2) / 2,
      hist: g.history,
    });
    const avgFromSchool = (g) => ({
      kor: g.korean,
      math: g.math,
      eng: g.english,
      elective:
        Array.isArray(g.customSubjects) && g.customSubjects.length
          ? g.customSubjects.reduce((s, x) => s + (x.score || 0), 0) /
            g.customSubjects.length
          : 0,
      hist: 0, // 학교 성적에 한국사 없을 수 있음
    });
    const weakTips = (avg, thr = 85) => {
      const tips = [];
      if (avg.kor < thr) tips.push("국어(독서·문학) 안정화");
      if (avg.math < thr) tips.push("수학(개념·고난도) 보완");
      if (avg.eng < thr) tips.push("영어(어휘·독해) 강화");
      if (avg.elective < thr) tips.push("탐구(개념+기출 반복)");
      if (avg.hist !== undefined && avg.hist < thr) tips.push("한국사 기출 누적");
      return tips;
    };

    const gMock = getLatestMockGrade(userId);
    const gSchool = getLatestSchoolGrade(userId);

    if (!gMock && !gSchool) {
      return "먼저 점수를 입력해 주세요! (모의고사 또는 학교 성적) 입력 후 다시 물어보면 약점 분석과 공부 방향을 알려드릴게요.";
    }

    const avg = gMock ? avgFromMock(gMock) : avgFromSchool(gSchool);
    const tips = weakTips(avg);

    if (!tips.length) {
      return `전반적으로 밸런스가 좋아요. 지금 페이스 유지가 핵심입니다! 기출 회독 주기를 짧게 가져가면 더 좋아요.${friendlyTail}`;
    }
    return `현재 보완이 필요한 영역: ${tips.join(", ")}\n- TIP: 약점 과목은 '개념 → 유형 → 기출' 순으로 1~2주 스프린트로 잡아보세요.${friendlyTail}`;
  }

  // ===== B) (모의/모평/학평) 성적으로 ○○대 가능? =====
  if (/(모의|모평|학력평가|학평).*(가능|갈\s*수|붙을|지원|될까|될까요)/i.test(text)) {
    const latest = getLatestMockGrade(userId);
    if (!latest) return "모의고사 점수를 먼저 입력해 주세요.";

    if (uni) {
      const r = evaluateAdmissionForUniversity(userId, uni.id, "mock");
      if (!r) return `${uni.name} 분석을 할 수 없었어요.${friendlyTail}`;
      const gapText = r.gap >= 0 ? `컷보다 +${r.gap}` : `컷보다 ${r.gap}`;
      const tipText =
        r.weakTips.length ? `보완 추천: ${r.weakTips.join(", ")}` : "과목 밸런스가 좋아요. 지금 페이스 유지!";
      return `${uni.name} (모의 기준) 합격 가능성: **${r.chance}** (${gapText})\n내 총점: ${r.userTotal} / 컷: ${r.cutoff}\n${tipText}${friendlyTail}`;
    }

    const top = evaluateAdmissionAll(userId, "mock").slice(0, 3);
    if (!top.length) return `분석 결과가 없어요.${friendlyTail}`;
    const lines = top.map(
      (x, i) =>
        `${i + 1}. ${x.universityName} — ${x.chance} (총점 ${x.userTotal}, 컷 ${x.cutoff}, gap ${
          x.gap >= 0 ? "+" + x.gap : x.gap
        })`
    );
    const tip = top[0].weakTips.length ? `\n추천 보완: ${top[0].weakTips.join(", ")}` : "";
    return `모의고사 기준 추천 대학 TOP3\n${lines.join("\n")}${friendlyTail}${tip}`;
  }

  // ===== C) (학교/내신/교과) 성적으로 ○○대 가능? =====
  if (/(학교|내신|교과).*(가능|갈\s*수|붙을|지원|될까|될까요)/i.test(text)) {
    const latest = getLatestSchoolGrade(userId);
    if (!latest) return "학교 성적(내신)을 먼저 입력해 주세요.";

    if (uni) {
      const r = evaluateAdmissionForUniversity(userId, uni.id, "school");
      if (!r) return `${uni.name} 분석을 할 수 없었어요.${friendlyTail}`;
      const gapText = r.gap >= 0 ? `컷보다 +${r.gap}` : `컷보다 ${r.gap}`;
      const tipText =
        r.weakTips.length ? `보완 추천: ${r.weakTips.join(", ")}` : "과목 밸런스가 좋아요. 지금 페이스 유지!";
      return `${uni.name} (학교 성적 기준) 합격 가능성: **${r.chance}** (${gapText})\n내 총점: ${r.userTotal} / 컷: ${r.cutoff}\n${tipText}${friendlyTail}`;
    }

    const top = evaluateAdmissionAll(userId, "school").slice(0, 3);
    if (!top.length) return `분석 결과가 없어요.${friendlyTail}`;
    const lines = top.map(
      (x, i) =>
        `${i + 1}. ${x.universityName} — ${x.chance} (총점 ${x.userTotal}, 컷 ${x.cutoff}, gap ${
          x.gap >= 0 ? "+" + x.gap : x.gap
        })`
    );
    const tip = top[0].weakTips.length ? `\n추천 보완: ${top[0].weakTips.join(", ")}` : "";
    return `학교 성적 기준 추천 대학 TOP3\n${lines.join("\n")}${friendlyTail}${tip}`;
  }

  // ===== ① 경쟁률 =====
  if (/(경쟁률|합격률)/i.test(text) && uni) {
    const ad = getUniversityAdmissions(uni.id);
    if (ad) {
      const early = ad.early?.competitionRate ?? "정보 없음";
      const regular = ad.regular?.competitionRate ?? "정보 없음";
      return `${uni.name} 경쟁률 안내입니다.\n- 수시: ${early} : 1\n- 정시: ${regular} : 1${friendlyTail}`;
    }
    return `${uni.name} 경쟁률 정보를 찾지 못했어요.${friendlyTail}`;
  }

  // ===== ② 원서/접수/일정 =====
  if (/(원서|접수|기간|모집요강|언제|일정)/i.test(text) && uni) {
    const ad = getUniversityAdmissions(uni.id);
    if (ad) {
      const e = ad.early?.applicationPeriod;
      const r = ad.regular?.applicationPeriod;
      const eLine = e ? `수시 접수: ${e.start} ~ ${e.end}` : "수시 접수: 정보 없음";
      const rLine = r ? `정시 접수: ${r.start} ~ ${r.end}` : "정시 접수: 정보 없음";
      return `${uni.name} 전형 일정입니다.\n${eLine}\n${rLine}${friendlyTail}`;
    }
    return `${uni.name} 전형 일정을 찾지 못했어요.${friendlyTail}`;
  }

  // ===== ③ 수능 D-day =====
  if (/(수능|d-?day)/i.test(text)) {
    const dd = daysUntil(getSuneungDate());
    if (dd == null) return `수능 날짜 정보를 찾지 못했어요.${friendlyTail}`;
    if (dd > 0) return `수능까지 D-${dd}일입니다. 응원해요!${friendlyTail}`;
    if (dd === 0) return `오늘이 수능일입니다. 침착하게 최선을 다해요!${friendlyTail}`;
    return `수능일이 지났습니다. 고생 많았어요.${friendlyTail}`;
  }

  // ===== ④ 모의고사(월) =====
  const monthMatch = text.match(/(\d+)\s*월/);
  if (/(모의|학력평가|모평)/.test(text) && monthMatch) {
    const mm = Number(monthMatch[1]);
    const exam = getMockExamByMonth(mm);
    if (exam) return `${mm}월 모의고사 일정: ${exam.name} — ${exam.date}${friendlyTail}`;
    return `${mm}월 모의고사 일정을 찾지 못했어요.${friendlyTail}`;
  }

  // ===== ⑤ (일반) 합격 가능성/지원 가능? (기본: 모의 기준) =====
  if (/(가능성|갈\s*수|붙을|지원|가능\?|될까|될까요)/i.test(text)) {
    const latest = getLatestMockGrade(userId);
    if (!latest) {
      return "먼저 모의고사 점수를 입력해 주세요! (예: 국어/수학/영어/탐구/한국사 및 총점) 입력 후 다시 물어보면 분석해 드릴게요.";
    }

    // 특정 대학
    if (uni) {
      const r = evaluateAdmissionForUniversity(userId, uni.id, "mock");
      if (!r) return `${uni.name} 분석을 할 수 없었어요.${friendlyTail}`;

      const gapText = r.gap >= 0 ? `컷보다 +${r.gap}` : `컷보다 ${r.gap}`;
      const tipText =
        r.weakTips.length > 0
          ? `보완 추천: ${r.weakTips.join(", ")}`
          : "과목 밸런스가 좋아요. 지금 페이스 유지!";
      return `${uni.name} 합격 가능성: **${r.chance}** (${gapText})\n내 총점: ${r.userTotal} / 컷: ${r.cutoff}\n${tipText}${friendlyTail}`;
    }

    // ===== A0) 특정 '대학 목표' 학습 전략 =====
//  - 예: "서울대를 가기 위해서 어느 부분을 공부해야 할까?"
//  - 키워드: 공부해야/집중해야/보완/보강/강화/준비/어느 부분/무엇을 공부
if (
  uni &&
  /(공부해야|집중해야|보완|보강|강화|준비해야|준비|어느\s*부분|무엇을\s*공부)/i.test(text)
) {
  // 로컬 헬퍼: 평균 계산 & 약점 추출
  const avgFromMock = (g) => ({
    kor: (g.korean1 + g.korean2) / 2,
    math: (g.math1 + g.math2) / 2,
    eng: g.english,
    elective: (g.elective1 + g.elective2) / 2,
    hist: g.history,
  });
  const avgFromSchool = (g) => ({
    kor: g.korean,
    math: g.math,
    eng: g.english,
    elective:
      Array.isArray(g.customSubjects) && g.customSubjects.length
        ? g.customSubjects.reduce((s, x) => s + (x.score || 0), 0) /
          g.customSubjects.length
        : 0,
    hist: 0, // 학교 성적엔 한국사 없을 수 있음
  });
  const weakTips = (avg, thr = 85) => {
    const tips = [];
    if (avg.kor < thr) tips.push("국어(독서·문학) 안정화");
    if (avg.math < thr) tips.push("수학(개념·고난도) 보완");
    if (avg.eng < thr) tips.push("영어(어휘·독해) 강화");
    if (avg.elective < thr) tips.push("탐구(개념+기출 반복)");
    if (avg.hist !== undefined && avg.hist < thr) tips.push("한국사 기출 누적");
    return tips;
  };

  // 최신 성적: 모의고사 우선, 없으면 학교 성적
  const gMock = getLatestMockGrade(userId);
  const gSchool = getLatestSchoolGrade(userId);

  if (!gMock && !gSchool) {
    return "먼저 점수를 입력해 주세요! (모의고사 또는 학교 성적) 입력 후 다시 물어보면 목표 대학 기준으로 학습 전략을 알려드릴게요 🙂";
  }

  const source = gMock ? "mock" : "school";
  const sourceLabel = gMock ? "모의고사" : "학교 성적";
  const avg = gMock ? avgFromMock(gMock) : avgFromSchool(gSchool);
  const tips = weakTips(avg);

  // 합격 가능성(컷 대비)도 함께 안내
  const evalRes = evaluateAdmissionForUniversity(userId, uni.id, source);
  const gapText = evalRes
    ? evalRes.gap >= 0
      ? `컷보다 +${evalRes.gap}`
      : `컷보다 ${evalRes.gap}`
    : null;

  // 약한 구간 요약
  const summary = [
    avg.kor < 85 ? `국어≈${Math.round(avg.kor)}` : null,
    avg.math < 85 ? `수학≈${Math.round(avg.math)}` : null,
    avg.eng < 85 ? `영어≈${Math.round(avg.eng)}` : null,
    avg.elective < 85 ? `탐구≈${Math.round(avg.elective)}` : null,
    avg.hist !== undefined && avg.hist < 85 ? `한국사≈${Math.round(avg.hist)}` : null,
  ].filter(Boolean);

  const head =
    summary.length > 0 ? `약한 구간: ${summary.join(", ")}` : "약점이 크게 보이지 않아요";

  const tipLine =
    tips.length > 0
      ? `보완 추천: ${tips.join(", ")}`
      : "과목 밸런스가 좋아요. 지금 페이스 유지!";

  const evalLine = evalRes
    ? `\n(${sourceLabel} 기준) 내 총점 ${evalRes.userTotal} / 컷 ${evalRes.cutoff} → **${evalRes.chance}**, ${gapText}`
    : "";

  return `${uni.name} 목표 학습 전략입니다.\n${head}\n${tipLine}${evalLine}${friendlyTail}`;
}

    // ===== A) 공부 방향/약점 보완 요청 =====
//  ⬇⬇⬇ 정규식에 '부족/취약/낮은/떨어지' 추가
if (/(어떤\s*공부|무엇을\s*더|보완|약한\s*과목|약점|약해|부족|취약|낮은|떨어지|성적에서\s*(무엇이|어디가)?\s*(부족|약한|취약))/i.test(text)) {
  // 로컬 헬퍼: 평균 계산 & 약점 추출
  const avgFromMock = (g) => ({
    kor: (g.korean1 + g.korean2) / 2,
    math: (g.math1 + g.math2) / 2,
    eng: g.english,
    elective: (g.elective1 + g.elective2) / 2,
    hist: g.history,
  });
  const avgFromSchool = (g) => ({
    kor: g.korean,
    math: g.math,
    eng: g.english,
    elective:
      Array.isArray(g.customSubjects) && g.customSubjects.length
        ? g.customSubjects.reduce((s, x) => s + (x.score || 0), 0) /
          g.customSubjects.length
        : 0,
    hist: 0, // 학교 성적엔 한국사 없을 수 있음
  });
  const weakTips = (avg, thr = 85) => {
    const tips = [];
    if (avg.kor < thr) tips.push("국어(독서·문학) 안정화");
    if (avg.math < thr) tips.push("수학(개념·고난도) 보완");
    if (avg.eng < thr) tips.push("영어(어휘·독해) 강화");
    if (avg.elective < thr) tips.push("탐구(개념+기출 반복)");
    if (avg.hist !== undefined && avg.hist < thr) tips.push("한국사 기출 누적");
    return tips;
  };

  // 최신 성적: 모의고사 우선, 없으면 학교 성적 사용
  const gMock = getLatestMockGrade(userId);
  const gSchool = getLatestSchoolGrade(userId);

  if (!gMock && !gSchool) {
    return "먼저 점수를 입력해 주세요! (모의고사 또는 학교 성적) 입력 후 다시 물어보면 약점 분석과 공부 방향을 알려드릴게요.";
  }

  const avg = gMock ? avgFromMock(gMock) : avgFromSchool(gSchool);
  const tips = weakTips(avg);

  if (!tips.length) {
    return `전반적으로 밸런스가 좋아요. 지금 페이스 유지가 핵심입니다! 기출 회독 주기를 짧게 가져가면 더 좋아요.${friendlyTail}`;
  }

  // 요약 문구도 같이 보여주기
  const summary = [
    avg.kor < 85 ? `국어≈${Math.round(avg.kor)}` : null,
    avg.math < 85 ? `수학≈${Math.round(avg.math)}` : null,
    avg.eng < 85 ? `영어≈${Math.round(avg.eng)}` : null,
    avg.elective < 85 ? `탐구≈${Math.round(avg.elective)}` : null,
    avg.hist !== undefined && avg.hist < 85 ? `한국사≈${Math.round(avg.hist)}` : null,
  ].filter(Boolean);

  const headline = summary.length ? `약한 구간: ${summary.join(", ")}` : "약한 구간 파악됨";
  return `${headline}\n보완 추천: ${tips.join(", ")}\n- TIP: 약점 과목은 '개념 → 유형 → 기출' 순으로 1~2주 스프린트로 잡아보세요.${friendlyTail}`;
}


    // 대학 미지정 → 상위 3곳 추천
    const all = evaluateAdmissionAll(userId, "mock");
    if (!all || all.length === 0) return `분석 결과가 없어요.${friendlyTail}`;

    const top = all.slice(0, 3);
    const lines = top.map(
      (x, i) =>
        `${i + 1}. ${x.universityName} — ${x.chance} (총점 ${x.userTotal}, 컷 ${x.cutoff}, gap ${
          x.gap >= 0 ? "+" + x.gap : x.gap
        })`
    );
    const tip = top[0].weakTips.length ? `\n추천 보완: ${top[0].weakTips.join(", ")}` : "";
    return `최근 점수 기준 추천 대학 TOP3\n${lines.join("\n")}${tip}${friendlyTail}`;
  }

  // ===== ⑥ 대학 기본 정보 =====
  if (uni) {
    const addr = uni.location?.address || "주소 정보 없음";
    return `${uni.name} 기본 정보입니다.\n주소: ${addr}${friendlyTail}`;
  }

  // 기본 가이드(미학습)
  return null;
};

export default function AIBuddy() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showSystemNotice, setShowSystemNotice] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const greetedOnceRef = useRef(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const cu = getCurrentUser();
    if (!cu) {
      alert("로그인된 사용자 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const data = getAIBuddyChatData();
    setMessages([...(data.messages || [])]);

    const noticeTimer = setTimeout(() => setShowSystemNotice(false), 3000);

    if (!greetedOnceRef.current) {
      greetedOnceRef.current = true;

      if (data.autoGreet && (data.greetMessage || []).length > 0) {
        const existing = new Set(
          (data.messages || [])
            .filter((m) => m.role === "assistant" && m.type === "text")
            .map((m) => m.content)
        );

        let delay = 0;
        data.greetMessage.forEach((msg, idx) => {
          if (existing.has(msg)) return;
          delay += idx === 0 ? 500 : 1000;
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              const newMessage = addAIBuddyMessage("assistant", "text", msg);
              setMessages((prev) => [...prev, newMessage]);
              setIsTyping(false);
            }, 500);
          }, delay);
        });
      }
    }

    return () => clearTimeout(noticeTimer);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleBackClick = () => navigate("/home");
  const handleProfileClick = () => navigate("/mypage");

  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    const cu = getCurrentUser();
    if (!cu) {
      alert("로그인된 사용자 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const userMessage = addAIBuddyMessage("user", "text", text);
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    setIsTyping(true);
    setTimeout(() => {
      const knowledge =
        generateAIResponse(text, cu.id) ||
        "아직 학습되지 않은 질문이에요. ‘서울대학교 경쟁률 알려줘’, ‘부산대 접수 기간’, ‘수능 D-day’, ‘내 점수로 어디 가능?’처럼 물어보면 답해드릴 수 있어요!";
      const aiMsg = addAIBuddyMessage("assistant", "text", knowledge);
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
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

        <main className="flex-1 overflow-y-auto scrollbar-hide px-[25px] pt-[25px] pb-[25px] flex flex-col gap-[15px]">
          {showSystemNotice && (
            <div className="w-full bg-[#e7edff] rounded-[10px] p-3 text-center text-sm text-[#232323] [font-family:'Noto_Sans_KR',Helvetica]">
              버디와의 채팅을 시작합니다.
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage
                    src="https://c.animaapp.com/mghllw7nnesCnv/img/ai-buddy-avatar.png"
                    alt="AI Buddy"
                  />
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-[10px] p-3 text-sm [font-family:'Noto_Sans_KR',Helvetica] ${
                  message.role === "user"
                    ? "bg-[#628af9] text-white"
                    : "bg-[#e7edff] text-[#232323]"
                }`}
              >
                {message.content}
                {message.type === "image" &&
                  message.images &&
                  message.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {message.images.map((imgSrc, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={imgSrc}
                          alt="AI response image"
                          className="w-full h-auto rounded-[8px] object-cover"
                        />
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2 justify-start">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage
                  src="https://c.animaapp.com/mghllw7nnesCnv/img/ai-buddy-avatar.png"
                  alt="AI Buddy"
                />
              </Avatar>
              <div className="bg-[#e7edff] rounded-[10px] p-3 text-sm text-[#232323] [font-family:'Noto_Sans_KR',Helvetica]">
                버디가 입력 중...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        <div className="w-[480px] flex-shrink-0 px-[25px] pb-[15px] pt-[10px] bg-[#f8f9ff] border-t border-[#e7edff]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 text-[#628af9] hover:bg-[#e7edff]"
              title="첨부"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
            <Input
              placeholder="메시지를 입력하세요"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 h-[40px] bg-white rounded-[20px] border-2 border-[#628af9] px-4 text-sm [font-family:'Noto_Sans_KR',Helvetica] placeholder:text-[#23232366]"
            />
            <Button
              onClick={handleSendMessage}
              className="w-10 h-10 p-0 rounded-full bg-[#628af9] hover:bg-[#5279e0]"
              title="보내기"
            >
              <SendIcon className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>

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
                    location.pathname === item.path
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
}
