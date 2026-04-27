---
layout: page
title: "🤝 TCP Three-Way Handshake — pwn.college"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task

**Objective:**  
Manually perform a TCP handshake with:

- **Source Port:** `31337`
- **Destination Port:** `31337`
- **Initial Sequence Number:** `31337`
- **Destination IP:** `10.0.0.2`

---

## 🔧 Packet Flow

| Packet   | Flags  | Fields                       |
|----------|--------|------------------------------|
| SYN      | `'S'`  | `seq = x`                    |
| SYN-ACK  | `'SA'` | `seq = y`, `ack = x + 1`     |
| ACK      | `'A'`  | `seq = x + 1`, `ack = y + 1` |

---

## 🧪 Solution using Scapy

```python
>>> from scapy.all import *

>>> port = 31337
>>> t_ip = "10.0.0.2"

# Step 1: Send SYN
>>> syn = IP(dst=t_ip)/TCP(dport=port, sport=port, flags='S', seq=31337)

# Step 2: Receive SYN-ACK
>>> synack = sr1(syn)

# Step 3: Send ACK
>>> ack = IP(dst=t_ip)/TCP(dport=port, sport=port, flags='A', seq=syn.seq + 1, ack=synack.seq + 1)
>>> send(ack)
.
Sent 1 packets.
```

---

## Flag
```
pwn.college{8yDXHISTkr5Byf9rT4RgjEcscFy.QX5YzMzwSM0IzMyEzW}
```
---
