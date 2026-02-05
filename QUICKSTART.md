# 🚀 QUICK START GUIDE

## Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
npm run install-all
```

This will install dependencies for both backend and frontend.

---

## Step 2: Start the Backend

Open a PowerShell terminal and navigate to the server folder:

```powershell
cd server
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  🔒 Website Security Scanner API                           ║
║  Running on http://localhost:5000                          ║
╚════════════════════════════════════════════════════════════╝
```

---

## Step 3: Start the Frontend

Open another PowerShell terminal and navigate to the client folder:

```powershell
cd client
npm start
```

The React app will automatically open in your browser at `http://localhost:3000`

---

## Step 4: Test It Out!

1. **In the Scanner Interface**, enter a URL:
   - `github.com`
   - `google.com`
   - `amazon.com`
   - Or your own website

2. **Click "Scan Website"** and wait for results

3. **View the Security Report**:
   - Security score (0-100)
   - Passed/failed checks
   - Specific recommendations

4. **Check History** to see previous scans

---

## 🧪 Testing with Thunder Client (Optional)

If you prefer to test the API directly:

1. Install Thunder Client extension in VS Code
2. Create a new request:
   ```
   Method: POST
   URL: http://localhost:5000/scan
   Body (JSON):
   {
     "url": "https://example.com"
   }
   ```
3. Click Send to see the raw API response

---

## 📋 Architecture Overview

```
USER INTERFACE (React)
    ↓
HTTP Request → POST /scan
    ↓
BACKEND (Node.js/Express)
    ↓
[URL Validation]
    ↓
[Fetch Website + Headers]
    ↓
[Security Analysis]
  - Check HTTPS
  - Analyze Security Headers
  - Calculate Score
  - Generate Recommendations
    ↓
JSON Response
    ↓
Display Results (React)
```

---

## 🔐 What Gets Checked

1. **HTTPS Status** - Is the site encrypted?
2. **Content-Security-Policy** - XSS protection
3. **X-Frame-Options** - Clickjacking protection
4. **X-Content-Type-Options** - MIME sniffing prevention
5. **Strict-Transport-Security** - HTTPS enforcement
6. **Referrer-Policy** - Privacy protection
7. **robots.txt Exposure** - Information leakage
8. **Server Banner** - Version information hiding

---

## 💡 Security Concepts Simplified

### HTTPS (TLS/SSL)
- Encrypts data so only your browser and the server can read it
- Without it: Hackers can spy on your passwords and credit cards

### Security Headers
- Instructions sent from the server to your browser
- They say: "Block popups," "No clickjacking," "No MIME sniffing"
- Think of them as security rules for your browser

### XSS (Cross-Site Scripting)
- Attackers inject malicious JavaScript
- CSP header prevents this by controlling which scripts can run

### Clickjacking
- Attacker hides the real website behind a fake one
- X-Frame-Options header prevents the site from being embedded

---

## 🐛 Troubleshooting

### Error: "Server is not responding"
- Make sure backend is running: `cd server && npm start`
- Check it's running on http://localhost:5000
- Try restarting the backend

### Error: "Invalid URL provided"
- Make sure the URL is valid (e.g., google.com or https://example.com)
- Don't include https:// if not needed - it adds it automatically

### Website returns 404 or timeout
- The website might be blocking automated requests
- Try scanning a public website like google.com first
- Some sites require specific User-Agent headers

### Port already in use
```powershell
# Change the port in server/index.js or set environment variable
$env:PORT=5001
npm start
```

---

## 📚 Learning Resources

### Security Headers
- [OWASP: Security Headers](https://owasp.org/www-community/attacks)
- [MDN: HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

### Node.js & Express
- [Express.js Guide](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)

### React
- [React Documentation](https://react.dev/)
- [Hooks Guide](https://react.dev/reference/react)

---

## ✨ Next Steps

Once you understand the basics:

1. **Add more security checks**:
   - SSL certificate validation
   - Cookie analysis
   - JavaScript frameworks detection

2. **Improve the UI**:
   - Add charts for score visualization
   - Export PDF reports
   - Dark/light mode toggle

3. **Scale it up**:
   - Add database (MongoDB)
   - User authentication
   - Email notifications
   - Scheduled scans

4. **Deploy**:
   - Backend: Heroku, Render, Railway
   - Frontend: Vercel, Netlify, GitHub Pages

---

## 🎯 Interview Tips

When explaining this project:

**"This is a full-stack security scanner that analyzes website configurations for vulnerabilities. The backend uses Express to fetch websites and analyze their security headers, calculating a score based on industry best practices. The frontend is built with React for a modern, responsive user experience. It demonstrates knowledge of cybersecurity concepts, full-stack development, and clean code practices."**

---

**Happy Scanning! 🔒**
