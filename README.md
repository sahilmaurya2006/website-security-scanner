# 🔒 Website Security Scanner

A professional, production-ready web application for analyzing website security configurations. Perfect for cybersecurity portfolios, internships, and freelance clients.

## 📋 Features

### Backend Security Analysis
- ✅ **HTTPS/TLS Detection** - Verifies secure connections
- ✅ **Security Headers Check** - Analyzes 6 critical headers
- ✅ **Response Metrics** - Tracks response time and status codes
- ✅ **robots.txt Analysis** - Detects information exposure
- ✅ **Server Banner Check** - Identifies version leakage
- ✅ **Dynamic Scoring** - 0-100 point security score
- ✅ **Smart Recommendations** - Actionable fix suggestions
- ✅ **Scan History** - In-memory storage of last 50 scans
- ✅ **Error Handling** - Detailed error messages for debugging

### Frontend User Interface
- 🎨 **Dark Modern Theme** - Professional cybersecurity aesthetic
- 📱 **Fully Responsive** - Works on desktop, tablet, mobile
- ⚡ **Real-time Feedback** - Loading states and instant results
- 📊 **Visual Score Display** - Clear security metrics
- 💡 **Recommendations Panel** - Priority-based security tips
- 📜 **Scan History** - Click to view previous scans
- 🔍 **URL Input Validation** - Handles all URL formats

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client for website requests
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - UI framework
- **Axios** - API communication
- **CSS3** - Modern styling with gradients

## 📁 Project Structure

```
website-security-scanner/
├── server/                          # Backend
│   ├── index.js                     # Main Express app with security logic
│   └── package.json                 # Backend dependencies
│
├── client/                          # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scanner.js          # URL input component
│   │   │   ├── Results.js          # Results display component
│   │   │   └── History.js          # Scan history component
│   │   ├── App.js                  # Main app logic
│   │   ├── App.css                 # Global styles
│   │   └── index.js                # React entry point
│   ├── public/
│   │   └── index.html              # HTML template
│   └── package.json                # Frontend dependencies
│
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. **Install Backend Dependencies**
```bash
cd server
npm install
```

2. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

### Running the Application

**Terminal 1 - Start Backend**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend**
```bash
cd client
npm start
# Frontend opens on http://localhost:3000
```

## 🔒 Security Checks Explained

### 1. HTTPS Enabled (20 points)
**Why it matters:** HTTPS encrypts data in transit, preventing man-in-the-middle (MITM) attacks where attackers intercept communication.
```
⚡ Impact: Protects sensitive user data
```

### 2. Content-Security-Policy (20 points)
**Why it matters:** CSP prevents XSS (Cross-Site Scripting) attacks by controlling which resources browsers can load.
```
⚡ Impact: Blocks malicious scripts from running
```

### 3. X-Frame-Options (15 points)
**Why it matters:** Prevents clickjacking - attackers embedding your site in invisible frames to trick users.
```
⚡ Impact: Protects against UI redress attacks
```

### 4. X-Content-Type-Options (15 points)
**Why it matters:** Prevents MIME sniffing, where browsers execute files as different types (e.g., .txt as .js).
```
⚡ Impact: Stops drive-by downloads
```

### 5. Strict-Transport-Security (15 points)
**Why it matters:** Forces HTTPS for all future connections, preventing downgrade attacks.
```
⚡ Impact: Ensures encrypted connections
```

### 6. Referrer-Policy (10 points)
**Why it matters:** Controls how much referrer information is shared, protecting user privacy.
```
⚡ Impact: Prevents data leakage through referrer headers
```

### 7. robots.txt Exposure (5 points)
**Why it matters:** If misconfigured, can reveal sensitive admin paths and API endpoints.
```
⚡ Impact: Prevents reconnaissance by attackers
```

### 8. Server Information Hiding (5 points)
**Why it matters:** Server banners leak version info, allowing attackers to target known vulnerabilities.
```
⚡ Impact: Reduces attack surface through information gathering
```

## 📊 Security Score Interpretation

| Score | Risk Level | Meaning |
|-------|-----------|---------|
| 80-100 | ✅ Low | Website has strong security fundamentals |
| 60-79 | ⚠️ Medium | Some security gaps should be addressed |
| 0-59 | 🔴 High | Critical vulnerabilities need immediate attention |

## 🔌 API Endpoints

### POST /scan
Scan a website for security issues.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "securityScore": 75,
  "riskLevel": "⚠️ Medium",
  "timestamp": "2026-02-05T10:30:00.000Z",
  "responseTime": 1234,
  "statusCode": 200,
  "checks": {
    "https": { "passed": true, "label": "HTTPS Enabled", ... },
    "csp": { "passed": false, "label": "Content-Security-Policy", ... }
  },
  "recommendations": [
    {
      "severity": "🔴 High",
      "issue": "Missing Content-Security-Policy",
      "fix": "Add CSP header..."
    }
  ]
}
```

### GET /history
Get all previous scans.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "history": [...]
}
```

### POST /clear-history
Clear all scan records.

## 🧪 Testing with Thunder Client

1. Open Thunder Client in VS Code
2. Create a new request:
   - Method: **POST**
   - URL: `http://localhost:5000/scan`
   - Body (JSON):
   ```json
   {
     "url": "https://github.com"
   }
   ```
3. Send and view the security report

## 💡 Example Scan Results

**Scanning google.com:**
- HTTPS: ✅ Enabled
- CSP: ✅ Present
- X-Frame-Options: ✅ DENY
- X-Content-Type-Options: ✅ nosniff
- HSTS: ✅ Enabled
- Referrer-Policy: ✅ Present
- Score: **95/100** - ✅ Low Risk

**Scanning a local test site:**
- HTTPS: ❌ HTTP only
- CSP: ❌ Missing
- X-Frame-Options: ❌ Missing
- Score: **30/100** - 🔴 High Risk

## 🎯 Use Cases

### For Internships
- Demonstrates full-stack development skills
- Shows security awareness
- Production-quality code
- Professional UI/UX

### For Freelance Clients
- Scan their websites before offering services
- Provide security reports for tech-savvy clients
- Educational tool for website owners
- Baseline security audits

### For Portfolio
- Showcase cybersecurity knowledge
- Demonstrate React + Node.js expertise
- Clean code and documentation
- Modern responsive design

## 🔐 Security Best Practices Implemented

```javascript
// 1. Input Validation
if (!url || !isValidURL(url)) {
  return res.status(400).json({ error: "Invalid URL" });
}

// 2. Secure Headers Analysis
const csp = headers["content-security-policy"];
const xFrameOptions = headers["x-frame-options"];

// 3. Error Handling
try {
  const response = await axios.get(url, { timeout: 8000 });
} catch (error) {
  // Detailed error messages without leaking internals
}

// 4. Rate Limiting Ready (can be added with express-rate-limit)
// 5. CORS Enabled for cross-origin requests
```

## 📈 Future Enhancements

- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Rate limiting
- [ ] Advanced vulnerability scanning
- [ ] SSL certificate validation
- [ ] Cookie analysis
- [ ] JavaScript execution for DOM analysis
- [ ] Comprehensive PDF reports
- [ ] Scheduling automated scans
- [ ] Email notifications
- [ ] Compliance checking (GDPR, PCI-DSS)
- [ ] Slack/Webhook integrations

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process or use different port
$env:PORT=5001; npm start
```

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:5000
- Check CORS is enabled
- Verify firewall settings

### Timeout errors for slow websites
- Increase timeout in `index.js` (currently 8 seconds)
- Consider implementing background processing

## 📝 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Made with 🔒 for cybersecurity professionals and developers**
