---
layout: page
title: "🔍 Scan1 Challenge"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task

From your host at `10.0.0.1`, connect to some unknown remote host on the `10.0.0.0/24` subnet, on **port 31337**.

> Tip: Use `ping` to discover which hosts are up, then use `nc` to connect to them.

---

## 🛠️ Solution

### 1. Create a script to ping all IPs in the subnet

We write a shell script to scan the range `10.0.0.1` to `10.0.0.254`:

```bash
#!/bin/bash

max_jobs=20
job_count=0

for i in $(seq 1 254); do
  ip="10.0.0.$i"

  # Run ping in background
  (ping -c 1 -W 1 "$ip" &> /dev/null && echo "$ip is up") &

  # Increment job count
  ((job_count++))

  # Wait every max_jobs
  if (( job_count % max_jobs == 0 )); then
    wait
  fi
done

# Final wait in case remaining jobs are still running
wait
```
### 2. Save, make executable, and run it

```bash
root@ip-10-0-0-1:~# chmod +x scan1.sh
root@ip-10-0-0-1:~# ./scan1.sh
10.0.0.1 is up
10.0.0.138 is up
```
### 3. Connect to the discovered host
Once a live host (e.g., 10.0.0.138) is found, connect using nc:
```bash
root@ip-10-0-0-1:~# nc 10.0.0.138 31337
pwn.college{8lRmSBr0myUIjhEL7suZYIMOzTx.QXxYzMzwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{8lRmSBr0myUIjhEL7suZYIMOzTx.QXxYzMzwSM0IzMyEzW}
```
---
