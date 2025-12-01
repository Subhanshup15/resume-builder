// src/pages/Builder.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/generator";

export default function Builder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [fullName, setFullName] = useState("");

  // FORM DATA
  const [personal, setPersonal] = useState({
    fullName: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
  });

  const [experience, setExperience] = useState([
    { company: "", role: "", desc: "" },
  ]);

  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState([
    { school: "", degree: "", start: "", end: "", desc: "" },
  ]);

  const [certifications, setCertifications] = useState("");
  const [links, setLinks] = useState("");

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const addExperience = () => {
    setExperience([...experience, { company: "", role: "", desc: "" }]);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { school: "", degree: "", start: "", end: "", desc: "" },
    ]);
  };

  const updateEducation = (i, field, value) => {
    const copy = [...education];
    copy[i][field] = value;
    setEducation(copy);
  };

  const updateExperience = (i, field, value) => {
    const copy = [...experience];
    copy[i][field] = value;
    setExperience(copy);
  };

  const generateResume = async () => {
    if (!personal.fullName.trim()) {
      setError("Please fill in your full name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/generate`, {
        personal,
        experience: experience.filter((e) => e.company || e.role),
        education: education.filter((e) => e.school || e.degree),
        skills,
        certifications,
      });

      setGeneratedResume(response.data.resume);
      setFullName(personal.fullName);
      setStep(5); // Go to preview
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate resume. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/pdf`,
        {
          resume: generatedResume,
          fullName,
        },
        {
          responseType: "blob",
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fullName}-resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError("Failed to download PDF");
    }
  };

  return (
    <div className="min-vh-100 p-4" style={{ backgroundColor: "#212529", color: "#fff" }}>
      <Link to="/" className="text-decoration-none" style={{ color: "#a0aec0" }}>
        ← Back Home
      </Link>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mt-3">
          {error}
          <button className="btn-close btn-close-white" onClick={() => setError("")}></button>
        </div>
      )}

      <h1 className="display-5 fw-bold mt-5 mb-5 text-center">
        Resume Builder
      </h1>

      <div className="d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "800px" }}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="h4 fw-semibold mb-4">Personal Info</h2>

              <input
                className="form-control mb-3"
                placeholder="Full Name"
                value={personal.fullName}
                onChange={(e) =>
                  setPersonal({ ...personal, fullName: e.target.value })
                }
              />
              <input
                className="form-control mb-3"
                placeholder="Email"
                value={personal.email}
                onChange={(e) =>
                  setPersonal({ ...personal, email: e.target.value })
                }
              />
              <input
                className="form-control mb-3"
                placeholder="Phone"
                value={personal.phone}
                onChange={(e) =>
                  setPersonal({ ...personal, phone: e.target.value })
                }
              />
              <input
                className="form-control mb-3"
                placeholder="Location"
                value={personal.location}
                onChange={(e) =>
                  setPersonal({ ...personal, location: e.target.value })
                }
              />
              <textarea
                className="form-control mb-3"
                placeholder="Professional summary (2-3 lines)"
                value={personal.summary}
                onChange={(e) =>
                  setPersonal({ ...personal, summary: e.target.value })
                }
              />

              <button className="btn btn-primary" onClick={next}>
                Next →
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="h4 fw-semibold mb-4">Experience</h2>

              {experience.map((exp, i) => (
                <div key={i} className="card bg-dark text-white mb-3">
                  <div className="card-body">
                    <input
                      className="form-control mb-3"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(i, "company", e.target.value)
                      }
                    />
                    <input
                      className="form-control mb-3"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(i, "role", e.target.value)
                      }
                    />
                    <textarea
                      className="form-control mb-3"
                      placeholder="Responsibilities / Achievements"
                      value={exp.desc}
                      onChange={(e) =>
                        updateExperience(i, "desc", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              <button className="btn btn-outline-secondary mb-4" onClick={addExperience}>
                + Add Experience
              </button>

              <h2 className="h4 fw-semibold mt-5 mb-4">Education</h2>
              {education.map((ed, i) => (
                <div key={i} className="card bg-dark text-white mb-3">
                  <div className="card-body">
                    <input
                      className="form-control mb-3"
                      placeholder="School"
                      value={ed.school}
                      onChange={(e) =>
                        updateEducation(i, "school", e.target.value)
                      }
                    />
                    <input
                      className="form-control mb-3"
                      placeholder="Degree"
                      value={ed.degree}
                      onChange={(e) =>
                        updateEducation(i, "degree", e.target.value)
                      }
                    />
                    <div className="d-flex gap-3">
                      <input
                        className="form-control mb-3"
                        placeholder="Start"
                        value={ed.start}
                        onChange={(e) =>
                          updateEducation(i, "start", e.target.value)
                        }
                      />
                      <input
                        className="form-control mb-3"
                        placeholder="End"
                        value={ed.end}
                        onChange={(e) =>
                          updateEducation(i, "end", e.target.value)
                        }
                      />
                    </div>
                    <textarea
                      className="form-control mb-3"
                      placeholder="Details"
                      value={ed.desc}
                      onChange={(e) =>
                        updateEducation(i, "desc", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              <button className="btn btn-outline-secondary mb-4" onClick={addEducation}>
                + Add Education
              </button>

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-outline-secondary" onClick={back}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={next}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="h4 fw-semibold mb-3">Skills</h2>
              <textarea
                className="form-control mb-4"
                placeholder="PHP, React, Node, MySQL..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <h2 className="h4 fw-semibold mb-3">Certifications</h2>
              <input
                className="form-control mb-4"
                placeholder="Comma separated"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
              />

              <h2 className="h4 fw-semibold mb-3">Links</h2>
              <input
                className="form-control mb-4"
                placeholder="Comma separated profile links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
              />

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-outline-secondary" onClick={back}>
                  ← Back
                </button>
                <button className="btn btn-success btn-lg" onClick={generateResume} disabled={loading}>
                  {loading ? "⏳ Generating..." : "✨ Generate Resume"}
                </button>
              </div>
            </>
          )}

          {/* STEP 4 — AI GENERATED RESUME PREVIEW */}
          {step === 4 && generatedResume && (
            <div className="card bg-light text-dark">
              <div className="card-body">
                <h4 className="card-title mb-3">📋 Your AI-Enhanced Resume</h4>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "5px",
                    maxHeight: "450px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "13px",
                    borderLeft: "4px solid #28a745",
                  }}
                >
                  {generatedResume}
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-secondary" onClick={() => setStep(3)}>
                    ← Edit
                  </button>
                  <button className="btn btn-success btn-lg" onClick={downloadPDF}>
                    📥 Download PDF
                  </button>
                  <button className="btn btn-info" onClick={() => navigator.clipboard.writeText(generatedResume)}>
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — Alternative if step changes in future */}
          {step === 5 && generatedResume && (
            <div className="card bg-light text-dark">
              <div className="card-body">
                <h4 className="card-title mb-3">✨ Resume Generated Successfully!</h4>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "5px",
                    maxHeight: "450px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "13px",
                    borderLeft: "4px solid #28a745",
                  }}
                >
                  {generatedResume}
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>
                    ← Create New
                  </button>
                  <button className="btn btn-success btn-lg" onClick={downloadPDF}>
                    📥 Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
