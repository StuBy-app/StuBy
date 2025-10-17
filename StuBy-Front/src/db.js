// src/db.js

// ------- In-Memory Data (샘플/시뮬레이션) -------
let users = [
  {
    id: 1,
    username: "testuser",
    password: "password123", // 일반 로그인 사용자만 가짐
    name: "테스트유저",
    age: 18,                          // ✅ 추가
    email: "test@example.com",
    gender: "female",                 // "male" | "female" | null
    affiliation: "고등학생",
    school: "xx고등학교",
    grade: "grade3",
    desiredUniversities: ["서울대학교", "고려대학교"],
  },
  {
    id: 2,
    username: "oauthuser",
    name: "OAuth유저",
    age: 17,                          // ✅ 추가(임의)
    email: "oauth@example.com",
    gender: "male",
    affiliation: "중학생",
    school: "yy중학교",
    grade: "grade2",
    desiredUniversities: [],
    provider: "google",               // OAuth 사용자만 가짐 (google, naver, kakao)
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

let nextUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

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
    age: Number.isFinite(newUser.age) ? newUser.age : null,  // ✅ 보강
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
    age: null,      // ✅ OAuth 가입 시 나이 정보 없음
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
