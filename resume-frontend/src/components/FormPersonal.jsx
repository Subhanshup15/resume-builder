export default function FormPersonal({ data, setData, next }) {
  return (
    <div>
      <h2 className="text-xl font-bold">Personal Information</h2>

      <input
        placeholder="Full Name"
        className="input"
        value={data.fullName}
        onChange={(e) => setData({ ...data, fullName: e.target.value })}
      />

      <input
        placeholder="Email"
        className="input"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="input"
        value={data.phone}
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />

      <button className="btn-primary" onClick={next}>Next</button>
    </div>
  );
}
