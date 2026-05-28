---
layout: page
title: "Double Trouble"
major_type: CTF
parent_group: SecLeaf
sub_module: Crypto
summary: "Reversing a multi-layered encoding chain involving Hex, Base64, and ROT13."
---

## Description

We intercepted a suspicious encoded transmission during routine monitoring.

Analysts believe the message was processed through multiple transformation layers before being transmitted.

Can you recover the original message?

**Flag format:** `SecLeaf{}`

## Approach

In this cryptography challenge, we are presented with a ciphertext that has been encoded multiple times using different schemes.

1. **Hexadecimal Decoding:** The initial cipher string is provided in Hex format. Converting this hex back to ASCII yields a Base64 encoded string:
   ```text
   Hex → RnJwWXJuc3swYTNfeTRsM2VfajRmYWdfM2EwaHR1fQ==
   ```

2. **Base64 Decoding:** The `==` padding clearly indicates Base64. We decode the resulting string again, which yields a jumbled flag format:
   ```text
   Base64 → FrpYrns{0a3_y4l3e_j4fag_3a0htu}
   ```

3. **ROT13 Decoding:** We can see the flag format `SecLeaf{}` matches the structure of `FrpYrns{}`. We just need to shift the characters. Applying a standard Caesers cipher (ROT13) shifts `F` back to `S`, `r` back to `e`, etc., revealing the final, original plaintext:
   ```text
   ROT13 → SecLeaf{0n3_l4y3r_w4snt_3n0ugh}
   ```

### Output

```text
Decoding chain:

Hex    → RnJwWXJuc3swYTNfeTRsM2VfajRmYWdfM2EwaHR1fQ==
Base64 → FrpYrns{0a3_y4l3e_j4fag_3a0htu}
ROT13  → SecLeaf{0n3_l4y3r_w4snt_3n0ugh}

Flag: SecLeaf{0n3_l4y3r_w4snt_3n0ugh}
```
