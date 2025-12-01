import { useState } from "react";
import { optimizeResume } from "../api/resumeApi";

export default function OptimizerPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleOptimize = async () => {
    const text = await optimizeResume(input);
    setOutput(text);
  };

  return (
    <div className="p-6">
      <h1>Resume Optimizer</h1>
      <textarea
        className="input h-60"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="btn-primary" onClick={handleOptimize}>Optimize</button>
      <textarea className="input h-60 mt-4" value={output} readOnly />
    </div>
  );
}
