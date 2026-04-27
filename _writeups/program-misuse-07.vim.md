---
layout: page
title: "Challenge Name: vim"
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
The challenge abuses a SUID bit set on `/usr/bin/vim`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/vim
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/vim
```

-The `s` in `-rws` indicates it's a SUID binary.
-`vim` runs with **root privileges**.

## 🚀 Exploitation

The `sort` (Vi IMproved) is a highly configurable text editor for efficiently creating and changing any kind of text, so we can just use `vim` to read the flag.

```bash
vim /flag
```

Output:
```
pwn.college{gu_gJmG6FXWCEdXMf5EwQ3rPQZY.dlDNxwSM0IzMyEzW}
~                                                                                                                                    
"/flag" [readonly] 1L, 58C     
```


