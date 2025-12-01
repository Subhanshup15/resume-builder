import axios from "axios";

export const optimizeResume = async (resume) => {
  const res = await axios.post("http://localhost:5000/optimize", { resume });
  return res.data.content;
};
