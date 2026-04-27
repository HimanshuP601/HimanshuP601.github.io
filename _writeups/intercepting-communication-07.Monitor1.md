---
layout: page
title: "Monitor1 - Monitor Traffic from a Remote Host"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task Description
**Objective:**  
Monitor traffic from a remote host. Your host is already receiving traffic on **port 31337**.

**Hint Provided:**  
Use **Wireshark** from the terminal on `10.0.0.1`. Running it elsewhere will not capture the correct traffic. Alternatively, `tshark` can be used for faster command-line inspection.

---

## 🛠️ Tools Used
- **tshark**: Terminal-based version of Wireshark.
- **Filter Used**: `port 31337`
- **Interface**: `eth0`
- **Command**:
```bash
  tshark -i eth0 -f 'port 31337' -x
```

### Packet Capture
Example output from tshark:
```
0000  b6 29 23 15 26 54 be 67 65 59 14 e3 08 00 45 00   .)#.&T.geY....E.
...
0040  9f fa 70 77 6e 2e 63 6f 6c 6c 65 67 65 7b 4d 71   ..pwn.college{Mq
0050  30 77 56 76 4d 54 30 78 46 67 4e 34 55 4f 50 45   0wVvMT0xFgN4UOPE
0060  7a 5f 58 54 61 6e 32 61 69 2e 51 58 7a 59 7a 4d   z_XTan2ai.QXzYzM
0070  7a 77 53 4d 30 49 7a 4d 79 45 7a 57 7d 0a         zwSM0IzMyEzW}.
```
### Flag Found
The payload in one of the TCP packets contains the flag in ASCII:
```
pwn.college{Mq0wVvMT0xFgN4UOPEz_XTan2ai.QXzYzMzwSM0IzMyEzW}
```
---
