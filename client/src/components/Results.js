/**
 * 📊 Results Component
 * 
 * Displays:
 * - Security score card with grade
 * - Individual security checks (passed/failed)
 * - Risk level and recommendations
 * - Scan metadata (response time, status code)
 * - PDF download option
 */
const API_URL = process.env.REACT_APP_API_URL;

import React from "react";

function Results({ scanResult }) {
  if (!scanResult) return null;

  const { checks, recommendations, securityScore, riskLevel, timestamp, responseTime, statusCode, grade, url, id } =
    scanResult;

  // Determine risk level styling
  const getRiskColor = (risk) => {
    const riskMap = {
      "LOW": "#00ff88",
      "MEDIUM": "#ffaa00",
      "HIGH": "#ff3366",
      "CRITICAL": "#ff0055"
    };
    return riskMap[risk?.toUpperCase()] || "#00ff88";
  };

  // Determine grade color
  const getGradeColor = (g) => {
    const gradeMap = {
      "A": "#00ff88",
      "B": "#00d9ff",
      "C": "#ffaa00",
      "D": "#ff6600",
      "F": "#ff3366"
    };
    return gradeMap[g] || "#00ff88";
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${API_URL}/report/${id}/pdf`);
      if (!response.ok) throw new Error("Failed to download PDF");
      const blob = await response.blob();
      const urlObj = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = `security-scan-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(urlObj);
    } catch (error) {
      alert("Error downloading PDF: " + error.message);
    }
  };

  // Count passed and failed checks
  const passedCount = Object.values(checks).filter(c => c.passed).length;
  const totalChecks = Object.values(checks).length;

  return (
    <section className="results-section">
      {/* SCORE CARD - Main visual element */}
      <div className="score-card">
        <div className="score-card-content">
          {/* Score Display */}
          <div className="score-display">
            <div className="score-circle" style={{ "--score-color": getGradeColor(grade) }}>
              <div className="score-number">{securityScore}</div>
              <div className="score-max">/100</div>
            </div>
            
            {/* Grade and Risk Info */}
            <div className="score-info">
              <div className="grade-block">
                <div className="grade-label">Overall Grade</div>
                <div className="grade-value" style={{ color: getGradeColor(grade) }}>
                  {grade}
                </div>
              </div>
              <div className="risk-block">
                <div className="risk-label">Risk Level</div>
                <div className="risk-badge" style={{ 
                  borderColor: getRiskColor(riskLevel),
                  color: getRiskColor(riskLevel)
                }}>
                  {riskLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="scan-metadata">
            <div className="meta-item">
              <div className="meta-label">HTTP Status</div>
              <div className="meta-value">{statusCode}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Response Time</div>
              <div className="meta-value">{responseTime}ms</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Scanned</div>
              <div className="meta-value">{new Date(timestamp).toLocaleTimeString()}</div>
            </div>
          </div>

          {/* URL Display */}
          <div className="scan-url">
            <span className="url-label">Target:</span>
            <span className="url-value" title={url}>{url}</span>
          </div>

          {/* Action Buttons */}
          <div className="card-actions">
            <button className="action-btn primary" onClick={handleDownloadPDF}>
              <span className="btn-icon">📥</span>
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECURITY CHECKS SECTION */}
      <section className="checks-section">
        <div className="section-header">
          <div className="section-icon">✅</div>
          <div className="section-title-block">
            <h3 className="section-title">Security Checks</h3>
            <p className="section-subtitle">{passedCount} of {totalChecks} checks passed</p>
          </div>
          <div className="checks-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(passedCount / totalChecks) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="checks-grid">
          {Object.entries(checks).map(([key, check]) => (
            <div
              key={key}
              className={`check-card ${check.passed ? "passed" : "failed"}`}
            >
              <div className="check-header">
                <div className="check-icon">
                  {check.passed ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  )}
                </div>
                <h4 className="check-name">{check.label}</h4>
              </div>
              <p className="check-description">{check.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDATIONS SECTION */}
      {recommendations && recommendations.length > 0 && (
        <section className="recommendations-section">
          <div className="section-header">
            <div className="section-icon">💡</div>
            <div className="section-title-block">
              <h3 className="section-title">Security Recommendations</h3>
              <p className="section-subtitle">{recommendations.length} issue{recommendations.length !== 1 ? "s" : ""} found</p>
            </div>
          </div>

          <div className="recommendations-list">
            {recommendations.map((rec, idx) => {
              const severityColors = {
                "LOW": "#00ff88",
                "MEDIUM": "#ffaa00",
                "HIGH": "#ff3366",
                "CRITICAL": "#ff0055"
              };
              const color = severityColors[rec.severity?.toUpperCase()] || "#00ff88";

              return (
                <div key={idx} className="recommendation-card" style={{ "--rec-color": color }}>
                  <div className="recommendation-header">
                    <div className="severity-badge" style={{ borderColor: color, color: color }}>
                      {rec.severity}
                    </div>
                    <h4 className="recommendation-title">{rec.issue}</h4>
                  </div>
                  <div className="recommendation-content">
                    <div className="recommendation-fix">
                      <strong>🔧 Fix:</strong> {rec.fix}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
}

export default Results;
