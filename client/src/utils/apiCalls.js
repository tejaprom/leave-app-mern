// client/src/utils/apiCalls.js:-
import axiosInstance from "./axiosConfig";

// Optional: Add interceptors here if needed
// axiosInstance.interceptors.request.use(...)


const LEAVES_API = '/api/leaves';
const AUTH_API = '/api/auth';

/* Auth APIs */
export const register = (userData) => axiosInstance.post(`${AUTH_API}/register`, userData);
export const login = (credentials) => axiosInstance.post(`${AUTH_API}/login`, credentials);
export const googleLogin = (data) => axiosInstance.post(`${AUTH_API}/google-login`, data);
export const forgotPassword = (email) => axiosInstance.post(`${AUTH_API}/forgot-password`, { email });
export const resetPassword = (token, password) =>
  axiosInstance.post(`${AUTH_API}/reset-password/${token}`, { password });
export const refreshAccessToken = () => axiosInstance.post(`${AUTH_API}/refresh-token`);
export const logoutUser = () => {
  return axiosInstance.post(`${AUTH_API}/logout`, null, {
    withCredentials: true, // required to send the refresh token cookie
  });
}; // this apicall is to clear refreshToken from the cookies

/* Leave APIs */
export const getAllLeaves = (params) => axiosInstance.get(`${LEAVES_API}/getleaves`, { params });
export const getLeaveById = (id) => axiosInstance.get(`${LEAVES_API}/${id}`);
export const applyLeave = (formData) => axiosInstance.post(`${LEAVES_API}/applyleave`, formData);
export const updateLeaveStatus = (id, status) =>
  axiosInstance.put(`${LEAVES_API}/updateleave/${id}`, { status });
export const deleteLeave = (id) => axiosInstance.delete(`${LEAVES_API}/${id}`);
