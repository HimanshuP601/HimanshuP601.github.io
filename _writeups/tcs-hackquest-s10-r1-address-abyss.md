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

6. I just created a script to automate this task (extracting all indices characters). At this point I was not sure how to get them in sequence, I just ran my script:

![Address Abyss Output](/assets/images/writeups/tcs-hackquest/05-address-abyss.png)

7. Yes, that output doesn't make total sense natively, but notice that it contains readable characters at the start. Even the pattern was:
   `HQX?e1f63411d030814e5cb7eebb0860d9f4?`
   Which really seems like a flag after interchanging `?` to `{` and `}`.

8. After trying the corrected flag format, it succeeded.
