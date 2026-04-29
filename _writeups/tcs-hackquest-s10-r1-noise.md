---
layout: page
title: "Noise"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Identify a hidden string in a noisy binary file using strings and grep."
---

**Flag:** `HQX{543c40987f3de029de611d3649428016}`

## Approach (Step by Step)

1. The line *'Somewhere in that mess, a flag is hiding in plain sight.'* hints that the flag is surely in a plaintext, i.e., easy to visible / proper format within the file.
2. So I just extracted the zip file and got an `.opt` file and when I used the `strings` command on it to get readable text, I found multiple `HQX` texts messed up, among them all I got to see the actual flag.
3. Just to filter it out I used `grep` along `strings` with regex: `'HQX\{[^}]{6,}\}'`
4. This regex finds a proper string with at least length of 6 between `{}`, to filter out all `HQX{}` (empty flags), any number would be fine, I randomly choose 6.

### Output:

{% raw %}
```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/noise]-(13-12-2025 10:13:54)
└─$ strings a729Ea1b97.opt | grep -E 'HQX\{[^}]{6,}\}'
HQX{4.MHQX{}!
HQX{Xr[HQX{}
[HQX{=iHHQX{}
>$HQX{8"aHQX{}
HQX{543c40987f3de029de611d3649428016} HQX{
_HQX{HQX{HQX{}
HQX{oHQX{h}
}HQX{HQX{-b}
HQX{%coX#h}
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/noise]-(13-12-2025 10:14:28)
└─$
```
{% endraw %}

(actual output was big, I just skipped some for better visibility)

Later, used 10 instead of 6 to filter further.
