import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    personal: {
      fullName: String,
      summary: String,
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
    skills: [String],
    education: [
      {
        school: String,
        degree: String,
        start: String,
        end: String,
        desc: String,
      }
    ],
    certifications: [String],
    links: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
