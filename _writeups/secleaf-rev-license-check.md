---
layout: page
title: "License Check"
major_type: CTF
parent_group: SecLeaf
sub_module: Reverse Engineering
summary: "Reversing a basic XOR-encoded string to bypass an offline license verification system."
---

## Description

A suspicious license verification system was recovered from an abandoned SECLEAF development machine.

The authentication server is offline.

Can you recover the correct license key and unlock the protected access?

**Flag Format:** `SecLeaf{}`

## Approach

1. **Decompiling the Binary:** Opening the binary in a decompiler (like Ghidra) gives us a clear look at the `main` function:
   ```c
   undefined8 main(void)
   {
     // ... local variable setup ...
     char local_68 [32];
     char local_48 [64];
     
     builtin_strncpy(local_68,"\x11\a\x01\x10\a\x16o\x0e\v\x01\a\f\x11\aoprpw",0x14);
     // ... flag setup ...
     
     decode(local_68, 0x13, 0x42);
     decode(&local_88, 0x1a, 0x55);
     
     puts("=== SECLEAF LICENSE SYSTEM ===");
     printf("Enter License Key: ");
     __isoc23_scanf(&DAT_0010203b, local_48); // User input
     
     iVar1 = strcmp(local_48, local_68);
     if (iVar1 == 0) {
       puts("\nAccess Granted");
       printf("Flag: %s\n", &local_88);
     }
     // ...
   }
   ```
   The program takes our input (`local_48`) and uses `strcmp` to compare it to `local_68`.

2. **Analyzing the Decode Function:** `local_68` is initialized with gibberish characters and then passed into a `decode` function before the comparison happens. Let's look at `decode`:
   ```c
   void decode(long param_1,int param_2,byte param_3)
   {
     undefined4 local_c;
     for (local_c = 0; local_c < param_2; local_c = local_c + 1) {
       *(byte *)(param_1 + local_c) = *(byte *)(param_1 + local_c) ^ param_3;
     }
     return;
   }
   ```
   This is a simple XOR decryption loop. It iterates through the string at `param_1` for `param_2` characters and XORs each byte with `param_3`.

3. **Reversing the Logic:** We know the inputs to `decode` for the license key are:
   - Encrypted String: `\x11\a\x01\x10\a\x16o\x0e\v\x01\a\f\x11\aoprpw`
   - Length (`param_2`): `0x13` (19 bytes)
   - XOR Key (`param_3`): `0x42`

   We can manually XOR each byte with `0x42` (66 in decimal):
   - `\x11` ^ `0x42` = `0x53` (`S`)
   - `\a` (0x07) ^ `0x42` = `0x45` (`E`)
   - `\x01` ^ `0x42` = `0x43` (`C`)
   - `\x10` ^ `0x42` = `0x52` (`R`)
   - `\a` (0x07) ^ `0x42` = `0x45` (`E`)
   - `\x16` ^ `0x42` = `0x54` (`T`)
   - `o` (0x6f) ^ `0x42` = `0x2d` (`-`)
   - `\x0e` ^ `0x42` = `0x4c` (`L`)
   - `\v` (0x0b) ^ `0x42` = `0x49` (`I`)
   - `\x01` ^ `0x42` = `0x43` (`C`)
   - `\a` (0x07) ^ `0x42` = `0x45` (`E`)
   - `\f` (0x0c) ^ `0x42` = `0x4e` (`N`)
   - `\x11` ^ `0x42` = `0x53` (`S`)
   - `\a` (0x07) ^ `0x42` = `0x45` (`E`)
   - `o` (0x6f) ^ `0x42` = `0x2d` (`-`)
   - `p` (0x70) ^ `0x42` = `0x32` (`2`)
   - `r` (0x72) ^ `0x42` = `0x30` (`0`)
   - `p` (0x70) ^ `0x42` = `0x32` (`2`)
   - `w` (0x77) ^ `0x42` = `0x35` (`5`)

4. **Executing:** The decrypted string is `SECRET-LICENSE-2025`. When we run the binary and input this key, the `strcmp` succeeds, granting access and decoding the flag for us!

### Output

```text
=== SECLEAF LICENSE SYSTEM ===
Enter License Key: SECRET-LICENSE-2025

Access Granted
Flag: SecLeaf{...}
```
