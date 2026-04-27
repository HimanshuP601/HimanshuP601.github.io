---
layout: page
title: "🛰️ UDP Challenge – 'First UDP Interaction'"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


## 📝 Task

You're now an expert in TCP, which is great for reliable communication, but it's also complex. This challenge introduces **UDP (User Datagram Protocol)** – a simpler, connectionless alternative to TCP.

**Objective:**  
From your host at `10.0.0.1`, send the message `Hello, World!` to the remote host at `10.0.0.2` on UDP port `31337`.

> ✅ You can use either Python or netcat. The goal is to receive a response containing the flag.

---

## 📚 Background: What is UDP?

UDP is a lightweight protocol used when speed is preferred over reliability. Unlike TCP:

- No handshake or session establishment
- No packet ordering
- No retransmission of lost packets
- No connection state is kept

You just fire the packet and hope it arrives.

UDP is commonly used in:
- DNS queries
- Video/audio streaming
- Online gaming

---

## 🚀 Solution (Netcat)

We use `nc` (netcat) in **UDP mode** with the `-u` flag:

```bash
nc -u 10.0.0.2 31337
```
Once connected, type:
```bash
Hello, World!
```
And you will receive the response:
```
Hello, World!
pwn.college{0zfudnc9yN64T-umRea3B0busUh.0lM0AjNxwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{0zfudnc9yN64T-umRea3B0busUh.0lM0AjNxwSM0IzMyEzW}
```
---
