---
layout: page
title: Buffer Overflow in 'SecureLogin' Binary
summary: A detailed look at bypassing NX and ASLR to achieve remote code execution.
platform: HackTheBox
difficulty: Hard
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Program Misuse"
date: 2026-04-20
---

## Overview

During the [CTF Name] event, the `SecureLogin` binary presented a classic buffer overflow vulnerability, complicated by modern exploit mitigations like ASLR and NX. 

### Vulnerability Analysis

Decompiling the binary in Ghidra revealed a `gets()` function being used on a 64-byte buffer within `main()`.

```c
void login() {
    char buffer[64];
    printf("Enter password: ");
    gets(buffer); // VULNERABLE!
}
```

### Exploitation Strategy

1. Overflow the buffer to control RIP.
2. Leak libc base address using `puts@plt`.
3. Ret2libc using a ROP chain to execute `system("/bin/sh")`.

This challenge reinforced the importance of thoroughly mapping out ROP gadgets in modern environments.
