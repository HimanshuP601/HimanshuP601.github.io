---
layout: page
title: "ImaginaryCTF Forensic - obsuct"
summary: "Writeup from ImaginaryCTF 2025"
major_type: "CTF"
parent_group: "ImaginaryCTF 2025"
sub_module: ""
date: 2026-04-27
---


---

## **Objective**
We are provided with a challenge file named `objective I installed.txt`, which contains the following hint:

objective: I installed every old software known to man...
The flag is the VNC password, wrapped in ictf{}.

attachment: /assets/img/ctf_assets/Users.zip

The goal is to **recover the VNC password** and submit it in the format `ictf{password}`.

---

## **Initial Analysis**

The given file structure looks like a **Windows file system** dump.  
This strongly suggests that sensitive user data, such as **VNC configurations or registry values**, might be stored inside files like `NTUSER.DAT`.

---

### **Exploring the Directory**
We begin by navigating through the file structure:

```bash
cd Users
ls
# Output:
rumi
```
Inside the rumi user folder:
```bash
cd rumi
ls
```
We notice several Windows-related files, including:

- NTUSER.DAT

- ntuser.dat.LOG1

- ntuser.dat.LOG2

Other typical Windows directories like AppData, Documents, Downloads, etc.

The presence of NTUSER.DAT is a major clue, as this file stores user-specific registry data.

## Determining the VNC Software
The hint mentions "every old software known to man".
From this, we infer that the challenge involves older VNC software, such as:

- TightVNC

- UltraVNC

To determine which one is installed, we search for VNC traces:
The VNC password for TightVNC is stored in the Windows registry under the following key:
```bash
Software\TightVNC\Server\Password
```
We use chntpw (a registry hive editor) to explore NTUSER.DAT:
```bash
chntpw -e NTUSER.DAT
```
### Navigating the Registry

1. List root keys:
```bash
> ls
```
We find several keys, including <Software>.

2. Navigate to Software:
```bash
> cd Software
> ls
```
Here we see <TightVNC>.

3. Dive into TightVNC > Server:
```bash
> cd TightVNC
> cd Server
> ls
```
Output snippet:
```bash
8  3 REG_BINARY         <Password>
```

4. Extract the Password:
```bash
> cat Password
```
Output:
```bash
Value <Password> of type REG_BINARY (3), data length 8 [0x8]
:00000  7E 9B 31 12 48 B7 C8 A8                         ~.1.H...
```
The encrypted password is:
```bash
7E 9B 31 12 48 B7 C8 A8
```
## Decrypting the TightVNC Password
TightVNC uses a fixed DES key to encrypt its password.
Credit to the following GitHub gist for the decryption method:
https://gist.github.com/jborean93/6168da85e5b3742d943300dd1176a63d
We create a custom script dec.py to automate this decryption:
```python
#!/usr/bin/env python3
# TightVNC password decryptor for Linux
# Credit: https://gist.github.com/jborean93/6168da85e5b3742d943300dd1176a63d

from Crypto.Cipher import DES

# Encrypted 8-byte password from NTUSER.DAT
encrypted_bytes = bytes([0x7E, 0x9B, 0x31, 0x12, 0x48, 0xB7, 0xC8, 0xA8])

# TightVNC fixed DES key
magic_key = bytes([0xE8, 0x4A, 0xD6, 0x60, 0xC4, 0x72, 0x1A, 0xE0])

# Create DES decryptor
cipher = DES.new(magic_key, DES.MODE_ECB)

# Decrypt
password_bytes = cipher.decrypt(encrypted_bytes)

# Convert to string and remove null bytes
password = password_bytes.decode('latin-1').rstrip('\x00')

print("TightVNC password:", password)
```
Run the script:
```bash
python3 dec.py
```
Output:
```bash
TightVNC password: cheeseburger
```
---
## Final Flag
The challenge asks us to wrap the password in ictf{} format:
```bash
ictf{cheeseburger}
```
---


