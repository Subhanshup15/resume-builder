// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Resume Builder & Optimizer</h1>
      <p className="text-lg text-gray-300 mb-8">
        Create a professional resume or improve your existing resume with AI.
      </p>

      <div className="flex gap-4">
        <Link to="/builder">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg">
            📝 Create Fresh Resume
          </button>
        </Link>

        <Link to="/optimizer">
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg text-lg">
            ⚡ Optimize My Resume
          </button>
        </Link>
      </div>
    </div>
  );
}
