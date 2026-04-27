---
layout: page
title: "Nullcon Berlin HackIM 2025 CTF – Misc: USB Storage"
summary: "Writeup from Nullcon Berlin HackIM 2025 CTF"
major_type: "CTF"
parent_group: "Nullcon HackIM 2025"
sub_module: ""
date: 2026-04-27
---


## Objective  
The challenge story states:  
> *I attached my friend's USB drive to my laptop and accidentally copied a private file, which I immediately deleted. But my friend still somehow got the file from looking at the USB message their drive recorded…*  

The goal is to analyze the given USB capture file and recover the **flag** hidden inside.  

---

## Attachments  
- Challenge file: [`usbstorage.pcapng.gz`](/assets/img/ctf_assets/usbstorage.pcapng.gz)  

---

## Approach  

We are given a packet capture (`.pcapng`) related to USB traffic. Since USB storage protocols can transfer raw file data, it is possible that the deleted file is still present in the capture.  

---

### Step 1: Extract the provided file  

```bash
gunzip usbstorage.pcapng.gz
ls
# usbstorage.pcapng
```
Purpose: Decompress the provided .gz file to get the raw usbstorage.pcapng.

### Step 2: Inspect with binwalk
```bash
binwalk usbstorage.pcapng
```
Output:
```bash
1343984       0x1481F0        gzip compressed data, from Unix, last modified: 1970-01-01 00:00:00 (null date)
```
Purpose: Check the .pcapng for hidden or embedded files. We find a gzip-compressed data stream inside.

### Step 3: Extract the embedded file
```bash
binwalk -e usbstorage.pcapng
cd _usbstorage.pcapng.extracted
ls
# 1481F0
```
Purpose: Use binwalk -e to automatically extract the hidden data. This creates a directory with the extracted file.

### Step 4: Identify the extracted file
```bash
file 1481F0
# POSIX tar archive (GNU)
```
Purpose: Verify the file type. The extracted file is actually a tar archive.

### Step 5: Unpack the tar archive
```bash
tar -xvf 1481F0
# flag.gz
```
Purpose: Extract the contents of the tar archive, revealing a compressed file named flag.gz.

### Step 6: Decompress the flag
```bash
gunzip flag.gz
ls
# flag

file flag
# ASCII text

cat flag
ENO{USB_STORAGE_SHOW_ME_THE_FLAG_PLS}
```
Purpose: Decompress flag.gz to get the final flag file, then read its contents to recover the CTF flag.

✅ Flag successfully recovered.

---
## Flag
```bash
ENO{USB_STORAGE_SHOW_ME_THE_FLAG_PLS}
```
---
