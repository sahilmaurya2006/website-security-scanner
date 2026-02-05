const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PDFDocument = require("pdfkit");

/**
 * ═══════════════════════════════════════════════════════════════════
 * 🔒 WEBSITE SECURITY SCANNER - Production Ready Backend
 * 
 * Purpose: Analyze web applications for common security misconfigurations
 * Security Concepts:
 * - HTTPS/TLS: Encrypts data in transit (prevents MITM attacks)
 * - Security Headers: Control browser behavior to prevent XSS, clickjacking
 * - HTTP Status: Indicates website availability and configuration
 * ═══════════════════════════════════════════════════════════════════
 */

// In-memory scan history (for production, use database)
const scanHistory = [];

// ─────────────────────────────────────────────────────────────────
// 🎯 UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Validates URL format using URL constructor
 * Prevents invalid URLs from being scanned
 */
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure URL has protocol (defaults to https)
 */
function normalizeURL(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

/**
 * Calculates security score based on security checks
 * Score breakdown:
 * - HTTPS: 20 points (critical for data protection)
 * - Content-Security-Policy: 20 points (prevents XSS attacks)
 * - X-Frame-Options: 15 points (prevents clickjacking)
 * - X-Content-Type-Options: 15 points (prevents MIME sniffing)
 * - Strict-Transport-Security: 15 points (forces HTTPS)
 * - Referrer-Policy: 10 points (protects user privacy)
 * - Valid SSL/TLS: 5 points (certificate validity)
 */
function calculateSecurityScore(checks) {
  let score = 0;
  const maxScore = 100;

  // HTTPS check (20 points) - Most critical
  if (checks.httpsEnabled) score += 20;
  else score -= 10; // Penalty for HTTP

  // Content-Security-Policy (20 points)
  if (checks.headers.contentSecurityPolicy) score += 20;

  // X-Frame-Options (15 points) - Prevents clickjacking
  if (checks.headers.xFrameOptions) score += 15;

  // X-Content-Type-Options (15 points) - Prevents MIME sniffing
  if (checks.headers.xContentTypeOptions) score += 15;

  // Strict-Transport-Security (15 points) - HTTPS enforcement
  if (checks.headers.strictTransportSecurity) score += 15;

  // Referrer-Policy (10 points) - Privacy protection
  if (checks.headers.referrerPolicy) score += 10;

  // SSL/TLS valid (5 points)
  if (checks.sslValid) score += 5;

  // Cap score between 0 and 100
  return Math.max(0, Math.min(maxScore, score));
}

/**
 * Determines risk severity based on security score
 * Helps users prioritize security improvements
 */
function getRiskLevel(score) {
  if (score >= 80) return "✅ Low";
  if (score >= 60) return "⚠️ Medium";
  return "🔴 High";
}

/**
 * Convert numeric score to letter grade
 */
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

/**
 * Simple mapping from our checks to OWASP Top 10 categories
 * This is a lightweight mapping for reporting/educational purposes.
 */
const owaspMapping = {
  https: { id: "A02", title: "Cryptographic Failures", desc: "Missing or weak TLS/HTTPS may expose data in transit." },
  csp: { id: "A03", title: "Injection / XSS Mitigation", desc: "CSP helps mitigate XSS and content injection risks." },
  xFrameOptions: { id: "A05", title: "Security Misconfiguration", desc: "Clickjacking protections prevent UI redress attacks." },
  xContentTypeOptions: { id: "A05", title: "Security Misconfiguration", desc: "Prevents MIME sniffing and accidental content execution." },
  hsts: { id: "A02", title: "Cryptographic Failures", desc: "HSTS enforces HTTPS and helps prevent protocol downgrade attacks." },
  referrerPolicy: { id: "A05", title: "Security Misconfiguration", desc: "Controls referrer information to avoid data leakage." },
  robotsExposed: { id: "A06", title: "Security Misconfiguration", desc: "Exposed robots.txt can leak sensitive paths and help attackers reconnaissance." },
  serverHiding: { id: "A05", title: "Security Misconfiguration", desc: "Server banners may reveal versions and widen attack surface." },
};

/**
 * Generates actionable security recommendations
 * Based on missing headers and security configurations
 */
function generateRecommendations(checks) {
  const recommendations = [];

  if (!checks.httpsEnabled) {
    recommendations.push({
      severity: "🔴 High",
      issue: "No HTTPS",
      fix: "Install SSL/TLS certificate and redirect all HTTP traffic to HTTPS",
    });
  }

  if (!checks.headers.contentSecurityPolicy) {
    recommendations.push({
      severity: "🔴 High",
      issue: "Missing Content-Security-Policy",
      fix: 'Add CSP header: Content-Security-Policy: default-src "self"',
    });
  }

  if (!checks.headers.xFrameOptions) {
    recommendations.push({
      severity: "⚠️ Medium",
      issue: "Missing X-Frame-Options",
      fix: "Add X-Frame-Options: DENY to prevent clickjacking attacks",
    });
  }

  if (!checks.headers.xContentTypeOptions) {
    recommendations.push({
      severity: "⚠️ Medium",
      issue: "Missing X-Content-Type-Options",
      fix: "Add X-Content-Type-Options: nosniff to prevent MIME sniffing",
    });
  }

  if (!checks.headers.strictTransportSecurity) {
    recommendations.push({
      severity: "⚠️ Medium",
      issue: "Missing Strict-Transport-Security",
      fix: "Add HSTS header: Strict-Transport-Security: max-age=31536000",
    });
  }

  if (!checks.headers.referrerPolicy) {
    recommendations.push({
      severity: "ℹ️ Low",
      issue: "Missing Referrer-Policy",
      fix: "Add Referrer-Policy: strict-origin-when-cross-origin for privacy",
    });
  }

  if (checks.serverInfoLeakage) {
    recommendations.push({
      severity: "ℹ️ Low",
      issue: "Server Information Leakage",
      fix: "Hide or obfuscate the Server header to reduce information exposure",
    });
  }

  if (checks.robotsExposed) {
    recommendations.push({
      severity: "ℹ️ Low",
      issue: "robots.txt is Accessible",
      fix: "Ensure robots.txt doesn't expose sensitive paths or consider restricting access",
    });
  }

  return recommendations;
}

// ─────────────────────────────────────────────────────────────────
// 🌐 API ROUTES
// ─────────────────────────────────────────────────────────────────

/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "Website Security Scanner API v1.0",
    endpoints: {
      scan: "POST /scan",
      history: "GET /history",
      clear: "POST /clear-history",
    },
  });
});

/**
 * 🔒 MAIN SECURITY SCAN ENDPOINT
 * POST /scan
 * 
 * Request body:
 * { "url": "https://example.com" }
 * 
 * Response: Comprehensive security report with score, issues, and recommendations
 */
app.post("/scan", async (req, res) => {
  const { url } = req.body;

  // ✅ Input validation
  if (!url || typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "URL is required and must be a string",
    });
  }

  const normalizedUrl = normalizeURL(url.trim());

  if (!isValidURL(normalizedUrl)) {
    return res.status(400).json({
      success: false,
      error: "Invalid URL format. Example: https://example.com",
    });
  }

  try {
    // 📊 Initialize checks object
    const checks = {
      httpsEnabled: normalizedUrl.startsWith("https://"),
      headers: {
        contentSecurityPolicy: false,
        strictTransportSecurity: false,
        xFrameOptions: false,
        xContentTypeOptions: false,
        referrerPolicy: false,
      },
      robotsExposed: false,
      serverInfoLeakage: false,
      sslValid: true,
      responseTime: 0,
      statusCode: 0,
      timestamp: new Date().toISOString(),
    };

    // 🌐 Fetch website with timeout and user-agent
    const startTime = Date.now();
    const response = await axios.get(normalizedUrl, {
      timeout: 8000,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "SecurityScanner/1.0 (Website Security Analysis)",
      },
      validateStatus: () => true, // Don't throw on any status code
    });
    checks.responseTime = Date.now() - startTime;
    checks.statusCode = response.status;

    // 📋 Extract and analyze security headers
    const headers = response.headers;
    checks.headers.contentSecurityPolicy =
      !!headers["content-security-policy"];
    checks.headers.strictTransportSecurity = !!headers[
      "strict-transport-security"
    ];
    checks.headers.xFrameOptions = !!headers["x-frame-options"];
    checks.headers.xContentTypeOptions = !!headers["x-content-type-options"];
    checks.headers.referrerPolicy = !!headers["referrer-policy"];

    // 🤖 Check for robots.txt exposure
    try {
      const robotsUrl = new URL("/robots.txt", normalizedUrl).href;
      const robotsResponse = await axios.get(robotsUrl, {
        timeout: 5000,
        validateStatus: () => true,
      });
      checks.robotsExposed = robotsResponse.status === 200;
    } catch (e) {
      checks.robotsExposed = false;
    }

    // 🖥️ Check for server information leakage
    checks.serverInfoLeakage = !!(
      headers["server"] &&
      headers["server"].toLowerCase() !== "hidden"
    );

    // 📈 Calculate security score
    const securityScore = calculateSecurityScore(checks);
    const riskLevel = getRiskLevel(securityScore);
    const grade = getGrade(securityScore);
    const recommendations = generateRecommendations(checks);

    // 📝 Prepare response
    const scanResult = {
      success: true,
      url: normalizedUrl,
      securityScore: securityScore,
      grade: grade,
      owasp: owaspMapping,
      riskLevel: riskLevel,
      timestamp: checks.timestamp,
      responseTime: checks.responseTime,
      statusCode: checks.statusCode,
      checks: {
        https: {
          passed: checks.httpsEnabled,
          label: "HTTPS Enabled",
          description: "Website uses encrypted HTTPS protocol",
        },
        csp: {
          passed: checks.headers.contentSecurityPolicy,
          label: "Content-Security-Policy",
          description: "Prevents XSS attacks by controlling resource loading",
        },
        xFrameOptions: {
          passed: checks.headers.xFrameOptions,
          label: "X-Frame-Options",
          description: "Prevents clickjacking attacks",
        },
        xContentTypeOptions: {
          passed: checks.headers.xContentTypeOptions,
          label: "X-Content-Type-Options",
          description: "Prevents MIME sniffing attacks",
        },
        hsts: {
          passed: checks.headers.strictTransportSecurity,
          label: "Strict-Transport-Security",
          description: "Forces HTTPS connections in the future",
        },
        referrerPolicy: {
          passed: checks.headers.referrerPolicy,
          label: "Referrer-Policy",
          description: "Controls how much referrer information is shared",
        },
        robotsExposed: {
          passed: !checks.robotsExposed,
          label: "robots.txt Not Overly Exposed",
          description: "robots.txt should not reveal sensitive paths",
        },
        serverHiding: {
          passed: !checks.serverInfoLeakage,
          label: "Server Information Hidden",
          description: "Server header should not leak version information",
        },
      },
      recommendations: recommendations,
      summary: {
        total_checks: 8,
        passed_checks: Object.values(checks.headers).filter((v) => v).length +
          (checks.httpsEnabled ? 1 : 0) +
          (!checks.robotsExposed ? 1 : 0) +
          (!checks.serverInfoLeakage ? 1 : 0),
      },
    };

    // 💾 Store in history
    const scanId = Date.now();
    const stored = {
      ...scanResult,
      id: scanId,
    };
    scanHistory.unshift(stored);
    // Keep only last 50 scans
    if (scanHistory.length > 50) {
      scanHistory.pop();
    }

    // Include id in response so frontend can request/download reports
    res.json({ ...scanResult, id: scanId });
  } catch (error) {
    // 🚫 Handle various error scenarios
    let errorMessage = "Unable to reach website";
    let errorCode = 500;

    if (error.code === "ECONNREFUSED") {
      errorMessage = "Connection refused - website is unreachable";
      errorCode = 503;
    } else if (error.code === "ENOTFOUND") {
      errorMessage = "Domain not found - check URL validity";
      errorCode = 404;
    } else if (error.code === "ETIMEDOUT" || error.code === "EHOSTUNREACH") {
      errorMessage = "Request timeout - website is slow or unreachable";
      errorCode = 504;
    } else if (error.message.includes("ERR_TLS")) {
      errorMessage = "SSL/TLS certificate error";
      errorCode = 495;
    }

    res.status(errorCode).json({
      success: false,
      error: errorMessage,
      url: normalizedUrl,
      details: error.message,
    });
  }
});

/**
 * Generate downloadable PDF report for a scan
 * GET /report/:id/pdf
 */
app.get("/report/:id/pdf", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const scan = scanHistory.find((s) => s.id === id);
  if (!scan) {
    return res.status(404).json({ success: false, error: "Scan not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="scan-${id}.pdf"`
  );

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(20).text("Website Security Scan Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`URL: ${scan.url}`);
  doc.text(`Timestamp: ${scan.timestamp}`);
  doc.text(`Security Score: ${scan.securityScore} (${scan.grade})`);
  doc.text(`Risk Level: ${scan.riskLevel}`);
  doc.text(`Response Time: ${scan.responseTime} ms`);
  doc.text(`HTTP Status: ${scan.statusCode}`);
  doc.moveDown();

  doc.fontSize(14).text("Checks:");
  Object.entries(scan.checks).forEach(([key, c]) => {
    doc.moveDown(0.25);
    const status = c.passed ? "PASSED" : "FAILED";
    doc.fontSize(12).text(`${c.label} — ${status}`);
    doc.fontSize(10).fillColor("gray").text(c.description);
    doc.fillColor("black");
    // OWASP mapping if available
    const map = owaspMapping[key] || null;
    if (map) {
      doc.fontSize(10).text(`OWASP: ${map.id} - ${map.title}`);
      doc.fontSize(9).fillColor("gray").text(map.desc);
      doc.fillColor("black");
    }
  });

  if (scan.recommendations && scan.recommendations.length) {
    doc.addPage();
    doc.fontSize(14).text("Recommendations:");
    scan.recommendations.forEach((r, i) => {
      doc.moveDown(0.25);
      doc.fontSize(12).text(`${i + 1}. [${r.severity}] ${r.issue}`);
      doc.fontSize(10).fillColor("gray").text(`Fix: ${r.fix}`);
      doc.fillColor("black");
    });
  }

  doc.end();
});

/**
 * 📜 Get scan history
 * Returns the last 50 scans performed
 */
app.get("/history", (req, res) => {
  res.json({
    success: true,
    count: scanHistory.length,
    history: scanHistory,
  });
});

/**
 * 🗑️ Clear scan history
 * Clears all stored scan results
 */
app.post("/clear-history", (req, res) => {
  const count = scanHistory.length;
  scanHistory.length = 0;
  res.json({
    success: true,
    message: `Cleared ${count} scan records`,
  });
});

// ─────────────────────────────────────────────────────────────────
// 🚀 SERVER START
// ─────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🔒 Website Security Scanner API                           ║
║  Running on http://localhost:${PORT}                       ║
║  Ready to analyze website security configurations         ║
╚════════════════════════════════════════════════════════════╝
  `);
});
