// src/pages/Builder.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Builder() {
  const [step, setStep] = useState(1);

  // FORM DATA
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [experience, setExperience] = useState([
    { company: "", role: "", desc: "" },
  ]);

  const [skills, setSkills] = useState("");

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const addExperience = () => {
    setExperience([...experience, { company: "", role: "", desc: "" }]);
  };

  const updateExperience = (i, field, value) => {
    const copy = [...experience];
    copy[i][field] = value;
    setExperience(copy);
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <Link to="/" className="text-gray-300 underline">← Back Home</Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">Resume Builder</h1>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="max-w-xl space-y-4">
          <h2 className="text-xl font-semibold">Personal Info</h2>

          <input
            className="input"
            placeholder="Full Name"
            value={personal.fullName}
            onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={personal.email}
            onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
          />
          <input
            className="input"
            placeholder="Phone"
            value={personal.phone}
            onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
          />
          <input
            className="input"
            placeholder="Location"
            value={personal.location}
            onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
          />

          <button onClick={next} className="btn-primary">Next</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="max-w-xl space-y-4">
          <h2 className="text-xl font-semibold">Experience</h2>

          {experience.map((exp, i) => (
            <div key={i} className="p-3 bg-slate-800 rounded-md">
              <input
                className="input"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(i, "company", e.target.value)}
              />
              <input
                className="input"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => updateExperience(i, "role", e.target.value)}
              />
              <textarea
                className="input"
                placeholder="Responsibilities / Achievements"
                value={exp.desc}
                onChange={(e) => updateExperience(i, "desc", e.target.value)}
              />
            </div>
          ))}

          <button className="btn-outline" onClick={addExperience}>+ Add Experience</button>

          <div className="flex gap-2">
            <button className="btn-outline" onClick={back}>Back</button>
            <button className="btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <textarea
            className="input"
            placeholder="PHP, React, Node, MySQL..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <div className="flex gap-2 mt-4">
            <button className="btn-outline" onClick={back}>Back</button>
            <button className="btn-primary" onClick={next}>Preview</button>
          </div>
        </div>
      )}

      {/* STEP 4: PREVIEW */}
      {step === 4 && (
        <div className="max-w-xl bg-white text-black p-5 rounded-lg">
          <h1 className="text-2xl font-bold">{personal.fullName}</h1>
          <p>{personal.email} • {personal.phone} • {personal.location}</p>

          <h2 className="font-semibold mt-4 mb-2">Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">{e.role} — {e.company}</p>
              <p>{e.desc}</p>
            </div>
          ))}

          <h2 className="font-semibold mt-4 mb-2">Skills</h2>
          <p>{skills}</p>

          <button className="btn-outline mt-4" onClick={back}>Back</button>
        </div>
      )}
    </div>
  );
}
