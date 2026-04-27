---
layout: page
title: "Firewall2 🔥🧱🎯"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Task Description

**Challenge Name:** Firewall2  
**Platform:** pwn.college  
**Goal:** Your host at `10.0.0.1` is receiving traffic on port `31337`.  
Block **only** the traffic from `10.0.0.3`, while continuing to allow traffic from `10.0.0.2`.

---

## 🔍 Reconnaissance

Inspecting the challenge logic from `/challenge/run`:

```bash
root@ip-10-0-0-1:~# cat /challenge/run
```
### Key Logic:
- Two client hosts:
    - 10.0.0.2 - should remain allowed
    - 10.0.0.3 - must be blocked
- The server:
    - Tracks the last connection time from both IPs.
    - If 10.0.0.2 is active (connected within 2 seconds) and
10.0.0.3 is silent (no connection in 2 seconds), it reveals the flag.

So the goal is to block 10.0.0.3, while allowing 10.0.0.2.

---

### Exploitation: Selective Traffic Filtering with iptables
To block only 10.0.0.3 on port 31337, use:
```bash
iptables -A INPUT -s 10.0.0.3 -p tcp --dport 31337 -j DROP
```
```
pwn.college{c8j4FuuJ_RjQCrfC3hmDM6NtfeZ.0VO0AjNxwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{c8j4FuuJ_RjQCrfC3hmDM6NtfeZ.0VO0AjNxwSM0IzMyEzW}
```
---

