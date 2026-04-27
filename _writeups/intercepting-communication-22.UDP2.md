---
layout: page
title: "📡 UDP2 – 'Set the Source Port'"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task

In this challenge, you're still working with UDP, but now there's a twist:  
You're **required to send your message from a specific source port**, not just the default random one.

> **Goal:**  
> From your host at `10.0.0.1`, send `Hello, World!\n` to `10.0.0.2:31337`, but **your source port must be 31338**.

The server only replies if it receives the message **from UDP port 31338**.

---

## 🧠 Background: UDP Source Ports

Normally when you send a UDP message, Linux picks a random source port unless you bind one explicitly.

### Key Concept:
```python
s.bind(('', <SOURCE_PORT>))
```
This tells your OS to use the given port when sending data.

---

## Server Code Analysis (/challenge/run)
```bash
server_socket.bind(("0.0.0.0", 31337))  # Server listening on UDP port 31337

client_message, (client_host, client_port) = server_socket.recvfrom(1024)

# Only responds if:
if client_port == 31338 and client_message == b"Hello, World!\n":
    server_socket.sendto(flag.encode(), (client_host, client_port))
```
So we must:
- Use destination port 31337
- Use source port 31338
- Send exactly Hello, World!\n

### Solution (Python)
```python
# udp2.py
import socket

t_ip = '10.0.0.2'      # Target IP (server)
dport = 31337          # Destination port (server)
sport = 31338          # Required source port

msg = b"Hello, World!\n"

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.bind(('', sport))                      # Set the source port
    s.sendto(msg, (t_ip, dport))             # Send message to server
    data, _ = s.recvfrom(1024)               # Wait for flag
    print("Flag:", data.decode())
```
---
## Flag
```
Flag: pwn.college{Itc0GGKtQ7BdQvxVo_g7qra2S89.01M0AjNxwSM0IzMyEzW}

```
---
