---
layout: page
title: "🧠 XOR 101 — Intro to Bitwise Crypto"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


**Challenge Title:** XOR (Strangely enough...)  
**Platform:** pwn.college  
**Category:** Cryptography  
**Difficulty:** Easy  
**Tag:** `bitwise`, `beginner`, `XOR`, `python`

---

## 📝 Description

Strangely enough, we'll start our crypto journey with the humble **Exclusive Or (XOR)** operator.

XOR is a **bitwise** operator — it compares **each bit** of two numbers and returns `1` if the bits are different, and `0` if they are the same.

For example:  
`9 (1001)` XOR `5 (0101)` = `1100` (which is 12 in decimal).

What makes XOR useful in cryptography is that it is **self-inverse**:

- If `A ^ B = C`, then `C ^ B = A`.

This means if we XOR a message with a key to encrypt it, XORing it again with the same key will decrypt it.

> In this level, you will learn to XOR!  
> We'll give you a shared key, XOR a secret number with it, and expect you to recover the number.

---

## 💡 HINT

Use Python’s `^` operator to XOR integers.

---

## 🧪 Challenge Walkthrough

Let's understand this through an example session:

```bash
hacker@cryptography~xor:~$ python
Python 3.12.11 (main, Jun  3 2025, 15:41:47) [GCC 14.2.1 20250322] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> 250 ^ 143
117
>>> exit()
```
We’re simply XORing two numbers. Now, let’s try solving the actual challenge:
```hacker@cryptography~xor:~$ /challenge/run
The key: 119
Encrypted secret: 49
Decrypted secret? 70
CORRECT! Your flag:
pwn.college{8i1_fbZRWfamOen__vOIWhimMl_.QX3IzN5wSM0IzMyEzW}
```
### Decryption logic:
Since Encrypted = Secret ^ Key, then
Secret = Encrypted ^ Key
=> Secret = 49 ^ 119 = 70
---
## Flag
```
pwn.college{8i1_fbZRWfamOen__vOIWhimMl_.QX3IzN5wSM0IzMyEzW}
```
---
