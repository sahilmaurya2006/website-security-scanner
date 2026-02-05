/**
 * 🔍 Scanner Component
 * 
 * Handles:
 * - URL input field with focus glow
 * - Scan button with loading animation
 * - Form submission
 * - Modern cybersecurity design
 */

import React from "react";

function Scanner({ url, loading, onUrlChange, onScan }) {
  return (
    <section className="scanner-section">
      {/* Decorative Background Elements */}
      <div className="scanner-glow-bg"></div>

      <div className="scanner-container">
        <div className="scanner-header">
          <div className="scanner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div>
            <h2 className="scanner-title">Start Security Analysis</h2>
            <p className="scanner-subtitle">Enter a URL to analyze its security configuration</p>
          </div>
        </div>

        {/* URL Input Form */}
        <form className="scanner-form" onSubmit={onScan}>
          <div className="input-wrapper">
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <input
              type="text"
              className="scanner-input"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="scanner-btn"
            disabled={loading}
            title={loading ? "Scanning website..." : "Click to scan"}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                <span className="btn-text">Analyzing...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">🔍</span>
                <span className="btn-text">Scan Website</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Tips */}
        <div className="scanner-tips">
          <div className="tip-item">
            <span className="tip-icon">💡</span>
            <span className="tip-text">Include the full URL with https:// or http://</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⚡</span>
            <span className="tip-text">Scan typically completes in 5-10 seconds</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔒</span>
            <span className="tip-text">Your URLs are not logged or stored permanently</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Scanner;
