---
layout: page
title: "Military Grade Encryption"
major_type: CTF
parent_group: SecLeaf
sub_module: Crypto
summary: "Decoding a Base64 string that was presented as military grade encryption."
---

## Description

We intercepted an encrypted military transmission during routine monitoring.

Analysts were unable to identify the encryption scheme used.

Can you recover the hidden message?

**Flag format:** `SecLeaf{}`

## Approach

We are provided with an `encrypted.txt` file that allegedly contains "military grade encryption". 

1. **Inspecting the File:** First, we read the contents of the file.
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Crypto_military_grade_encryption]
   └─$ cat encrypted.txt                  
   U2VjTGVhZntiNDUzNjRfMXNfbjB0XzNuY3J5cHQxMG59
   ```

2. **Identifying the Encoding:** The string ends with a standard character set of uppercase letters, lowercase letters, and numbers. It doesn't have the typical `= ` padding, but the character set immediately looks like Base64 encoding.

3. **Decoding:** Base64 is not encryption; it's just an encoding scheme. We can easily decode it back to plaintext using the `base64 -d` command in Linux.
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Crypto_military_grade_encryption]
   └─$ cat encrypted.txt | base64 -d
   SecLeaf{b45364_1s_n0t_3ncrypt10n}  
   ```
   The flag explicitly makes the joke: Base64 is not encryption!

### Output

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Crypto_military_grade_encryption]-(23-05-2026 17:46:23)
└─$ cat encrypted.txt                  
U2VjTGVhZntiNDUzNjRfMXNfbjB0XzNuY3J5cHQxMG59

┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/Crypto_military_grade_encryption]-(23-05-2026 17:46:25)
└─$ cat encrypted.txt| base64 -d
SecLeaf{b45364_1s_n0t_3ncrypt10n}  
```
