---
layout: page
title: "Synthetic Stacks"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Crack a password-protected 7z archive disguised as an MSI and decode a base64 payload to reveal a QR code."
---

**Flag:** `HQX{df30cb178e941ee5b984373e6551c8de}`

## Approach (Step by Step)

1. Extracting the zip file resulted in a `.msi` file, but after executing the `file` command it was found that the file was originally a `.7z` file.
2. Attempting to list or extract the 7z archive fails with a headers error, and metadata inspection confirms the archive is encrypted.

This means:
* No embedded files can be inspected directly.
* A password is required.
* The challenge now transitions from forensics to password cracking.

### Extracting and Cracking the Password:

To proceed, the encrypted archive hash is extracted using a 7z to hash conversion tool.

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/Synthetic Stacks]-(13-12-2025 13:25:37)
└─$ 7z2john 4B1b8b33CC.7z > chall.hash
ATTENTION: the hashes might contain sensitive encrypted data. Be careful when sharing or posting these hashes

┌──(himanshu@Kaaammui)-[~/Desktop/tcs/Synthetic Stacks]-(13-12-2025 13:27:05)
└─$ cat chall.hash
4B1b8b33CC.7z:$7z$0$19$0$$16$1e2775ca31732fce17d071ab4d5c9142$3013126118$112$106$f6bae869baea4c9746a8308c33da3d2077d761b98133e894ace396a26dcd157be1d4cbe53e710a9bf20ebf3de0ea5b7be0e379f578675b69dd85979e0a6270bea0f9d9ba124eb37b75e7f4e31254f5409d740004fae11649b92b9ed39d804bf30b7c2ef51d543bfd4d249e449b77dea6
```

Key observations:
* The encryption uses SHA-256 with AES.
* The challenge is designed to be solvable quickly.
* A weak password is intentionally used.

This hash is then passed to John the Ripper:

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/Synthetic Stacks]-(13-12-2025 13:27:43)
└─$ john chall.hash
Using default input encoding: UTF-8
Loaded 1 password hash (7z, 7-Zip archive encryption [SHA256 256/256 AVX2 8x AES])
...
Proceeding with wordlist:/usr/share/john/password.lst
princess1        (4B1b8b33CC.7z)
...
```

![Synthetic Stacks Cracking](/assets/images/writeups/tcs-hackquest/06-synthetic-stacks-1.png)

Running John with its default rules successfully cracked the password: **`princess1`**

3. After extracting the `.7z` file using the discovered password, I found a `.txt` file.
4. The `.txt` file contained a large base64 encoded string.

![Synthetic Stacks Base64](/assets/images/writeups/tcs-hackquest/07-synthetic-stacks-2.png)

5. After decoding it, I found it to be yet another `.png` dump which I converted into a `.png` file using the base64 utility:
   ```bash
   base64 -d hq.txt > flag.png
   ```

6. After opening the `.png` file I found it to be a QR code. After scanning it, I got a message:
   > Well done!
   > You’ve earned the flag.HQX{df30cb178e941ee5b984373e6551c8de}
