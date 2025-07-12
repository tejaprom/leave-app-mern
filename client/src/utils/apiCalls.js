import axiosInstance from "./axiosConfig";

// Optional: Add interceptors here if needed
// axiosInstance.interceptors.request.use(...)


const LEAVES_API = '/api/leaves';
const AUTH_API = '/api/auth';

/* Auth APIs */
export const login = (credentials) => axiosInstance.post(`${AUTH_API}/login`, credentials);
export const register = (userData) => axiosInstance.post(`${AUTH_API}/register`, userData);
export const forgotPassword = (email) => axiosInstance.post(`${AUTH_API}/forgot-password`, { email });
export const resetPassword = (token, newPassword) =>
  axiosInstance.post(`${AUTH_API}/reset-password/${token}`, { newPassword });

/* Leave APIs */
export const getAllLeaves = (params) => axiosInstance.get(LEAVES_API, { params });
export const getLeaveById = (id) => axiosInstance.get(`${LEAVES_API}/${id}`);
export const applyLeave = (formData) => axiosInstance.post(`${LEAVES_API}/apply`, formData);
export const updateLeaveStatus = (id, status) =>
  axiosInstance.put(`${LEAVES_API}/${id}/status`, { status });
export const deleteLeave = (id) => axiosInstance.delete(`${LEAVES_API}/${id}`);
