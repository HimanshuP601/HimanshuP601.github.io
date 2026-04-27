---
layout: page
title: "🔤 XORing ASCII — XORing Characters Byte by Byte"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


**Challenge Title:** XORing ASCII  
**Platform:** pwn.college  
**Category:** Cryptography  
**Difficulty:** Easy  
**Tags:** `ascii`, `bitwise`, `XOR`, `character encoding`, `python`

---

## 📝 Description

Much of cryptography involves **text encryption**. Text in computers is represented as **bytes**, using encoding standards like **ASCII** or **UTF-8**.

> In this challenge, we stick to **ASCII**, where each character has a fixed byte value (0–127).

Using XOR on characters becomes easy:
- Convert the character to its **ASCII code** (via `ord()` in Python).
- XOR it with a given key.
- Convert the result **back to a character** (via `chr()`).

You will be given an **encrypted character** and an **XOR key**. Your task is to decrypt it — that is, find the original character before encryption.

---

## 💡 ASCII Recap

Here’s how to view ASCII codes:

```bash
man ascii
```
Or use Python interactively:
```python
>>> ord('A')      # Get ASCII code
65
>>> chr(0x40)     # Get character from ASCII code
'@'
```
Example:
```
Encrypted Character: A
XOR Key: 0x01

ord('A') = 0x41  
0x41 ^ 0x01 = 0x40 → chr(0x40) = '@'
```
Answer: @

### Example Session
```bash
Challenge number 1...
- Encrypted Character: r
- XOR Key: 0x2a
- Decrypted Character? X
Correct! Moving on.

Challenge number 2...
- Encrypted Character: h
- XOR Key: 0x4e
- Decrypted Character? &
Correct! Moving on.

...

Challenge number 9...
- Encrypted Character: [
- XOR Key: 0x18
- Decrypted Character? C
Correct! Moving on.

You have mastered XORing ASCII! Your flag:
pwn.college{wdhDQFWHhHscYIG5U5f7ZYFUCKo.QX4IzN5wSM0IzMyEzW}
```
---
## Flag
```
pwn.college{wdhDQFWHhHscYIG5U5f7ZYFUCKo.QX4IzN5wSM0IzMyEzW}
```
---
