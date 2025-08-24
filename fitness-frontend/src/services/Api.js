import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (userId) {
    config.headers["X-User-Id"] = userId;
  }
  return config;
});

export const getActivities = () => {
  return api.get("/activities");
};

export const addActivity = (activity) => {
  console.log("Activitie being added is ", activity);
  return api.post("/activities", activity);
};

export const getActivityDetails = (id) => {
  return api.get(`/recommendations/activity/${id}`);
};
