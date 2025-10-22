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
  // newUser: { username, password?, name, age?, email, gender, affiliation, school, grade, desiredUniversities, provider? }
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
export const getGroups = (userId) => {
  // 현재는 모든 그룹 반환 (실제 서비스에서는 userId 기반 필터링/참여 여부 적용)
  return groups;
};

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
  // date: "YYYY-MM-DD", category: "personal" | "groups" | "friends"
  const dataForDate = rankingData.find((d) => d.date === date);
  if (!dataForDate) return [];
  // 실제 구현에서는 userId로 개인/그룹/친구 영역을 필터링해야 하지만,
  // 현재는 더미 데이터를 그대로 반환.
  return dataForDate[category] || [];
};

/* ========================================================================
   아래부터는 애니마 구현에 필요한 '팔로잉/투두' 기능을 "추가"한 부분
   (기존 코드 수정 없음)
   ======================================================================== */

// tomorrow 상수 추가 (기존 today를 활용)
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// 팔로잉 유저 더미 데이터
let followingUsers = [
  { id: "f1", name: "강미경", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-10-1.png" },
  { id: "f2", name: "노소정", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-11-1.png" },
  { id: "f3", name: "이수원", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-12-1.png" },
  { id: "f4", name: "김지현", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-13-1.png" },
  { id: "f5", name: "최재원", avatar: "https://c.animaapp.com/mghllw7nnesCnv/img/ellipse-14-1.png" },
];

// 투두 더미 데이터
let todos = [
  { id: 1, userId: 1, subject: "수학", note: "미적분까지 복습하기", done: false, date: formatDateToYYYYMMDD(today) },
  { id: 2, userId: 1, subject: "과목", note: "복습할 내용 작성", done: true,  date: formatDateToYYYYMMDD(today) },
  { id: 3, userId: 1, subject: "영어", note: "단어 50개 암기",     done: false, date: formatDateToYYYYMMDD(tomorrow) },
];
let nextTodoId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

// 팔로잉/투두 API
export const getFollowingUsers = (userId) => {
  // 실제로는 userId 기반 필터링을 적용
  return followingUsers;
};

export const getTodos = (userId) => {
  return todos.filter((todo) => todo.userId === userId);
};

export const getTodosByDate = (userId, dateString) => {
  return todos.filter((todo) => todo.userId === userId && todo.date === dateString);
};

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
