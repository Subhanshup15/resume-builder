// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center p-4" style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#fff" }}>
      <h1 className="display-4 fw-bold mb-4">Resume Builder & Optimizer</h1>
      <p className="fs-5 text-secondary mb-5">
        Create a professional resume or improve your existing resume with AI.
      </p>

      <div className="d-flex gap-3">
        <Link to="/builder" className="text-decoration-none">
          <button className="btn btn-primary btn-lg fw-medium">
            📝 Create Fresh Resume
          </button> 
        </Link>

        <Link to="/optimizer" className="text-decoration-none">
          <button className="btn btn-secondary btn-lg fw-medium">
            ⚡ Optimize My Resume
          </button>
        </Link>
      </div>
    </div>
  );
}
