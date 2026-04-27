---
layout: page
title: "🧠 Many-time Pad — Cryptography Challenge Writeup"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


## 📜 Challenge Description

> The previous challenge gave you the one time pad to decrypt the ciphertext.  
> If you did not know the one time pad, and it was only ever used for one message, the previous challenge would be unsolvable!  
> In this level, we'll explore what happens if the latter condition is violated.  
> You don't get the key this time, but we'll let you encrypt as many messages as you want.  
> Can you decrypt the flag?

**Hint:** Think deeply about how XOR works. It is distributive, commutative, and associative.  
**Tip:** Use Python and the `strxor` function from `Crypto.Util.strxor`.

---

## 🔧 Challenge Interaction

We are given:

- **Flag Ciphertext (hex):**

```

b522783fa07f811a39dbddd4d1fddf7e938c0894312b0ab5be246cc574e67a1852729d541d6e6307e8cb4d6583e6ba1f5c8ca4f7e3f7da6caa70f1aa
```

- The program allows us to encrypt arbitrary plaintexts and gives us back their ciphertexts.

We encrypted the following **known plaintext**:

```
Plaintext (hex): 161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616
```

And received the following **ciphertext**:

```
Ciphertext (hex): d3430007d506fb604aaaaeb9b4aafd58f1f12de36f6768e9c1410fab21a516667d2cbc047c0c433faf856a10efbdd67e19d782a88facb53fc6319ab6
```

---

## 🧠 Key Insight

Since **OTP was reused**, we can extract the key stream:

```
key = ciphertext ⊕ known_plaintext
```

In Python, using the `strxor` function:

```python
from Crypto.Util.strxor import strxor

c = bytes.fromhex('d3430007d506fb604aaaaeb9b4aafd58f1f12de36f6768e9c1410fab21a516667d2cbc047c0c433faf856a10efbdd67e19d782a88facb53fc6319ab6')
p = bytes.fromhex('161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616')

key = strxor(c, p)
```
### Decrypting the Flag
We now XOR the extracted key with the flag ciphertext:
```python
flag_c = bytes.fromhex('b522783fa07f811a39dbddd4d1fddf7e938c0894312b0ab5be246cc574e67a1852729d541d6e6307e8cb4d6583e6ba1f5c8ca4f7e3f7da6caa70f1aa')
flag = strxor(flag_c, key)
print(flag.decode())  # Final flag
```
---
## Flag
```
pwn.college{sA40tk3aHZtJisuxCUzh9H7Fwt6.QX1czMzwSM0IzMyEzW}
```
---
