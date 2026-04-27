---
layout: page
title: "🔌 Transmission Control Protocol Packet — pwn.college"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task

**Objective:**  
Manually send a TCP packet with:

- **Source Port:** `31337`
- **Destination Port:** `31337`
- **Sequence Number:** `31337`
- **Acknowledgment Number:** `31337`
- **TCP Flags:** `A`, `P`, `R`, `S`, `F` (i.e., `APRSF`)
- **Destination IP:** `10.0.0.2`

---

## 🧪 Solution using Scapy

### 🧱 Build the Packet

```python
>>> pkt = Ether()/IP(dst='10.0.0.2')/TCP(sport=31337, dport=31337, seq=31337, ack=31337, flags='APRSF')
```
### Send the Packet
```bash
>>> sendp(pkt, iface="eth0")
.
Sent 1 packets.
```
---
## Flag
```bash
pwn.college{YTwIVXPhNyKkQ0tIGJ0vu3vF_KK.QX4YzMzwSM0IzMyEzW}
```
---
