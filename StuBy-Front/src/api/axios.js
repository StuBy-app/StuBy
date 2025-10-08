import axios from "axios";

export const baseURL = "http://localhost:8080/";

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const lsAccessToken = localStorage.getItem("AccessToken");
  if (!!lsAccessToken) {
    config.headers.Authorization = lsAccessToken;
  }
  return config;
});

export default api;