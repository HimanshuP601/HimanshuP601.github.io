---
layout: page
title: "🔡 XORing ASCII Strings — Full-String XOR Practice"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


**Challenge Title:** XORing ASCII Strings  
**Platform:** pwn.college  
**Category:** Cryptography  
**Difficulty:** Medium  
**Tags:** `xor`, `ascii`, `strings`, `python`, `strxor`, `bitwise`

---

## 📝 Description

We’ve gone from XORing numbers and single characters to now XORing **entire strings**.

In this challenge, you're given:

- A 10-character **encrypted string** (ciphertext)
- A 10-character **XOR key string**
- Your task is to **decrypt** the encrypted string using the key, character by character, and submit the **original plaintext string**.

---

## 🔧 Behind the Scenes

The challenge source code:

```python
#!/opt/pwn.college/python

import random
import string
import sys
from Crypto.Util.strxor import strxor

valid_keys = "!#$%&()"
valid_chars = ''.join(
    c for c in string.ascii_letters
    if all(chr(ord(k)^ord(c)) in string.ascii_letters for k in valid_keys)
)

print(valid_keys, valid_chars)

for n in range(1, 10):
    print(f"Challenge number {n}...")

    key_str = ''.join(random.sample(valid_keys*10, 10))
    pt_str = ''.join(random.sample(valid_chars*10, 10))
    ct_str = strxor(pt_str.encode(), key_str.encode()).decode()

    print(f"- Encrypted String: {ct_str}")
    print(f"- XOR Key String: {key_str}")
    answer = input("- Decrypted String? ").strip()
    if answer != pt_str:
        print("Incorrect!")
        sys.exit(1)

    print("Correct! Moving on.")

print("You have mastered XORing ASCII! Your flag:")
print(open("/flag").read())
```

Key observations:
- It uses strxor from pycryptodome to XOR entire byte strings
- All characters used are printable ASCII to avoid decoding issues
- Your goal is to reverse the operation:
 `plaintext = strxor(ciphertext, key)`

### Decryption Strategy
```python
while True:
    from Crypto.Util.strxor import  strxor
    one = input("One:")
    two = input("two:")


    one = one.encode()
    two = two.encode()

    print(strxor(one , two).decode())
```
### Example Session
```bash
Challenge number 1...
- Encrypted String: eghgJCdnjL
- XOR Key String: ()%%$$&!%&
- Decrypted String? MNMBngBOOj
Correct! Moving on.

Challenge number 2...
- Encrypted String: lABgdkjEgD
- XOR Key String: !&()($$)%)
- Decrypted String? MgjNLONlBm
Correct! Moving on.

...

Challenge number 9...
- Encrypted String: NfCDkbncfT
- XOR Key String: $((&!%$(!%
- Decrypted String? jNkbJGJKGq
Correct! Moving on.
```
---
## Flag
```
pwn.college{ESv1YnpDYnLKC0apAMgWxhK_tFd.QX5IzN5wSM0IzMyEzW}
```
---
