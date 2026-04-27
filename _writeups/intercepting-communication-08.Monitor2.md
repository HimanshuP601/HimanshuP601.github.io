---
layout: page
title: "🧪 Monitor2 Challenge – pwn.college"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Challenge Description

> Monitor traffic arriving at your host on port `31337`.  
> A remote host will connect and send the flag very slowly.

Your goal is to **capture and extract the flag** from that network transmission.

---

## 🛠️ Tools Used

- `tshark` (CLI version of Wireshark)
- `tcpdump` (alternative)
- `strings`, `grep`, or `tshark` follow stream options

---

## 🧾 Steps to Solve

### 1. 🧲 Start Packet Capture

Run this command to capture all TCP packets on port `31337` on interface `eth0`:

```bash
tshark -i eth0 -f "tcp port 31337" -w monitor2.pcap
```

Wait about 15–20 seconds to let the slow data transmission finish.
Then stop it with Ctrl + C.

### 2.Extract the Flag from the Capture
To extract the TCP stream in ASCII:
```bash
tshark -r monitor2.pcap -qz follow,tcp,ascii,0
```
Try changing the last digit if there are multiple streams (0, 1, 2, ...).
Look through the output for a line like:
```
pwn.college{Y0ur_Sl0w_Fl4g_1s_H3re}
```
---
## Flag
```bash
pwn.college{<your_actual_flag_from_stream>}
```
---
