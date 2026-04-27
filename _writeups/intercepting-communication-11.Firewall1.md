---
layout: page
title: "Firewall1 🔥🧱"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Task Description

**Challenge Name:** Firewall1  
**Platform:** pwn.college  
**Goal:** Your host at `10.0.0.1` is receiving traffic on port `31337`. Block that traffic.

---

## 🔍 Reconnaissance

Inspecting `/challenge/run`:

```bash
root@ip-10-0-0-1:~# cat /challenge/run
```
### Key Observations:
- A ClientHost (10.0.0.2) repeatedly sends TCP messages to our host (10.0.0.1) on port 31337.
- A watchdog on the server checks if no connections have been received for more than 2 seconds.
- If the server receives no traffic for 2 seconds, it prints the flag.
So our goal is simple: block incoming TCP traffic on port 31337 to trigger the watchdog and get the flag.
---

## Exploitation: Block the Traffic with iptables

### Step 1: Try blocking with iptables
```bash
iptables -A INPUT -p tcp --dport 31337 -j DROP
```
Success! The traffic is blocked, and after ~2 seconds:
```
pwn.college{MIWxO03OpMWCAVRnO2ogfkMxSAg.0FO0AjNxwSM0IzMyEzW}
```

---

## Flag
```
pwn.college{MIWxO03OpMWCAVRnO2ogfkMxSAg.0FO0AjNxwSM0IzMyEzW}
```
---
