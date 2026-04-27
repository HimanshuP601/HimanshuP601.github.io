---
layout: page
title: "🔐 One-Time Pad Decryption"
summary: "Writeup from Cryptography"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Cryptography"
date: 2026-04-27
---


**Challenge Name:** one-time-pad  
**Platform:** pwn.college  
**Category:** Cryptography  
**Tags:** XOR, Symmetric Encryption, Perfect Secrecy  
**Difficulty:** Easy  

---

## 🧠 Description

> In this challenge, you will decrypt a secret encrypted with a **One-Time Pad**.  
>
> The One-Time Pad (OTP) is one of the simplest and most secure encryption mechanisms ever devised.  
> - You XOR each byte of the plaintext with a key of the same length.  
> - The same key is used for both encryption and decryption.  
>
> If the key is:
> - **Truly random**
> - **As long as the plaintext**
> - **Used only once**
> - **Kept secret**
>
> ...then it is **provably unbreakable**, even with infinite computing power.  
>
> In this challenge, you are given:
> - The ciphertext (as a hex string)
> - The key (also hex string)
>
> Your task is to decrypt the ciphertext.

---

## 📦 Provided Code

```python
#!/opt/pwn.college/python

from Crypto.Random import get_random_bytes
from Crypto.Util.strxor import strxor

flag = open("/flag", "rb").read()

key = get_random_bytes(len(flag))
ciphertext = strxor(flag, key)

print(f"One-Time Pad Key (hex): {key.hex()}")
print(f"Flag Ciphertext (hex): {ciphertext.hex()}")
```
### Sample Output:
```
One-Time Pad Key (hex): 9033390eba686a2ff3c29e61523d0a21626f5de127f0a38a02d149a320adac3056fe0d315363b8b73f8f1bb0113ccc973d0189ed30ec0bd04dd72351
Flag Ciphertext (hex): e0445720d907064396a5fb1a35707f4406371aa85786ebb850bf059011c2f81d3ab7407d3801d2996ed72bd36b71b6e06e4cb9a44aa1729537805e5b
```
### Explanation
Since OTP is symmetric, we simply XOR the ciphertext and the key to recover the original flag.

### Solution Code
```python
def decrypt(cipher: str, key: str) -> str:
    c = bytes.fromhex(cipher)
    k = bytes.fromhex(key)
    d = bytes(a ^ b for a, b in zip(c, k))
    return d.decode()

def main():
    c = input('cipher: ')
    k = input('Key: ')
    print(f"Result: {decrypt(c, k)}")

if __name__ == '__main__':
    main()
```
### Sample Run
```
$ python one_time.py 
cipher: e0445720d907064396a5fb1a35707f4406371aa85786ebb850bf059011c2f81d3ab7407d3801d2996ed72bd36b71b6e06e4cb9a44aa1729537805e5b
Key:    9033390eba686a2ff3c29e61523d0a21626f5de127f0a38a02d149a320adac3056fe0d315363b8b73f8f1bb0113ccc973d0189ed30ec0bd04dd72351
Result: pwn.college{gMuedXGIpvH2RnL31oT-lIMLkbj.QX0czMzwSM0IzMyEzW}
```
---
## Flag
```
pwn.college{gMuedXGIpvH2RnL31oT-lIMLkbj.QX0czMzwSM0IzMyEzW}
```
---
