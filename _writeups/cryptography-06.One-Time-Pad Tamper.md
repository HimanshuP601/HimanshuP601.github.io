---
layout: page
title: "🔐 One-Time Pad Tampering — Integrity Flaw Exploit"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


**Challenge Title:** One-Time-pad  
**Platform:** pwn.college  
**Category:** Cryptography  
**Difficulty:** Easy  
**Tags:** `OTP`, `XOR`, `message integrity`

---

## 📝 Description

> The **One-Time Pad** is known for being **perfectly secure**, but only for *confidentiality*.  
> It **does not** provide **integrity** — meaning, if an attacker can tamper with the ciphertext, they can manipulate the message undetected.  
>  
> This challenge demonstrates that by letting you interact with a script that:
> - XORs a plaintext command (like `sleep`) with a **secret key**
> - And prints the resulting **ciphertext**
>  
> You are then allowed to send your **own ciphertext** to the server.
>  
> 🔥 Goal: Modify the ciphertext so that the server thinks it received `flag!` instead of `sleep`.

---

## 📂 Given Files

### `dispatcher`
```python
from Crypto.Util.strxor import strxor

key = open("/challenge/.key", "rb").read()
ciphertext = strxor(b"sleep", key[:5])
print(f"TASK: {ciphertext.hex()}")
```
### Worker
```python
from Crypto.Util.strxor import strxor
import time, sys

key = open("/challenge/.key", "rb").read()

while line := sys.stdin.readline():
    if not line.startswith("TASK: "): continue
    data = bytes.fromhex(line.split()[1])
    cipher_len = min(len(data), len(key))
    plaintext = strxor(data[:cipher_len], key[:cipher_len])

    print(f"Hex of plaintext: {plaintext.hex()}")
    print(f"Received command: {plaintext}")
    if plaintext == b"sleep":
        print("Sleeping!")
        time.sleep(1)
    elif plaintext == b"flag!":
        print("Victory! Your flag:")
        print(open("/flag").read())
    else:
        print("Unknown command!")
```
### Understanding the Logic
- The dispatcher encrypts b"sleep" with the unknown key:
  `cipher = XOR(sleep, key)`
- We can reverse it:
  `Key = XOR(cipher, sleep)`
- Now that we have the key, we can forge a new ciphertext:
  `new_cipher = XOR(key, b"flag!")`
---
## Exploitation Steps
### 1. Get the ciphertext
```bash
$ /challenge/dispatcher
TASK: 12cb6cabf1
```
### 2. Reverse XOR to extract the key
```python
>>> c = bytes.fromhex('12cb6cabf1')
>>> p = b'sleep'
>>> key = bytes([a ^ b for a, b in zip(c, p)])
>>> key.hex()
'61a709ce81'
```
### 3. Craft new command: flag!
```python
>>> p = b'flag!'
>>> forged_cipher = bytes([a ^ b for a, b in zip(p, key)])
>>> forged_cipher.hex()
'07cb68a9a0'
```
### 4. Send the forged ciphertext to the worker
```bash
$ /challenge/worker
TASK: 07cb68a9a0
Hex of plaintext: 666c616721
Received command: b'flag!'
Victory! Your flag:
pwn.college{MeLKBB0BFKbG27bEGfXW-q6rujV.01M3kjNxwSM0IzMyEzW}
```
---
