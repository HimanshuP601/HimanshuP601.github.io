---
layout: page
title: "ImaginaryCTF Forensics - wave"
summary: "Writeup from ImaginaryCTF 2025"
major_type: "CTF"
parent_group: "ImaginaryCTF 2025"
sub_module: ""
date: 2026-04-27
---


---

## **Objective**
We are given a `.wav` file and the following hint:
not a steg challenge i promise

Attachments provided: /assets/img/ctf_assets/wave.wav


The goal is to find the flag hidden within this file.

---

## **Initial Thoughts**
The hint clearly states that **this is not a steganography challenge**.  
This suggests we **shouldn't waste time using tools like `binwalk`, `zsteg`, or deep audio analysis**.

Instead, we should **start with the basics**:
- Run `strings` to search for any readable text inside the file.
- Look at file metadata, as `.wav` files often contain comments or metadata sections.

---

## **Exploration**

We begin by listing the directory contents:

```bash
ls
```
Output:
```bash
wave.wav
```
Now, let's run strings on the file:
```bash
strings wave.wav | head -n 10
```
Output:
```bash
COMM
ictf{obligatory_metadata_challenge}
RIFF
WAVEfmt 
data8
%	b	
)	h	
?	w	
	W	Y
 	]	
```
### Analysis
From the very first few lines, we immediately spot the flag:
```bash
ictf{obligatory_metadata_challenge}
```
This confirms the challenge was purely about checking the file metadata or raw contents — no hidden data or steganography required.

### Why This Approach Works
- The challenge explicitly hinted:
    "not a steg challenge i promise"
This suggests that basic inspection is the correct path.
- .wav files can store metadata tags like:
 - COMM (Comments)
 - RIFF (Standard header structure)
Running strings revealed that the flag was stored in the COMM (comment) section.- Using complex steganography tools like binwalk would be unnecessary and a waste of time here.
---
## Final Flag
The flag is:
```bash
ictf{obligatory_metadata_challenge}
```
---
