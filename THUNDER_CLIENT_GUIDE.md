# 🧪 THUNDER CLIENT API TESTING GUIDE

Thunder Client is a VS Code extension for testing REST APIs. Perfect for testing this security scanner without needing the frontend.

## 🚀 Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Thunder Client"
4. Install by **Rayan Medsalem**
5. Click "Open Thunder Client" from the activity bar

---

## 📋 Test Cases

### ✅ Test 1: Health Check

**Purpose:** Verify backend is running

**Setup:**
- Method: `GET`
- URL: `http://localhost:5000/`

**Send:** Click the send button

**Expected Response (200):**
```json
{
  "status": "running",
  "message": "Website Security Scanner API v1.0",
  "endpoints": {
    "scan": "POST /scan",
    "history": "GET /history",
    "clear": "POST /clear-history"
  }
}
```

✅ **Success:** Backend is responding correctly

---

### 🔒 Test 2: Scan Google.com

**Purpose:** Test security scanning on a well-secured site

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/scan`
- Headers: 
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "url": "https://google.com"
  }
  ```

**Send Request**

**Expected Response (200):**
```json
{
  "success": true,
  "url": "https://google.com",
  "securityScore": 80-95,
  "riskLevel": "✅ Low",
  "timestamp": "2026-02-05T...",
  "responseTime": 800-2000,
  "statusCode": 200,
  "checks": {
    "https": {"passed": true, ...},
    "csp": {"passed": true, ...},
    ...
  },
  "recommendations": [
    // Few recommendations (well-secured)
  ]
}
```

✅ **Success:** Scanner found strong security configuration

---

### 🔍 Test 3: Scan GitHub.com

**Purpose:** Test on another enterprise-grade site

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/scan`
- Body:
  ```json
  {
    "url": "github.com"
  }
  ```

**Note:** URL doesn't need https:// - backend adds it automatically

**Expected Response:**
```
Score: 75-90
Risk Level: ✅ Low
Recommendations: 1-3 (for further hardening)
```

✅ **Success:** Multiple security headers detected

---

### ❌ Test 4: Invalid URL

**Purpose:** Test input validation

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/scan`
- Body:
  ```json
  {
    "url": "not a valid url !!!!"
  }
  ```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "Invalid URL format. Example: https://example.com"
}
```

✅ **Success:** Invalid input properly rejected

---

### ⚠️ Test 5: Missing URL Parameter

**Purpose:** Test missing input handling

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/scan`
- Body:
  ```json
  {}
  ```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "URL is required and must be a string"
}
```

✅ **Success:** Missing required field caught

---

### 🌐 Test 6: Unreachable Website

**Purpose:** Test error handling for down sites

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/scan`
- Body:
  ```json
  {
    "url": "https://this-site-does-not-exist-12345.com"
  }
  ```

**Expected Response (404):**
```json
{
  "success": false,
  "error": "Domain not found - check URL validity",
  "url": "https://this-site-does-not-exist-12345.com"
}
```

✅ **Success:** Graceful error handling for non-existent domains

---

### 📜 Test 7: Get History

**Purpose:** Retrieve all previous scans

**Setup:**
- Method: `GET`
- URL: `http://localhost:5000/history`
- Body: (empty)

**Send Request**

**Expected Response (200):**
```json
{
  "success": true,
  "count": 5,
  "history": [
    {
      "id": 1675234200000,
      "url": "https://google.com",
      "securityScore": 85,
      "riskLevel": "✅ Low",
      "timestamp": "2026-02-05T10:30:00.000Z",
      ...
    }
    // ... more scans
  ]
}
```

✅ **Success:** History contains all previous scans

---

### 🗑️ Test 8: Clear History

**Purpose:** Delete all scan records

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/clear-history`
- Body: (empty)

**Send Request**

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Cleared 5 scan records"
}
```

**Verify:** Run Test 7 again (History should be empty)

✅ **Success:** History successfully cleared

---

## 🔄 Complete Test Sequence

Follow this order to test the entire API:

1. ✅ **Health Check** → Confirm backend running
2. 🔒 **Scan Google.com** → Test normal scan
3. 🔍 **Scan GitHub.com** → Test another site
4. ❌ **Invalid URL** → Test validation
5. ⚠️ **Missing Parameter** → Test error handling
6. 🌐 **Unreachable Site** → Test network errors
7. 📜 **Get History** → Verify scans stored
8. 🗑️ **Clear History** → Test cleanup

---

## 📊 Response Analysis

### Success Response (Status 200)
```
✅ "success": true           ← Scan completed successfully
✅ "securityScore": number   ← 0-100 score
✅ "checks": {...}           ← Individual security checks
✅ "recommendations": [...]  ← Actionable suggestions
```

### Error Response (Status 4xx/5xx)
```
❌ "success": false          ← Scan failed
❌ "error": string           ← Human-readable error message
❌ "details": string         ← Technical error details
```

---

## 🎯 Understanding Response Fields

### Security Score (0-100)
```
80-100  → ✅ Low Risk (Strong security)
60-79   → ⚠️ Medium Risk (Some gaps)
0-59    → 🔴 High Risk (Vulnerabilities present)
```

### Response Time (milliseconds)
```
< 500ms    → Excellent (very fast)
500-1000ms → Good (normal)
1000-2000ms → Acceptable (slower)
> 2000ms    → Slow (optimization needed)
```

### HTTP Status Code
```
200 → OK (Website is up)
301 → Redirect (Following chain)
404 → Not Found (Page doesn't exist)
500 → Server Error (Website problem)
503 → Service Unavailable (Website down)
```

---

## 💡 Pro Tips

### Tip 1: Save Your Tests
Thunder Client lets you save test collections:
1. Click "Save" button after creating each test
2. Name it (e.g., "Security Scanner - Healthy Site")
3. Reuse tests later

### Tip 2: Use Environment Variables
Create an env variable for the URL:
```
Variable: BASE_URL = http://localhost:5000

Use: {{BASE_URL}}/scan
```

### Tip 3: Test Different URL Formats
```json
// All work (backend normalizes them)
{"url": "google.com"}
{"url": "https://google.com"}
{"url": "http://google.com"}
{"url": "www.google.com"}
```

### Tip 4: Bulk Testing Sites
Test your scanner on:
- github.com (enterprise)
- amazon.com (e-commerce)
- medium.com (media)
- stackoverflow.com (dev)
- twitter.com (social)
- wikipedia.org (nonprofit)

---

## 🔍 Debugging Tips

### Issue: "Connection refused"
```
✓ Check backend is running: npm start
✓ Verify port 5000 is being used
✓ Check firewall isn't blocking
```

### Issue: Timeout errors
```
✓ Website might be slow
✓ Your internet might be slow
✓ Increase timeout in index.js
```

### Issue: Unexpected error response
```
✓ Check backend console for errors
✓ Verify JSON format is correct
✓ Check for typos in URL
```

---

## 📈 Test Coverage Summary

| Test | Category | Coverage |
|------|----------|----------|
| Health Check | API | Server status ✅ |
| Valid Scan | Security | Normal operation ✅ |
| Multiple Scans | Feature | Scan history ✅ |
| Invalid URL | Validation | Input validation ✅ |
| Missing Param | Validation | Required fields ✅ |
| Unreachable | Error Handling | Network errors ✅ |
| Get History | API | History retrieval ✅ |
| Clear History | API | Data management ✅ |

**Overall Coverage:** 100% of main endpoints

---

## 🎓 Learning from Results

When you scan different websites, notice:

**Secure Sites (Score 80+):**
- Have HTTPS
- Set CSP headers
- Include HSTS
- Hide server info

**Insecure Sites (Score < 60):**
- Missing HTTPS
- No security headers
- Expose server version
- Vulnerable to XSS

**Mixed Sites (Score 60-79):**
- Good foundation but missing some headers
- Security awareness present but incomplete

---

## 📝 Sample Test Report

Save this template after testing:

```
═══════════════════════════════════════════════════
📊 SECURITY SCANNER TEST REPORT
═══════════════════════════════════════════════════

Date: February 5, 2026
Tester: Your Name
Scope: Website Security Scanner API v1.0

TESTS PASSED: 8/8 ✅

1. Health Check........................ PASS ✅
2. Scan Google.com..................... PASS ✅
3. Scan GitHub.com..................... PASS ✅
4. Invalid URL Validation.............. PASS ✅
5. Missing Parameter Handling.......... PASS ✅
6. Unreachable Website Handling........ PASS ✅
7. History Retrieval................... PASS ✅
8. History Clearing.................... PASS ✅

OBSERVATIONS:
- Backend responds quickly (avg 500-1200ms)
- Error handling is comprehensive
- All security checks execute successfully
- History persistence works correctly

RECOMMENDED ACTIONS:
- ✅ Ready for production
- Consider adding database for persistence
- Add rate limiting for production use

═══════════════════════════════════════════════════
```

---

**Happy Testing! 🔒**

Use these tests to verify the scanner works perfectly before showing it to clients or adding it to your portfolio.
