import axios from "axios";

export const baseURL = "http://localhost:8080/";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// 쿠키 세션이 아닐 경우엔 무시됩니다. (JWT만 쓰셔도 무방)
api.defaults.withCredentials = false;

api.interceptors.request.use((config) => {
  const lsAccessToken = localStorage.getItem("AccessToken");
  if (lsAccessToken) {
    config.headers.Authorization = /^Bearer\s/i.test(lsAccessToken)
      ? lsAccessToken
      : `Bearer ${lsAccessToken}`;
  }
  return config;
});

export default api;
