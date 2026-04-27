---
layout: page
title: "Firewall3 🔥📤🧱"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Task Description

**Challenge Name:** Firewall3  
**Platform:** pwn.college  
**Goal:** From your host at `10.0.0.1`, connect to the remote host at `10.0.0.2` on port `31337`.  
However, outbound traffic to port `31337` is currently **blocked** by a firewall rule.

---

## 🔍 Reconnaissance

Inspect the challenge logic from `/challenge/run`:

```bash
root@ip-10-0-0-1:~# cat /challenge/run
```
- A drop_packets(31337) function uses iptables to block outgoing TCP traffic to port 31337:
```
iptables -A OUTPUT -p tcp --dport 31337 -j DROP
```
- The server (10.0.0.2) listens on port 31337 and sends the flag if it receives a connection.
- You are required to remove the outbound firewall rule and then connect.


---
## Exploitation: Unblock Outbound Port 31337
### Step 1: Flush the OUTPUT chain to remove the blocking rule
```bash
iptables -F OUTPUT
```
### Step 2: Connect to the server
```bash
nc 10.0.0.2 31337
```
Successful output:
```
pwn.college{U9e7ao4glbM9Yew3MCVWPwDf7KC.0FM1AjNxwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{U9e7ao4glbM9Yew3MCVWPwDf7KC.0FM1AjNxwSM0IzMyEzW}
```
---
