import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    personal: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
    },
    experience: [
      {
        company: String,
        role: String,
        desc: String,
      }
    ],
    skills: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
