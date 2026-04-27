---
layout: page
title: "🌐 Internet Protocol Packet — pwn.college"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task

**Objective:**  
Manually send an Internet Protocol (IP) packet with:

- **Destination:** `10.0.0.2`
- **Protocol:** `0xFF`

---

## 🧪 Step-by-Step Solution

```
root@ip-10-0-0-1:~# scapy -H
Welcome to Scapy (2.6.1) using IPython 8.29.0
```
### Build the Packet
```bash
>>> pkt = Ether()/IP(dst="10.0.0.2", proto=0xFF)
```

### Send the Packet
```bash
>>> sendp(pkt, iface="eth0")
.
Sent 1 packets.
```
---

## Flag
```
pwn.college{g6sd4Uy4ZegIbA9Y9ZKiEdLhuvX.QX3YzMzwSM0IzMyEzW}
```
---
