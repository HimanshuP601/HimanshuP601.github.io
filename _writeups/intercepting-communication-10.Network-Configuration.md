---
layout: page
title: "Network-Configuration 🌐🔧"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Task Description

**Challenge Name:** Network-Configuration  
**Platform:** pwn.college  
**Goal:** Configure the network interface on your machine so that a remote host (`10.0.0.2`) can communicate with another remote host (`10.0.0.3`) on port `31337`.

---

## 🔍 Reconnaissance

We begin by inspecting the challenge script:

```bash
root@ip-10-0-0-1:~# cat /challenge/run
```
### Key points:
- A ClientHost (10.0.0.2) continuously tries to send the flag to 10.0.0.3 on port 31337.
- But 10.0.0.3 is not yet part of the network.
- The current network consists only of:
    - 10.0.0.1 (us)
    - 10.0.0.2 (client trying to send data)
We must:
- Assign 10.0.0.3 to our own interface.
- Listen on port 31337.
---

## Exploitation: Configuring the Interface

### Step 1: Assign IP 10.0.0.3 to our interface (eth0)
```bash
ip addr add 10.0.0.3/24 dev eth0
```
### Step 2: Start a listener on port 31337
```bash
nc -l 31337
```
We successfully receive the flag:
```bash
pwn.college{YmPg1kNfS-SrduJdfqnUSDnzRGc.QX1YzMzwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{YmPg1kNfS-SrduJdfqnUSDnzRGc.QX1YzMzwSM0IzMyEzW}
```
---


