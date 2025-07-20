// client/src/utils/axiosConfig.js:-
import axios from "axios";
import { API_BASE_URL } from "./constants";
import { refreshAccessToken } from "./apiCalls";

const axiosInstance = axios.create({
  // baseURL: API_BASE_URL || "http://localhost:5000",
  baseURL: API_BASE_URL,
  withCredentials: true, // Allows sending HttpOnly cookies
});

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: Auto refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshAccessToken(); // Get new accessToken
        const newAccessToken = res.data.token;

        localStorage.setItem("token", newAccessToken);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // Retry request
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/"; // Optional: redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry and retry failed requests
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await axiosInstance.post("/auth/refresh-token");
//         const newAccessToken = res.data.accessToken;
//         localStorage.setItem("accessToken", newAccessToken);
//         axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//         processQueue(null, newAccessToken);
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         localStorage.removeItem("accessToken");
//         window.location.href = "/login";
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
