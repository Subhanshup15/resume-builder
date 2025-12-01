export default function FormExperience({ data, setData, next, prev }) {
  const add = () => {
    setData([...data, { company: "", role: "", desc: "" }]);
  };

  const update = (i, field, value) => {
    const copy = [...data];
    copy[i][field] = value;
    setData(copy);
  };

  const remove = (i) => {
    const copy = data.filter((_, idx) => idx !== i);
    setData(copy);
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Work Experience</h2>

      {data.map((exp, i) => (
        <div key={i} className="border p-2 my-2">
          <input
            placeholder="Company"
            value={exp.company}
            onChange={(e) => update(i, "company", e.target.value)}
            className="input"
          />
          <input
            placeholder="Role"
            value={exp.role}
            onChange={(e) => update(i, "role", e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Achievements / Responsibilities"
            value={exp.desc}
            onChange={(e) => update(i, "desc", e.target.value)}
            className="input"
          />
          <button className="btn-danger" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={add} className="btn-outline">+ Add Experience</button>

      <div className="flex gap-2 mt-3">
        <button className="btn-outline" onClick={prev}>Back</button>
        <button className="btn-primary" onClick={next}>Next</button>
      </div>
    </div>
  );
}
