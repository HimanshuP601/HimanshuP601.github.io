---
layout: page
title: "🔐 XORing Hex — Practice XOR with Hex Values"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


**Challenge Title:** XORing Hex  
**Platform:** pwn.college  
**Category:** Cryptography  
**Difficulty:** Easy  
**Tags:** `bitwise`, `XOR`, `hexadecimal`, `python`

---

## 📝 Description

As you’ve already learned in earlier challenges, **XOR** is a key concept in cryptography.  
Now we take things one step further by working with **hexadecimal representations** — the typical format for bytes in memory and cryptographic operations.

> In this challenge, you’ll be given a random key and an encrypted secret, both in **hex format**.  
> Your task is to decrypt the secret by XORing the key and the encrypted value.

---

## 📚 Quick Recap: XOR and Hex

XOR still works the same way with hex — it’s just that you’re now looking at the values in base 16 rather than base 10.

```python
# Example:
>>> hex(0x4e ^ 0x46)
'0x08'
```
So:
- key = 0x4e
- cipher = 0x46
- secret = 0x4e ^ 0x46 = 0x08

### #!/opt/pwn.college/python

import random
import sys

for n in range(10):
    print(f"Challenge number {n}...")

    key = random.randrange(1, 256)
    plain_secret = random.randrange(0, 256)
    cipher_secret = plain_secret ^ key

    print(f"The key: {key:#04x}")
    print(f"Encrypted secret: {cipher_secret:#04x}")
    answer = int(input("Decrypted secret? "), 16)
    print(f"You entered: {answer:#04x}, decimal {answer}.")
    if answer != plain_secret:
        print("INCORRECT!")
        sys.exit(1)

    print("Correct! Moving on.")

print("CORRECT! Your flag:")
print(open("/flag").read())
```

### Example Run
Here’s what a sample session looks like:
```bash
Challenge number 0...
The key: 0x4e
Encrypted secret: 0x46
Decrypted secret? 0x8
You entered: 0x08, decimal 8.
Correct! Moving on.

Challenge number 1...
The key: 0x3d
Encrypted secret: 0x53
Decrypted secret? 0x6e
You entered: 0x6e, decimal 110.
Correct! Moving on.

...

Challenge number 9...
The key: 0x0b
Encrypted secret: 0x78
Decrypted secret? 0x73
You entered: 0x73, decimal 115.
Correct! Moving on.

CORRECT! Your flag:
pwn.college{4h3zyQYsFWqwrwbL2T5GTokZSM1.QXwMzN5wSM0IzMyEzW}
```
--- 
## Flag
```
pwn.college{4h3zyQYsFWqwrwbL2T5GTokZSM1.QXwMzN5wSM0IzMyEzW}
```
---
