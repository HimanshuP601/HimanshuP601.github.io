---
layout: page
title: "Seeds of Time"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Exploit a predictable PRNG seed (Unix timestamp) to decrypt the flag."
---

**Flag:** `HQX{c126bb454bbe38c397a5daf0729fbd08}`

## Approach (Step by Step)

1. We are given a Python encryption script and a ciphertext.
2. The script encrypts a secret `FLAG` using a keystream generated from Python’s random module, seeded with the current Unix timestamp.
3. The goal is to recover the original `FLAG`.
4. Given Encryption Code:

```python
import time
import random
t = time.time()
seed = int(t)
random.seed(seed)
FLAG = "REDACTED"
keystream = bytearray(
    int(random.random() * 256) for _ in range(len(FLAG))
)
cipher = bytes([f ^ k for f, k in zip(FLAG.encode(), keystream)])
print(cipher.hex())
```

And ciphertext:
```text
f60d1ef6307bc56ed4f3f8fe41eacd9883b571ae87dc9dd018b0083b601303b923ebba81ca
```

5. The encryption process works as follows:
   * The random number generator is seeded using `int(time.time())`
   * A keystream of the same length as the flag is generated
   * Each byte of the flag is XORed with the keystream
   * The result is output as hex

   Mathematically:
   `cipher = FLAG ⊕ keystream`

   Since XOR is reversible:
   `FLAG = cipher ⊕ keystream`

6. The critical weaknesses are:
   * **Predictable Seed:**
     `seed = int(time.time())`
     Unix timestamps change once per second. The seed space is very small (≈ 86,400 per day).
   * **Non-Cryptographic PRNG:**
     `random.random()`
     Unlike other PRNGs, Python’s `random` module is deterministic. Same seed → same keystream.

7. Instead of brute-forcing the flag, I brute-forced the seed.
8. Ciphertext length tells us the flag length.
9. Seed is likely close to the current time.
10. Reproducing the keystream allows full decryption.
11. Attack Plan:
    * Convert ciphertext from hex to bytes.
    * Loop over plausible timestamp values.
    * Regenerate the keystream for each seed.
    * XOR keystream with ciphertext.
    * Check if output looks like a valid flag.

### Script and Output:

```python
import time
import random

ciphertext_hex = "f60d1ef6307bc56ed4f3f8fe41eacd9883b571ae87dc9dd018b0083b601303b923ebba81ca"
ciphertext = bytes.fromhex(ciphertext_hex)

# Assuming the challenge was generated recently, we check times around now
current_time = int(time.time())

# We know the flag starts with HQX{
for seed in range(current_time - 31536000, current_time + 3600):
    random.seed(seed)
    keystream = bytearray(int(random.random() * 256) for _ in range(len(ciphertext)))
    decoded = bytes([c ^ k for c, k in zip(ciphertext, keystream)])
    
    if decoded.startswith(b"HQX{"):
        print(f"Found seed: {seed}")
        print(f"Flag: {decoded.decode('utf-8', errors='ignore')}")
        break
```

![Seeds of Time Script Output](/assets/images/writeups/tcs-hackquest/04-seeds-of-time.png)
