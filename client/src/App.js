/**
 * 🎨 Main App Component
 * 
 * Purpose: Root component that manages:
 * - Scanner state (URL input, loading status)
 * - API communication with backend
 * - Display of scan results
 * - Scan history management
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import Scanner from "./components/Scanner";
import Results from "./components/Results";
import History from "./components/History";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;


function App() {
  // ─────────────────────────────────────────────────────────────────
  // 📊 STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────

  const [url, setUrl] = useState(""); // User input URL
  const [loading, setLoading] = useState(false); // Loading state during scan
  const [results, setResults] = useState(null); // Latest scan results
  const [error, setError] = useState(""); // Error messages
  const [history, setHistory] = useState([]); // Scan history
  const [showHistory, setShowHistory] = useState(false); // Toggle history view

  // ─────────────────────────────────────────────────────────────────
  // 🔄 LOAD HISTORY ON MOUNT
  // ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Fetch scan history from backend
   */
  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 🔒 SCAN HANDLER
  // ─────────────────────────────────────────────────────────────────

  /**
   * Handle website scan request
   * Sends URL to backend and processes response
   */
  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);

    // Validate input
    if (!url.trim()) {
      setError("Please enter a URL to scan");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/scan`, {
        url: url.trim(),
      });

      if (response.data.success) {
        setResults(response.data);
        // Refresh history after successful scan
        loadHistory();
      } else {
        setError(response.data.error || "Scan failed");
      }
    } catch (err) {
      // Handle different error types
      if (err.response) {
        setError(
          err.response.data.error ||
            "Error scanning website. Please try again."
        );
      } else if (err.request) {
        setError("Server is not responding. Make sure backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 📜 HISTORY MANAGEMENT
  // ─────────────────────────────────────────────────────────────────

  /**
   * Load a previous scan result from history
   */
  const handleLoadFromHistory = (scanResult) => {
    setResults(scanResult);
    setUrl(scanResult.url);
    setShowHistory(false);
  };

  /**
   * Clear all scan history
   */
  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all scan history?")) {
      try {
        await axios.post(`${API_BASE_URL}/clear-history`);
        setHistory([]);
        setShowHistory(false);
      } catch (err) {
        setError("Failed to clear history");
        console.error(err);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // 🎨 RENDER
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      {/* HEADER - Cybersecurity branded top section */}
      <header className="app-header">
        <div className="header-container">
          {/* Shield Icon and Branding */}
          <div className="header-brand">
            <div className="shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1L3 5v7c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
              </svg>
            </div>
            <div className="header-text">
              <h1 className="app-title">Website Security Scanner</h1>
              <p className="app-tagline">Scan websites for security misconfigurations</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="header-nav">
            <button
              className={`nav-btn ${!showHistory ? "active" : ""}`}
              onClick={() => setShowHistory(false)}
            >
              <span className="nav-icon">🔍</span>
              <span className="nav-label">Scanner</span>
            </button>
            <button
              className={`nav-btn ${showHistory ? "active" : ""}`}
              onClick={() => setShowHistory(true)}
            >
              <span className="nav-icon">📜</span>
              <span className="nav-label">History</span>
              {history.length > 0 && <span className="nav-badge">{history.length}</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT - Dynamic sections */}
      <main className="app-main">
        <div className="main-container">
          {/* Scanner View */}
          {!showHistory && (
            <>
              <Scanner
                url={url}
                loading={loading}
                onUrlChange={setUrl}
                onScan={handleScan}
              />

              {error && (
                <div className="error-container">
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                  </div>
                </div>
              )}

              {results && <Results scanResult={results} />}
            </>
          )}

          {/* History View */}
          {showHistory && (
            <History
              history={history}
              onLoadScan={handleLoadFromHistory}
              onClearHistory={handleClearHistory}
            />
          )}
        </div>
      </main>

      {/* FOOTER - Subtle info section */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-tip">🔐 Security scanning helps identify vulnerabilities before they're exploited</p>
          <p className="footer-tech">Running Secure • Protected • Encrypted</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
