/**
 * 📜 History Component
 * 
 * Displays:
 * - List of previous scans in a modern table
 * - Score, grade, risk level for each scan
 * - Click to load previous results
 * - Clear all history button
 * - Cybersecurity themed design
 */

import React from "react";

function History({ history, onLoadScan, onClearHistory }) {
  const getGradeColor = (grade) => {
    const gradeMap = {
      "A": "#00ff88",
      "B": "#00d9ff",
      "C": "#ffaa00",
      "D": "#ff6600",
      "F": "#ff3366"
    };
    return gradeMap[grade] || "#00ff88";
  };

  const getRiskColor = (risk) => {
    const riskMap = {
      "LOW": "#00ff88",
      "MEDIUM": "#ffaa00",
      "HIGH": "#ff3366",
      "CRITICAL": "#ff0055"
    };
    return riskMap[risk?.toUpperCase()] || "#00ff88";
  };

  return (
    <section className="history-section">
      <div className="section-header">
        <div className="section-icon">📜</div>
        <div className="section-title-block">
          <h2 className="section-title">Scan History</h2>
          <p className="section-subtitle">{history.length} scan{history.length !== 1 ? "s" : ""} recorded</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">📋</div>
          <p className="empty-title">No scans yet</p>
          <p className="empty-subtitle">Start by scanning a website to build your history</p>
        </div>
      ) : (
        <>
          {/* History Table */}
          <div className="history-container">
            <div className="history-table">
              {/* Table Header */}
              <div className="table-header">
                <div className="table-cell cell-url">Website URL</div>
                <div className="table-cell cell-score">Score</div>
                <div className="table-cell cell-grade">Grade</div>
                <div className="table-cell cell-risk">Risk Level</div>
                <div className="table-cell cell-date">Scan Date</div>
                <div className="table-cell cell-action">Action</div>
              </div>

              {/* Table Rows */}
              <div className="table-body">
                {history.map((scan, idx) => (
                  <div
                    key={scan.id}
                    className="table-row"
                    onClick={() => onLoadScan(scan)}
                  >
                    <div className="table-cell cell-url">
                      <span className="url-text" title={scan.url}>{scan.url}</span>
                    </div>
                    <div className="table-cell cell-score">
                      <span className="score-text">{scan.securityScore}/100</span>
                    </div>
                    <div className="table-cell cell-grade">
                      <span className="grade-badge" style={{ 
                        color: getGradeColor(scan.grade),
                        borderColor: getGradeColor(scan.grade)
                      }}>
                        {scan.grade}
                      </span>
                    </div>
                    <div className="table-cell cell-risk">
                      <span className="risk-badge" style={{ 
                        color: getRiskColor(scan.riskLevel),
                        borderColor: getRiskColor(scan.riskLevel)
                      }}>
                        {scan.riskLevel}
                      </span>
                    </div>
                    <div className="table-cell cell-date">
                      <span className="date-text">
                        {new Date(scan.timestamp).toLocaleDateString()} {new Date(scan.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="table-cell cell-action">
                      <button className="row-action-btn" title="View results">
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clear History Button */}
          <div className="history-actions">
            <button
              className="clear-history-btn"
              onClick={onClearHistory}
              title="Delete all scan history"
            >
              <span className="btn-icon">🗑️</span>
              <span className="btn-text">Clear All History</span>
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default History;
