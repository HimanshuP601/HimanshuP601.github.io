---
layout: page
title: "🔊 Challenge: Listen"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


**Task:**  
From your host at `10.0.0.1`, listen on **port `31337`** for a connection from the remote host at `10.0.0.2`.

---

## 🧠 Understanding the Challenge

In networking, one host **listens** on a port, and the other **connects** to it. This challenge tests your ability to set up a listener using `netcat`, allowing a remote host to connect to you.

- This is the reverse of the usual connection setup.
- Once the connection is established, it becomes **bidirectional** (both sides can send/receive data).

---

## 🛠️ Solution with Netcat

We use the `-l` option to make `nc` **listen** on the given port.

### ✅ Command:

```bash
nc -l 31337
```
This command makes your system listen for incoming TCP connections on port 31337.

### Example Output
```
root@ip-10-0-0-1:~# nc -l 31337
pwn.college{0h540UntOHZbNDCltCqzci-c4YR.QXwYzMzwSM0IzMyEzW}
root@ip-10-0-0-1:~#
```
---
