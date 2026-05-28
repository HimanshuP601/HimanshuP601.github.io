---
layout: page
title: "Almost There"
major_type: CTF
parent_group: SecLeaf
sub_module: Forensics
summary: "Extracting a flag from a corrupted zip archive using strings."
---

## Description

The backup archive seems damaged.

But maybe not everything is lost.

**Flag format:** `SecLeaf{}`

## Approach

We are provided with a downloadable `backup.zip` file that is supposedly damaged or corrupted.

1. **Initial Analysis:** After downloading the file via `wget`, we can inspect its structure using a hex editor like `xxd`. 
   
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Almost_there]
   └─$ xxd backup.zip 
   00000000: 0000 0304 0a00 0000 0000 fd6b b45c 1192  ...........k.\..
   00000010: d5a4 1c00 0000 1c00 0000 0800 1c00 666c  ..............fl
   00000020: 6167 2e74 7874 5554 0900 0375 6a0d 6a75  ag.txtUT...uj.ju
   ...
   ```
   Notice that the file begins with `0000 0304`, which is a corrupted version of the standard ZIP local file header signature (`504B 0304`). Because the magic bytes are damaged, standard extraction tools like `unzip` or `7z` will likely fail to process the archive properly.

2. **The "Almost There" Shortcut:** While we could fire up a hex editor and repair the magic bytes (changing `00 00` to `50 4B`), we can try an easier route first. If the file is unencrypted and merely has a damaged header, the plaintext contents of the internal files might still be fully visible inside the raw binary data.

3. **Extracting Strings:** We simply run the `strings` command against the corrupted archive to see if any readable text survived.

   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Almost_there]
   └─$ strings backup.zip 
   flag.txtUT	
   SecLeaf{repair_the_archive}
   flag.txtUT
   ```
   The flag pops right out! The archive's internal structure was damaged, but the text payload was perfectly intact.

### Output

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Almost_there]-(23-05-2026 21:49:28)
└─$ strings backup.zip 
flag.txtUT	
SecLeaf{repair_the_archive}
flag.txtUT
```
