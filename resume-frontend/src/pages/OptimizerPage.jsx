import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OptimizerPage() {
  const [file, setFile] = useState(null);
  const [optimizedContent, setOptimizedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const optimizePDF = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post("http://localhost:5000/api/optimize/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setOptimizedContent(res.data.optimized);
        setSuccess(true);
      } else {
        setError(res.data.error || "Error optimizing PDF");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to optimize PDF. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const downloadOptimizedPDF = () => {
    // Create a simple text-based PDF for download
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(optimizedContent));
    element.setAttribute("download", "optimized_resume.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#212529", color: "#fff", minHeight: "100vh" }}>
      <Link to="/" className="btn btn-outline-secondary mb-4">
        ← Back Home
      </Link>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-4 fw-bold mb-4">Resume Optimizer (PDF)</h1>
          <p className="fs-5 text-secondary mb-5">
            Upload your resume PDF and we'll optimize it using AI (Gemini) for better ATS compatibility and recruiter appeal.
          </p>

          {/* File Upload Section */}
          <div className="card bg-dark border-secondary mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">📄 Upload Resume PDF</h5>
              <div className="mb-3">
                <input
                  type="file"
                  accept="application/pdf"
                  className="form-control"
                  onChange={handleFileSelect}
                  style={{ backgroundColor: "#343a40", color: "#fff", borderColor: "#495057" }}
                />
              </div>
              {file && (
                <p className="text-success mb-3">
                  ✓ Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
              <button
                className="btn btn-primary btn-lg"
                onClick={optimizePDF}
                disabled={!file || loading}
              >
                {loading ? "⏳ Optimizing..." : "✨ Optimize Resume"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>✓ Success!</strong> Your resume has been optimized using Gemini AI.
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setSuccess(false)}
              ></button>
            </div>
          )}

          {/* Optimized Content Display */}
          {optimizedContent && (
            <div className="card bg-dark border-success">
              <div className="card-body">
                <h5 className="card-title mb-3">📋 Optimized Resume</h5>
                <div
                  style={{
                    backgroundColor: "#343a40",
                    color: "#fff",
                    padding: "15px",
                    borderRadius: "5px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    borderLeft: "4px solid #28a745",
                  }}
                >
                  {optimizedContent}
                </div>
                <button
                  className="btn btn-success mt-3 me-2"
                  onClick={downloadOptimizedPDF}
                >
                  📥 Download as Text
                </button>
                <button
                  className="btn btn-info mt-3"
                  onClick={() => navigator.clipboard.writeText(optimizedContent)}
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
