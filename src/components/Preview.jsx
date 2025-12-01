export default function Preview({ resume }) {
  return (
    <div className="bg-white text-black p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{resume.personal.fullName}</h1>
      <p>{resume.personal.email} • {resume.personal.phone}</p>

      <h2 className="font-bold mt-4">Experience</h2>
      {resume.experience.map((e, i) => (
        <div key={i}>
          <strong>{e.role}</strong> — {e.company}
          <p>{e.desc}</p>
        </div>
      ))}

      <h2 className="font-bold mt-4">Skills</h2>
      <p>{resume.skills.join(", ")}</p>
    </div>
  );
}
