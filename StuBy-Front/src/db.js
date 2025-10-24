// ===============================
// src/db.js  (In-memory Mock DB)
// ===============================

// ------- In-Memory Data (샘플/시뮬레이션) -------
let users = [
  {
    id: 1,
    username: "testuser",
    password: "password123", // 일반 로그인 사용자만 가짐
    name: "테스트유저",
    age: 18,
    email: "test@example.com",
    gender: "female", // "male" | "female" | null
    affiliation: "고등학생",
    school: "xx고등학교",
    grade: "grade3",
    desiredUniversities: ["서울대학교", "고려대학교"],
  },
  {
    id: 2,
    username: "oauthuser",
    name: "OAuth유저",
    age: 17,
    email: "oauth@example.com",
    gender: "male",
    affiliation: "중학생",
    school: "yy중학교",
    grade: "grade2",
    desiredUniversities: [],
    provider: "google", // OAuth 사용자만 가짐 (google, naver, kakao)
  },
];

let mockGrades = [
  {
    userId: 1,
    month: "3월",
    korean1: 85,
    korean2: 90,
    english: 88,
    math1: 92,
    math2: 87,
    elective1: 95,
    elective2: 89,
    history: 91,
    total: 717,
  },
];

let schoolGrades = [
  {
    userId: 1,
    semester: "1학기 중간",
    korean: 92,
    english: 88,
    math: 95,
    customSubjects: [
      { name: "과학", score: 90 },
      { name: "사회", score: 87 },
    ],
    total: 452,
  },
];

// ------- 그룹/타이머 초기 데이터 -------
let groups = [
  {
    id: 1,
    ownerId: 1,
    thumbnail: "#A8C5F7",
    name: "수능 만점!!",
    description: "수능 만점을 목표로!",
    currentMembers: 3,
    maxMembers: 5,
    visibility: "공개",
  },
  {
    id: 2,
    ownerId: 1,
    thumbnail: "#FFD1A8",
    name: "오늘부터 1일",
    description: "오늘은 꼭 공부한다",
    currentMembers: 2,
    maxMembers: 4,
    visibility: "승인제",
  },
];

let timers = [
  { id: 1, userId: 1, subject: "국어", elapsedTime: 4474, isRunning: false },
  { id: 2, userId: 1, subject: "수학", elapsedTime: 8463, isRunning: false },
];

// ------- 랭킹 더미 데이터 -------
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const formatDateToYYYYMMDD = (date) => date.toISOString().split("T")[0];

let rankingData = [
  {
    date: formatDateToYYYYMMDD(twoDaysAgo),
    personal: [
      { name: "김민준", total: 12000 },
      { name: "강도윤", total: 9000 },
      { name: "김서아", total: 7000 },
      { name: "김지유", total: 6000 },
      { name: "서지아", total: 5000 },
      { name: "강지안", total: 4500 },
      { name: "최서진", total: 4000 },
      { name: "강유린", total: 3500 },
      { name: "김예준", total: 3000 },
      { name: "김주원", total: 2500 },
    ],
    groups: [
      { name: "우리 공부해요", total: 25000 },
      { name: "수능 만점!!", total: 20000 },
      { name: "only 영어만", total: 15000 },
      { name: "정보창고", total: 12000 },
      { name: "고3들만", total: 10000 },
      { name: "오늘부터 1일", total: 8000 },
      { name: "수능 망할 거 같은 사람들만", total: 6000 },
    ],
    friends: [
      { name: "강미경", total: 10000 },
      { name: "노소정", total: 8000 },
      { name: "이수원", total: 7000 },
      { name: "김지현", total: 6000 },
      { name: "최재원", total: 5000 },
    ],
  },
  {
    date: formatDateToYYYYMMDD(yesterday),
    personal: [
      { name: "김서아", total: 13540 },
      { name: "서지아", total: 9200 },
      { name: "김민준", total: 7500 },
      { name: "강지안", total: 6000 },
      { name: "강유린", total: 5000 },
      { name: "김예준", total: 4800 },
      { name: "강도윤", total: 4200 },
      { name: "김주원", total: 3800 },
      { name: "김지유", total: 3200 },
      { name: "최서진", total: 2800 },
    ],
    groups: [
      { name: "수능 만점!!", total: 28800 },
      { name: "수능 망할 거 같은 사람들만", total: 24600 },
      { name: "고3들만", total: 20123 },
      { name: "오늘부터 1일", total: 15000 },
      { name: "정보창고", total: 12000 },
      { name: "only 영어만", total: 9000 },
      { name: "우리 공부해요", total: 7000 },
    ],
    friends: [
      { name: "이수원", total: 11200 },
      { name: "김지현", total: 9800 },
      { name: "최재원", total: 8700 },
      { name: "노소정", total: 7600 },
      { name: "강미경", total: 6400 },
    ],
  },
  {
    date: formatDateToYYYYMMDD(today),
    personal: [
      { name: "강지안", total: 14000 },
      { name: "서지아", total: 10000 },
      { name: "강도윤", total: 8000 },
      { name: "김서아", total: 7000 },
      { name: "김주원", total: 6000 },
      { name: "최서진", total: 5500 },
      { name: "강유린", total: 5000 },
      { name: "김민준", total: 4500 },
      { name: "김지유", total: 4000 },
      { name: "김예준", total: 3500 },
    ],
    groups: [
      { name: "수능 망할 거 같은 사람들만", total: 30000 },
      { name: "오늘부터 1일", total: 25000 },
      { name: "우리 공부해요", total: 21000 },
      { name: "고3들만", total: 18000 },
      { name: "only 영어만", total: 15000 },
      { name: "정보창고", total: 10000 },
      { name: "수능 만점!!", total: 8000 },
    ],
    friends: [
      { name: "노소정", total: 12000 },
      { name: "김지현", total: 10000 },
      { name: "강미경", total: 9000 },
      { name: "이수원", total: 8000 },
      { name: "최재원", total: 7000 },
    ],
  },
];

// ------- ID 시퀀스 -------
let nextUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
let nextGroupId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1;
let nextTimerId = timers.length > 0 ? Math.max(...timers.map((t) => t.id)) + 1 : 1;

// ------- User APIs -------
export const registerUser = (newUser) => {
  if (users.some((user) => user.username === newUser.username)) {
    console.log("Username already exists.");
    return null;
  }
  if (users.some((user) => user.email === newUser.email)) {
    console.log("Email already exists.");
    return null;
  }

  const userWithId = {
    id: nextUserId++,
    ...newUser,
    age: Number.isFinite(newUser.age) ? newUser.age : null,
  };
  users.push(userWithId);
  console.log("User registered:", userWithId);
  return userWithId;
};

export const findUser = (username, password) => {
  const user = users.find((u) => u.username === username);
  if (user && user.password === password) {
    console.log("User found:", user);
    return user;
  }
  console.log("User not found or invalid credentials.");
  return null;
};

export const findOAuthUser = (email, provider) => {
  const user = users.find((u) => u.email === email && u.provider === provider);
  if (user) {
    console.log("OAuth user found:", user);
    return user;
  }
  console.log("OAuth user not found.");
  return null;
};

export const registerOAuthUser = (email, provider, username) => {
  let user = findOAuthUser(email, provider);
  if (user) return user;

  const newUser = {
    id: nextUserId++,
    username,
    name: username, // OAuth는 이름 정보가 없을 수 있으므로 username으로 대체
    age: null,
    email,
    gender: null,
    affiliation: null,
    school: "",
    grade: null,
    desiredUniversities: [],
    provider,
  };
  users.push(newUser);
  console.log("OAuth user registered:", newUser);
  return newUser;
};

export const updateUser = (id, updatedData) => {
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex > -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    console.log("User updated:", users[userIndex]);
    return users[userIndex];
  }
  console.log("User not found for update.");
  return null;
};

export const deleteUser = (id) => {
  const initialLength = users.length;
  users = users.filter((user) => user.id !== id);
  if (users.length < initialLength) {
    console.log("User deleted:", id);
    return true;
  }
  console.log("User not found for deletion.");
  return false;
};

// ------- Current Session (Mock) -------
let currentUser = null;

export const setCurrentUser = (user) => {
  currentUser = user;
};
export const getCurrentUser = () => currentUser;

// ------- Grades APIs -------
export const saveMockGrade = (userId, gradeData) => {
  mockGrades.push({ userId, ...gradeData });
  console.log("Mock grade saved:", { userId, ...gradeData });
};

export const getMockGrades = (userId) =>
  mockGrades.filter((grade) => grade.userId === userId);

export const saveSchoolGrade = (userId, gradeData) => {
  schoolGrades.push({ userId, ...gradeData });
  console.log("School grade saved:", { userId, ...gradeData });
};

export const getSchoolGrades = (userId) =>
  schoolGrades.filter((grade) => grade.userId === userId);

// ------- Groups APIs -------
export const getGroups = (userId) => groups;

export const createGroup = (ownerId, groupData) => {
  const newGroup = { ...groupData, id: nextGroupId++, ownerId };
  groups.push(newGroup);
  console.log("Group created:", newGroup);
  return newGroup;
};

// ------- Timers APIs -------
export const getTimers = (userId) =>
  timers.filter((timer) => timer.userId === userId);

export const addTimer = (userId, timerData) => {
  const newTimer = { ...timerData, id: nextTimerId++, userId };
  timers.push(newTimer);
  console.log("Timer added:", newTimer);
  return newTimer;
};

export const updateTimer = (userId, updatedTimer) => {
  const idx = timers.findIndex(
    (t) => t.id === updatedTimer.id && t.userId === userId
  );
  if (idx > -1) {
    timers[idx] = { ...updatedTimer };
    console.log("Timer updated:", timers[idx]);
    return timers[idx];
  }
  console.log("Timer not found for update.");
  return null;
};

export const deleteTimer = (userId, timerId) => {
  const initialLength = timers.length;
  timers = timers.filter((t) => !(t.id === timerId && t.userId === userId));
  if (timers.length < initialLength) {
    console.log("Timer deleted:", timerId);
    return true;
  }
  console.log("Timer not found for deletion.");
  return false;
};

// ------- Ranking APIs -------
export const getRankingData = (userId, date, category) => {
  const dataForDate = rankingData.find((d) => d.date === date);
  if (!dataForDate) return [];
  return dataForDate[category] || [];
};

/* ========================================================================
   팔로잉/투두
   ======================================================================== */
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

let followingUsers = [
  { id: "f1", name: "강미경", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-10-1.png" },
  { id: "f2", name: "노소정", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-11-1.png" },
  { id: "f3", name: "이수원", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-12-1.png" },
  { id: "f4", name: "김지현", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-13-1.png" },
  { id: "f5", name: "최재원", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-14-1.png" },
];

let todos = [
  { id: 1, userId: 1, subject: "수학", note: "미적분까지 복습하기", done: false, date: formatDateToYYYYMMDD(today) },
  { id: 2, userId: 1, subject: "과목", note: "복습할 내용 작성", done: true,  date: formatDateToYYYYMMDD(today) },
  { id: 3, userId: 1, subject: "영어", note: "단어 50개 암기",     done: false, date: formatDateToYYYYMMDD(tomorrow) },
];
let nextTodoId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

export const getFollowingUsers = (userId) => followingUsers;
export const getTodos = (userId) => todos.filter((todo) => todo.userId === userId);
export const getTodosByDate = (userId, dateString) =>
  todos.filter((todo) => todo.userId === userId && todo.date === dateString);

export const addTodo = (userId, todoData) => {
  const newTodo = { ...todoData, id: nextTodoId++, userId };
  todos.push(newTodo);
  console.log("Todo added:", newTodo);
  return newTodo;
};

export const updateTodo = (userId, updatedTodo) => {
  const idx = todos.findIndex((t) => t.id === updatedTodo.id && t.userId === userId);
  if (idx > -1) {
    todos[idx] = { ...updatedTodo };
    console.log("Todo updated:", todos[idx]);
    return todos[idx];
  }
  console.log("Todo not found for update.");
  return null;
};

export const deleteTodo = (userId, todoId) => {
  const initialLength = todos.length;
  todos = todos.filter((t) => !(t.id === todoId && t.userId === userId));
  if (todos.length < initialLength) {
    console.log("Todo deleted:", todoId);
    return true;
  }
  console.log("Todo not found for deletion.");
  return false;
};

/* ========================================================================
   UniversityInfo (수능/모의고사/검정고시 + 대학 정보)
   ======================================================================== */

const universityInfoData = {
  page: {
    title: "D-day",
    subtitle: "다음 모의고사까지 105일 남았습니다! 수능까지 200일 남았습니다!",
    selectedUniversityId: "snu",
  },
  universities: [
    {
      id: "snu",
      name: "서울대학교",
      logoUrl: "https://c.animaapp.com/mghllw7nnesCnv/img/seouldaehaggyo.png",
      location: { address: "서울특별시 관악구 관악로 1", lat: 37.459882, lng: 126.950566 },
      admissions: {
        early: {
          competitionRate: 9.07,
          applicationPeriod: { start: "2025-09-08", end: "2025-09-10" },
          notes: "서류 위주 전형, 일정은 학과별 상이할 수 있음",
        },
        regular: {
          competitionRate: 3.02,
          applicationPeriod: { start: "2025-12-29", end: "2026-12-31" },
          notes: "수능 위주 전형",
        },
      },
      keywords: ["서울대", "SNU", "서울대학교"],
    },
    {
      id: "pnu",
      name: "부산대학교",
      logoUrl: "https://c.animaapp.com/mghllw7nnesCnv/img/busandaehaggyo.png",
      location: { address: "부산광역시 금정구 부산대학로 63번길 2", lat: 35.232226, lng: 129.082889 },
      admissions: {
        early: {
          competitionRate: 8.11,
          applicationPeriod: { start: "2025-09-09", end: "2025-09-12" },
          notes: "",
        },
        regular: {
          competitionRate: 3.52,
          applicationPeriod: { start: "2025-12-29", end: "2026-12-31" },
          notes: "",
        },
      },
      keywords: ["부산대", "PNU", "부산대학교"],
    },
    {
      id: "knu",
      name: "경북대학교",
      logoUrl: "https://c.animaapp.com/mghllw7nnesCnv/img/gyeongbugdaehaggyo.jpg",
      location: { address: "대구광역시 북구 대학로 80", lat: 35.888521, lng: 128.610699 },
      admissions: {
        early: {
          competitionRate: 8.37,
          applicationPeriod: { start: "2025-09-08", end: "2025-09-12" },
          notes: "",
        },
        regular: {
          competitionRate: 3.51,
          applicationPeriod: { start: "2025-12-29", end: "2026-12-31" },
          notes: "",
        },
      },
      keywords: ["경북대", "KNU", "경북대학교"],
    },
    {
      id: "dau",
      name: "동아대학교",
      logoUrl: "/src/Img/dau.png",
      location: {
        address: "부산광역시 사하구 낙동대로 550번길 37",
        lat: 35.1195,
        lng: 128.9683,
      },
      admissions: {
        early: {
          competitionRate: 5.97,
          applicationPeriod: { start: "2025-09-08", end: "2025-09-12" },
          notes: "서류 위주 전형, 일정은 학과별 상이할 수 있음",
        },
        regular: {
          competitionRate: 6.0,
          applicationPeriod: { start: "2025-12-29", end: "2026-12-31" },
          notes: "수능 위주 전형",
        },
      },
      keywords: ["동아대", "DAU", "동아대학교"],
    },
  ],
  exams: {
    mock2025: [
      { month: 3, name: "3월 학력평가", date: "2025-03-26" },
      { month: 5, name: "5월 모의고사", date: "2025-05-08" },
      { month: 6, name: "6월 모의평가", date: "2025-06-04" },
      { month: 7, name: "7월 모의고사", date: "2025-07-09" },
      { month: 9, name: "9월 모의평가", date: "2025-09-03" },
      { month: 10, name: "10월 모의고사", date: "2025-10-14" },
    ],
    ged2025: [
      {
        session: 1,
        name: "2025년 검정고시 1회",
        schedule: [
          { label: "원서접수", start: "2025-02-10", end: "2025-02-21" },
          { label: "시험일", start: "2025-04-13", end: "2025-04-13" },
          { label: "합격자발표", start: "2025-05-09", end: "2025-05-09" },
        ],
      },
      {
        session: 2,
        name: "2025년 검정고시 2회",
        schedule: [
          { label: "원서접수", start: "2025-06-16", end: "2025-06-20" },
          { label: "시험일", start: "2025-08-10", end: "2025-08-10" },
          { label: "합격자발표", start: "2025-09-05", end: "2025-09-05" },
        ],
      },
    ],
    reference: {
      nextImportantDate: "2025-03-26", // (선택)
      suneungDate: "2025-11-13", // ✅ 실제 수능 D-day 계산용
    },
  },
};

export const getUniversityInfoData = () => universityInfoData;
export { formatDateToYYYYMMDD };

/* =========================================================
   ▶ AI 헬퍼: 대학/전형 조회 + 점수 기반 지원가능성/약점 분석
   ========================================================= */

// 대학 텍스트 매칭 (이름/키워드에 포함되면 매칭)
export const findUniversityByText = (text) => {
  if (!text) return null;
  const q = String(text).toLowerCase().trim();
  const list = universityInfoData.universities || [];
  return (
    list.find((u) => {
      const keys = [u.name, ...(u.keywords || [])].map((s) =>
        String(s).toLowerCase()
      );
      return keys.some((k) => k.includes(q));
    }) || null
  );
};

export const getUniversityAdmissions = (univId) => {
  const u = (universityInfoData.universities || []).find((x) => x.id === univId);
  return u ? u.admissions : null;
};
export const getSuneungDate = () =>
  universityInfoData.exams?.reference?.suneungDate || null;

export const getMockExamByMonth = (monthNum) => {
  const m = Number(monthNum);
  if (!m) return null;
  return (universityInfoData.exams?.mock2025 || []).find((e) => e.month === m) || null;
};

// 최신 성적
export const getLatestMockGrade = (userId) => {
  const list = (mockGrades || []).filter((g) => g.userId === userId);
  return list.length ? list[list.length - 1] : null;
};
export const getLatestSchoolGrade = (userId) => {
  const list = (schoolGrades || []).filter((g) => g.userId === userId);
  return list.length ? list[list.length - 1] : null;
};

// 평균/약점
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
  hist: 0,
});

const findWeakAreas = (avg, threshold = 85) => {
  const tips = [];
  if (avg.kor < threshold) tips.push("국어(독서/문학) 안정화");
  if (avg.math < threshold) tips.push("수학(개념·고난도) 보완");
  if (avg.eng < threshold) tips.push("영어(어휘·독해) 강화");
  if (avg.elective < threshold) tips.push("탐구(개념·기출 반복)");
  if (avg.hist !== undefined && avg.hist < threshold) tips.push("한국사 기출 누적");
  return tips;
};

// 컷라인(총점 기준) — 단순 모델
const UNIVERSITY_TOTAL_CUTOFFS = {
  snu: 780,
  pnu: 680,
  knu: 650,
  dau: 640,
};

const labelByGap = (gap) => {
  if (gap >= 20) return "매우 유리";
  if (gap >= 0) return "유리";
  if (gap >= -20) return "경쟁";
  return "어려움";
};

export const evaluateAdmissionForUniversity = (
  userId,
  universityId,
  source = "mock"
) => {
  const g =
    source === "school" ? getLatestSchoolGrade(userId) : getLatestMockGrade(userId);
  if (!g) return null;

  const userTotal = g.total;
  const cutoff = UNIVERSITY_TOTAL_CUTOFFS[universityId] ?? 700;
  const gap = userTotal - cutoff;
  const chance = labelByGap(gap);

  const avg = source === "school" ? avgFromSchool(g) : avgFromMock(g);
  const weakTips = findWeakAreas(avg);

  return {
    universityId,
    userTotal,
    cutoff,
    gap,
    chance,
    weakTips,
    areaAvg: avg,
    source,
  };
};

export const evaluateAdmissionAll = (userId, source = "mock") => {
  const uniList = universityInfoData.universities || [];
  const results = [];
  for (const u of uniList) {
    const r = evaluateAdmissionForUniversity(userId, u.id, source);
    if (r) results.push({ ...r, universityName: u.name });
  }
  return results.sort((a, b) => b.gap - a.gap);
};

/* =========================================================
   AI Buddy(버디) 채팅 저장소 + API
   ========================================================= */

const aibuddyChatData = {
  systemMessages: {
    enterNotice: "버디와의 채팅을 시작합니다.",
  },
  autoGreet: true,
  greetMessage: [
    "안녕하세요! AI 챗봇 버디입니다.",
    "궁금한게 있다면 언제든지 물어보세요! 버디는 늘 여기 있답니다!",
  ],
  messages: [],
};

let nextMessageId = 1;

export const getAIBuddyChatData = () => aibuddyChatData;

export const addAIBuddyMessage = (role, type, content, images = []) => {
  const last = aibuddyChatData.messages[aibuddyChatData.messages.length - 1];
  if (last && last.role === role && last.type === "text" && last.content === content) {
    return last;
  }
  const newMessage = {
    id: `m${nextMessageId++}`,
    role,
    type,
    content,
    images,
    createdAt: new Date().toISOString(),
  };
  aibuddyChatData.messages.push(newMessage);
  return newMessage;
};

/* =========================================================
   자연어 질문 처리기 (AIBuddy에서 사용)
   ========================================================= */

const friendlyTail = " 또 궁금한게 있나요? 🙂";
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
};

export const generateAIResponse = (rawText, userId) => {
  const text = String(rawText || "").trim();
  if (!text) return null;

  // 종료 인사
  if (/(고마워|고맙|감사|땡큐|thanks?|thx|수고)/i.test(text)) {
    return "고맙긴요! 다음에 또 궁금한게 있다면 버디를 찾아와주세요! 🙌";
  }

  // 인사
  if (/(^|\s)(안녕|안녕하세요|하이|hello|hi)(\s|$)/i.test(text)) {
    return "안녕하세요! AI 챗봇 버디입니다. 무엇을 도와드릴까요?";
  }

  // 대학명 추출(축약형 ‘서울대’ 처리 포함)
  const uni =
    findUniversityByText(text) ||
    (text.includes("서울대") ? findUniversityByText("서울대학교") : null);

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

  // ===== ③ 대학 기본 정보(주소 등) =====
  if (/(어디|주소|위치|캠퍼스|기본 정보|기본정보)/i.test(text) && uni) {
    return `${uni.name} 기본 정보입니다. 주소: ${uni.location.address}${friendlyTail}`;
  }

  // ===== ④ 수능 D-day =====
  if (/(수능|d-?day)/i.test(text)) {
    const dd = daysUntil(getSuneungDate());
    if (dd == null) return `수능 날짜 정보를 찾지 못했어요.${friendlyTail}`;
    if (dd > 0) return `수능까지 D-${dd}일입니다. 응원해요!${friendlyTail}`;
    if (dd === 0) return `오늘이 수능일입니다. 침착하게 최선을 다해요!${friendlyTail}`;
    return `수능일이 지났습니다. 고생 많았어요.${friendlyTail}`;
  }

  // ===== ⑤ 모의고사(월) =====
  const monthMatch = text.match(/(\d+)\s*월/);
  if (/(모의|학력평가|모평)/.test(text) && monthMatch) {
    const mm = Number(monthMatch[1]);
    const exam = getMockExamByMonth(mm);
    if (exam) return `${mm}월 모의고사 일정: ${exam.name} — ${exam.date}${friendlyTail}`;
    return `${mm}월 모의고사 일정을 찾지 못했어요.${friendlyTail}`;
  }

  // ===== ⑥ 합격 가능성/지원 가능? (모의/학교 공통) =====
  if (/(가능성|갈\s*수|붙을|지원|가능\?|될까|될까요)/i.test(text)) {
    // 데이터 소스 추론
    const source =
      /(학교|내신|학생부)/i.test(text) ? "school" : "mock";

    const latest =
      source === "school"
        ? getLatestSchoolGrade(userId)
        : getLatestMockGrade(userId);

    if (!latest) {
      return "먼저 점수를 입력해 주세요! (예: 국어/수학/영어/탐구/한국사 및 총점) 입력 후 다시 물어보면 분석해 드릴게요 🙂";
    }

    // 특정 대학
    if (uni) {
      const r = evaluateAdmissionForUniversity(userId, uni.id, source);
      if (!r) return `${uni.name} 분석을 할 수 없었어요.${friendlyTail}`;
      const gapText = r.gap >= 0 ? `컷보다 +${r.gap}` : `컷보다 ${r.gap}`;
      const tipText =
        r.weakTips.length > 0
          ? `보완 추천: ${r.weakTips.join(", ")}`
          : "과목 밸런스가 좋아요. 지금 페이스 유지!";
      return `${uni.name} 합격 가능성: **${r.chance}** (${gapText})\n내 총점: ${r.userTotal} / 컷: ${r.cutoff}\n${tipText}${friendlyTail}`;
    }

    // 대학 미지정 → 상위 3곳 추천
    const all = evaluateAdmissionAll(userId, source);
    if (!all || all.length === 0) return `분석 결과가 없어요.${friendlyTail}`;

    const top = all.slice(0, 3);
    const lines = top.map(
      (x, i) =>
        `${i + 1}. ${x.universityName} — ${x.chance} (총점 ${x.userTotal}, 컷 ${x.cutoff}, gap ${x.gap >= 0 ? "+" + x.gap : x.gap})`
    );
    const tip = top[0].weakTips.length
      ? `\n추천 보완: ${top[0].weakTips.join(", ")}`
      : "";
    return `최근 점수 기준 추천 대학 TOP3\n${lines.join("\n")}${tip}${friendlyTail}`;
  }

  // ===== ⑦ 약점/어떤 공부를 해야 해? =====
  if (/(부족|약점|보완|어떤 공부|무엇을 공부|어디를 공부)/i.test(text)) {
    // source 추론: 학교/모의 키워드
    const source =
      /(학교|내신|학생부)/i.test(text) ? "school" : "mock";
    const g =
      source === "school" ? getLatestSchoolGrade(userId) : getLatestMockGrade(userId);
    if (!g) {
      return "먼저 모의고사 또는 학교 성적을 입력해 주세요. 입력 후 다시 물어보면 약점을 분석해 드릴게요 🙂";
    }
    const avg = source === "school" ? avgFromSchool(g) : avgFromMock(g);
    const tips = findWeakAreas(avg);
    if (tips.length === 0) return `전 과목 밸런스가 좋습니다. 지금 페이스 유지!${friendlyTail}`;
    return `현재 보완이 필요한 영역: ${tips.join(", ")}${friendlyTail}`;
  }

  // ===== ⑧ 기본 fallback =====
  return "아직 학습되지 않은 질문이에요. ‘서울대학교 경쟁률 알려줘’, ‘부산대 접수 기간’, ‘수능 D-day’, ‘내 점수로 어디 가능?’처럼 물어보면 답해드릴 수 있어요!";
};
