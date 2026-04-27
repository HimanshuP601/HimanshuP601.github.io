---
layout: page
title: "🛰️ Scan2 Challenge — pwn.college"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 🧠 Task

> From your host at `10.0.0.1`, connect to **some unknown remote host** on the `10.0.0.0/16` subnet, on **port 31337**.  
> The goal is to find and connect to the host with that port open.

You're encouraged to use tools like **nmap** instead of a slow manual scan.

---

## 🛠️ Solution

### Step 1: Fast nmap Scan on Port 31337

Use `nmap` to scan the entire `/16` subnet aggressively for port `31337`:

```bash
nmap -n -Pn -p 31337 -T5 \
  --min-rate 5000 --max-retries 2 \
  --max-rtt-timeout 100ms --min-hostgroup 256 \
  10.0.0.0/16
```
### Options Explained:
- -n — No DNS resolution (saves time)
- -Pn — Skip host discovery (treat all hosts as up)
- -p 31337 — Only scan port 31337
- -T5 — Maximum speed (aggressive)
- --min-rate 5000 — Send 5000 probes/second
- --max-retries 2 — Retry failed hosts only twice
- --max-rtt-timeout 100ms — Set low timeout
- --min-hostgroup 256 — Scan hosts in larger groups
- 10.0.0.0/16 — Target subnet

### Output
```bash
Nmap scan report for 10.0.218.100
Host is up (0.000038s latency).

PORT      STATE SERVICE
31337/tcp open  Elite
MAC Address: AE:BE:4F:65:49:D2 (Unknown)
```
### Step 2: Connect via nc
Now connect to that IP (10.0.218.100) and port (31337) using nc:
```bash
nc 10.0.218.100 31337
```
---
## Flag
```
pwn.college{ULakgN_ZuV0gBGuz0cG3yAy_0Nb.QXyYzMzwSM0IzMyEzW}
```
---

