---
layout: page
title: "One Billion Tries"
major_type: CTF
parent_group: SecLeaf
sub_module: Forensics
summary: "Cracking a weakly protected zip archive using John the Ripper."
---

## Description

We intercepted a password-protected archive during a forensic investigation.

Investigators believe the password follows a very weak numeric pattern.

Can you recover the hidden file?

**Flag format:** `SecLeaf{}`

## Approach

We are provided with a password-protected zip file (`protected.zip`). The description gives us a massive hint: "the password follows a very weak numeric pattern." This indicates that we should attempt to brute-force the password using a purely numeric character set. 

1. **Extracting the Hash:** First, we need to extract the password hash from the zip file into a format that a password cracker can understand. We use `zip2john` for this.
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]
   └─$ zip2john protected.zip > hash.txt
   ```

2. **Cracking the Hash:** Next, we feed the extracted hash to `john` (John the Ripper). Since we know the password is numeric, we can use the built-in `Digits` incremental mode, which will efficiently brute-force numeric passwords.
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]
   └─$ john --incremental=Digits hash.txt
   ```
   Within seconds, John cracks the password: `9697989299`.

3. **Extracting the Flag:** Now that we have the password, we can extract the contents of the archive using `7z`.
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]
   └─$ 7z x protected.zip
   ```
   We enter the password `9697989299` when prompted. The extraction succeeds, leaving us with a `flag.txt` file. Reading it gives us the flag.

### Output

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]-(23-05-2026 21:53:22)
└─$ zip2john protected.zip > hash.txt

┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]-(23-05-2026 21:53:22)
└─$ john --incremental=Digits hash.txt
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 12 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
9697989299       (protected.zip/flag.txt)     
1g 0:00:12:46 DONE (2026-05-23 22:06) 0.001305g/s 12518Kp/s 12518Kc/s 12518KC/s 9697988009..9697944979

┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]-(23-05-2026 22:07:27)
└─$ 7z x protected.zip 
...
Enter password (will not be echoed):
Everything is Ok

┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_one_billion_tries]-(23-05-2026 22:07:49)
└─$ cat flag.txt 
SecLeaf{w0rdl1sts_m4tt3r}
```
