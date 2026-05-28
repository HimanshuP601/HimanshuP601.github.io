---
layout: page
title: "Wrong Turn"
major_type: CTF
parent_group: SecLeaf
sub_module: MISC
summary: "Extracting a hardcoded flag from a UPX packed binary."
---

## Description

There is Secure vault which has hard coded flag in it.

Decrypt the password to unlock the vault.

**Flag Format:** `SecLeaf{}`

## Approach

The challenge gives us an executable binary named `wrong_turn`. 

1. **Initial Reconnaissance:** We start by analyzing the binary's headers using `file` and `checksec`.
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Misc_wrong_turn]
   └─$ file wrong_turn 
   wrong_turn: ELF 64-bit LSB pie executable, x86-64...
   ```
   If we look closely at the raw hex dump using `xxd` or `binwalk`, we can spot references to `UPX!` packed sections. UPX is a common executable packer used to compress (and sometimes lightly obfuscate) binaries.

2. **The "Wrong Turn":** The typical way to proceed with a packed binary is to unpack it using the UPX utility: `upx -d wrong_turn`. 
   
   However, if we try this, it fails:
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Misc_wrong_turn]
   └─$ upx -d -f wrong_turn
   upx: wrong_turn: NotPackedException: not packed by UPX
   ```
   The binary appears to be heavily corrupted or deliberately modified to break standard unpacking tools.

3. **Taking the Simple Route:** Before diving into manual unpacking using GDB, we should always check the absolute basics. The description mentions a "hard coded flag". Let's simply run `strings` on the packed binary to see if the flag was left in plaintext somewhere in the file structure.
   
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Misc_wrong_turn]
   └─$ strings wrong_turn | grep "SecLeaf"
   SecLeaf{hardcoded_secrets_again}
   ```
   The flag pops out instantly. The complex UPX packing and corruption was just a distraction to make us take a "wrong turn"!

### Output

```text
/lib64/ld-linux-x86-64.so.2
...
Debugger check complete...
Decrypting secure vault...
Enter password: 
%49s
Access granted
SecLeaf{hardcoded_secrets_again}
Access denied
```
