import axios from "axios";
import { optimizeResume } from "../services/optimizerAPI";

export default function Optimizer() {
  const [inputResume, setInputResume] = useState("");
  const [result, setResult] = useState("");

  const handleOptimize = async () => {
    const optimized = await optimizeResume(inputResume);
    setResult(optimized);
  };

  return (
    <div>
      <textarea
        value={inputResume}
        onChange={(e) => setInputResume(e.target.value)}
        className="input h-60"
        placeholder="Paste your resume text..."
      />

      <button className="btn-primary" onClick={handleOptimize}>
        Optimize My Resume
      </button>

      <textarea
        className="input h-60 mt-3"
        readOnly
        value={result}
      />
    </div>
  );
}
