---
layout: page
title: "📡 Ethernet — pwn.college"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task
**Goal:** Manually send an Ethernet packet with `EtherType = 0xFFFF` to the remote host `10.0.0.2`.

---

## 🖥️ Environment

```bash
ip a
```
Output:
```bash
3: eth0@if4: <BROADCAST,MULTICAST,UP,LOWER_UP> ...
    link/ether 7a:85:31:e7:b3:81 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.1/24 ...
```
Your Ethernet (MAC) address is: 7a:85:31:e7:b3:81

### Step 1: Identify Destination MAC Address
```bash
>>> arping("10.0.0.2")
```
Result:
```bash
Received 1 packets
src                psrc
12:03:30:2f:d8:4e  10.0.0.2
```

### Step 2: Craft the Ethernet Packet 
```bash
>>> pkt = Ether(src="7a:85:31:e7:b3:81", dst="12:03:30:2f:d8:4e", type=0xFFFF)
```

### Step 3: Send the Packet
```bash
>>> sendp(pkt, iface="eth0")
```
Output:

```
Sent 1 packets.
```
---

##  Flag
```
pwn.college{YZChcjgmSIXVrWICQ_zO2t7erdq.QX2YzMzwSM0IzMyEzW}
```
---

