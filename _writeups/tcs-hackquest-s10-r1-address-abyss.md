---
layout: page
title: "Address Abyss"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Reconstruct a flag by extracting positional characters embedded within IPv4 and IPv6 network logs."
---

**Flag:** `HQX{e1f63411d030814e5cb7eebb0860d9f4}`

## Approach (Step by Step)

1. We are given a large dump of network logs. The challenge states that only specific IP address patterns are meaningful:
   * **IPv4 pattern:** `92.7.X.Y`
     * `X` → index (decimal)
     * `Y` → character
   * **IPv6-like pattern:** `2510:a1:X::Y`
     * `X` → index (hexadecimal)
     * `Y` → character

2. Our task is to:
   * Extract valid (index, character) pairs from these IPs.
   * Arrange characters according to their indices.
   * Reconstruct the flag in the format `HQX{...}`.

3. **Pattern Identification:**
   The first step is to filter the dataset and retain only entries that strictly match the two formats given in the problem statement. Any entry outside these patterns is discarded immediately. This prevents unrelated network noise from contaminating the reconstruction process.

4. **Normalization of Indices:**
   Since IPv6-like indices are hexadecimal, they are converted to decimal so that:
   * All indices exist in the same numeric space.
   * Characters from IPv4 and IPv6-like entries can be merged correctly.
   At this stage, each valid entry contributes exactly one (index → character) mapping.

5. The flag is positional, meaning:
   * Index 0 corresponds to the first character
   * Index 1 to the second, and so on.

6. I created a script to automate this task (extracting all indices characters and sorting them):

```python
import re

flag_chars = {}

with open('ip_logs_2F7Ecc0bba.txt', 'r') as f:
    for line in f:
        line = line.strip()
        
        # Match IPv4 pattern: 92.7.X.Y (X=decimal index, Y=ASCII code)
        m1 = re.match(r'^92\.7\.(\d+)\.(\d+)$', line)
        if m1:
            idx = int(m1.group(1))
            char = chr(int(m1.group(2)))
            flag_chars[idx] = char
        
        # Match IPv6-like pattern: 2510:a1:X::Y (X=hex index, Y=character)
        m2 = re.match(r'^2510:a1:([0-9a-fA-F]+)::(.)$', line)
        if m2:
            idx = int(m2.group(1), 16)
            char = m2.group(2)
            flag_chars[idx] = char

# Sort by index and reconstruct the string
flag = ""
for idx in sorted(flag_chars.keys()):
    flag += flag_chars[idx]

print(flag)
```

7. Running the script gave me the reconstructed string:

![Address Abyss Output](/assets/images/writeups/tcs-hackquest/05-address-abyss.png)

8. The raw output was:
   `HQX?e1f63411d030814e5cb7eebb0860d9f4?`
   Which is basically the flag after correcting the curly braces from `?` to `{` and `}`.

9. After correcting the format, the flag was accepted!

