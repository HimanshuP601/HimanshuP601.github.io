---
layout: page
title: "Hidden Layers"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Extract hidden data using LSB steganography on a PNG image."
---

**Flag:** `HQX{24c0ce09e0e044fa1f45a1439d1d48f0}`

## Approach (Step by Step)

1. After extracting the zip file I got a `.png` file. I knew it was a steganography challenge, and even after reading the description it confirmed it was a steganography challenge.
2. Hence I proceeded with `strings`, `exiftool`, and various commands, but the line *‘just you, the pixels and a whisper of something more.’* gave a hint about LSB. I had two methods to use: using `stegolsb` or an online `stegolsb` decoder. I used both and got the same result from both.

### Online Decoder:

![Online LSB Decoder](/assets/images/writeups/tcs-hackquest/01-hidden-layers-decoder.png)

### Stegolsb Tool:

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/layers]-(13-12-2025 10:41:23)
└─$ /home/himanshu/ctf/bin/python ~/.local/bin/stegolsb extract image_4F8aD5D762.png
10:41:50 [INFO] Hidden data:

HQX{24c0ce09e0e044fa1f45a1439d1d48f0}ÿþI$¶Ûm¶Ûmm¶Ûm¶Ûm¶Ûm¶Ûm¶Û
m¶Ûmm¶Ûm¶Ûm¶Ûm¶Ûm¶Ûm¶ÛI$I$I$I$m¶Ûm¶Ûm¶Ûm¶Û¶Ûm¶ÛmI$I$I$I$$IÛ
m¶Ûm¶Ûm¶Ûm¶Ûm¶Ûm¶$I$I$I$I$I$I
```

### Flag with time:

![Flag with time](/assets/images/writeups/tcs-hackquest/02-hidden-layers-flag.png)
