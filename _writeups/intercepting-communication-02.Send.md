---
layout: page
title: "🌐 Connect – Message Sending (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📌 Task

From your host at `10.0.0.1`, connect to the remote host at `10.0.0.2` on port `31337`, and **send the message**: Hello, World!


You're instructed to use **netcat (nc)**. Unlike before, this time you **must send a message** to receive the flag.

---

## 🧠 Understanding the Setup

- You're communicating with a TCP server that expects **input** from the client.
- Netcat allows you to send input directly via typing or piping.
- Once the message is sent (by pressing Enter), the server will respond with a flag.

> 💡 Netcat will appear to hang after sending; press `Ctrl-C` to quit once the flag is received.

---

## 🔍 How We Interact

Steps:
1. Use `nc 10.0.0.2 31337` to connect.
2. Type `Hello, World!` and press **Enter** to send.
3. The server replies with the flag.
4. Press `Ctrl-C` to exit the session.

---

## 🧪 Final Commands

```bash
root@ip-10-0-0-1:~# nc 10.0.0.2 31337
Hello, World!
pwn.college{MH6peE0k7_KJk4VdkeopEh9NfZ0.0VNyAjNxwSM0IzMyEzW}
^C
root@ip-10-0-0-1:~#
```
### Output
```
pwn.college{MH6peE0k7_KJk4VdkeopEh9NfZ0.0VNyAjNxwSM0IzMyEzW}
```

---

## Flag
```
pwn.college{MH6peE0k7_KJk4VdkeopEh9NfZ0.0VNyAjNxwSM0IzMyEzW}
```
---

