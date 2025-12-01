import axios from "axios";

const API = "http://localhost:5000/api";

export const saveResume = (data) =>
  axios.post(`${API}/resume`, data).then(res => res.data);

export const getResume = (userId) =>
  axios.get(`${API}/resume/${userId}`).then(res => res.data);

export const updateResume = (userId, data) =>
  axios.put(`${API}/resume/${userId}`, data).then(res => res.data);

export const optimizeResume = (resume) =>
  axios.post(`${API}/optimize`, { resume }).then(res => res.data.optimized);
