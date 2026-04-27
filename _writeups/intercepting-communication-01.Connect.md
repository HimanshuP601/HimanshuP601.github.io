---
layout: page
title: "🌐 Connect – Writeup (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📌 Challenge Summary

You're placed at `10.0.0.1` and must connect to a **remote server** at `10.0.0.2` on **port 31337**.

This challenge tests basic understanding of **TCP client connections**. The server simply listens and sends back a flag upon connection.

---

## 🧠 Understanding the Setup

The provided Python code inside `/challenge/run`:

```python
import socket

class ServerHost(Host):
    def entrypoint(self):
        server_socket = socket.socket()
        server_socket.bind(("0.0.0.0", 31337))
        server_socket.listen()
        while True:
            try:
                connection, _ = server_socket.accept()
                connection.sendall(flag.encode())
                connection.close()
            except ConnectionError:
                continue
```
- The server binds to 0.0.0.0:31337.
- When a client connects, it sends the flag and closes the connection.

### How We Exploit It
There is no exploit needed — just use Netcat (nc) to connect.
```bash
nc 10.0.0.2 31337
```
### Final Exploit Command
```bash
root@ip-10-0-0-1:~# nc 10.0.0.2 31337
pwn.college{gg1HJhGCkcntOmNvNCXZK6pp_wK.QX5UzMzwSM0IzMyEzW}
```
### Output
```
pwn.college{gg1HJhGCkcntOmNvNCXZK6pp_wK.QX5UzMzwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{gg1HJhGCkcntOmNvNCXZK6pp_wK.QX5UzMzwSM0IzMyEzW}
```
---
