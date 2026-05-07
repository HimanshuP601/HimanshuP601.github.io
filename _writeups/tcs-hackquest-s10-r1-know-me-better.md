---
layout: page
title: "Know Meh Better"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Decompile a PyInstaller executable to reverse engineer an XOR encryption routine and recover a hidden base64-encoded flag."
---

**Flag:** `HQX{2483296533b73b50eb2cde9245401d74}`

## Approach (Step by Step)

1. The challenge provided a Windows executable named `know_meh_better.exe` and a text file named `output_bBe4FD65f8.txt`.
2. I started by using `pyinstxtractor` to decompile the executable, which is a common approach for Python binaries packaged with PyInstaller:
   ```bash
   python3 pyinstxtractor.py know_meh_better.exe
   ```
3. This successfully extracted the `.pyc` files into a directory. The main logic of the challenge was located in `know_meh_better.pyc`.
4. I then used `uncompyle6` to decompile the `.pyc` file back into readable Python source code:
   ```bash
   uncompyle6 know_meh_better.pyc > know_meh_better.py
   ```

### Analyzing the Source Code

5. The decompiled script revealed a questionnaire-style challenge containing fake trivia questions about the author. A `FLAG` variable was present, but it was just a fake flag (`HQX{fake_flag}`).
6. However, the script contained `encode_flag` and `decode_flag` functions, which used an XOR-based encryption routine:

   ```python
   slt = len.__doc__

   def encode_flag(flg):
       encoded = ('').join([chr(ord(flg[i]) ^ ord(slt[i % len(slt)])) for i in range(len(flg))]).encode('utf-8').encode('hex')
       return encoded

   def decode_flag(flg):
       encoded_bytes = flg.decode('hex')
       decoded = ('').join([chr(ord(encoded_bytes[i]) ^ ord(slt[i % len(slt)])) for i in range(len(encoded_bytes))])
       return decoded
   ```

7. The script relies on the docstring of the built-in `len` function (`len.__doc__`) as its XOR key (`slt`).
8. Let's look at `output_bBe4FD65f8.txt`:
   ```text
   0123322c1714694427216d173a393b543f5a210f6e133a0c23276205374a2b4a39283b412c033f543c6a131d2e31115e4625==
   ```
   The `output` file contained a hex string, but it was oddly appended with `==`. Hexadecimal encodings do not use padding characters like base64 does.

### Decrypting the Flag

9. I created a custom Python script to replicate the decryption routine, keeping in mind that the `==` might have been unintentionally excluded from the hex conversion but was part of the original encoded string (like a base64 payload).

   ```python
   slt = len.__doc__

   def decode_flag(flg):
       if flg.endswith('=='):
           # Remove the base64 padding to decode the hex part
           flg = flg[:-2]
       
       # Convert the hex string to bytes
       encoded_bytes = bytes.fromhex(flg)
       
       # XOR each byte with the key (len.__doc__)
       decoded = "".join([chr(encoded_bytes[i] ^ ord(slt[i % len(slt)])) for i in range(len(encoded_bytes))])
       return decoded

   ciphertext = "0123322c1714694427216d173a393b543f5a210f6e133a0c23276205374a2b4a39283b412c033f543c6a131d2e31115e4625=="
   print(decode_flag(ciphertext))
   ```

10. Running the script gave the output: `SFFYezI0ODMyOTY1MzNiNzNiNTBlYjJjZGU5MjQ1NDAxZDc0fQ`.
11. Appending the missing `==` padding and decoding the resulting base64 string (`SFFYezI0ODMyOTY1MzNiNzNiNTBlYjJjZGU5MjQ1NDAxZDc0fQ==`) revealed the actual flag!

    ```bash
    echo "SFFYezI0ODMyOTY1MzNiNzNiNTBlYjJjZGU5MjQ1NDAxZDc0fQ==" | base64 -d
    ```
    Result: `HQX{2483296533b73b50eb2cde9245401d74}`
