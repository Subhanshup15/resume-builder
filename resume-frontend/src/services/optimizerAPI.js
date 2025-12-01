import axios from "axios";

// Use the backend API namespace to match `resumeApi` behavior
export const optimizeResume = async (resume) => {
  const res = await axios.post("http://localhost:5000/api/optimize", { resume });
  // backend returns { optimized: '...' }
  return res.data.optimized;
};
