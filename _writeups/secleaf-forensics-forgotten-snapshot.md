---
layout: page
title: "Forgotten Snapshot"
major_type: CTF
parent_group: SecLeaf
sub_module: Forensics
summary: "Extracting hidden metadata from a recovered snapshot image."
---

## Description

We recovered this image from a damaged backup archive.

Analysts believe the original owner attempted to conceal sensitive information before deletion.

Some image data may have survived recovery.

**Flag format:** `SecLeaf{}`

## Approach

The challenge gives us a recovered image file named `snapshot.jpg`. In forensics challenges involving images, one of the first steps is always to check the file's strings and metadata. The description hints at "concealed sensitive information" that "survived recovery", pointing strongly toward metadata or string extraction.

1. **Extracting Strings:** We run the `strings` command on the image and pipe the output to `grep` looking for the standard flag format (`Sec`).
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Forgotten_snapshot]
   └─$ strings snapshot.jpg | grep "Sec"
   SecLeaf{metadata_never_lies}
   ```
   The flag pops out immediately.

2. **Verifying with Metadata:** To see exactly where this was hidden, we can use the `file` command, which reads image metadata (like Exif or comments).
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Forgotten_snapshot]
   └─$ file snapshot.jpg 
   snapshot.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, comment: "SecLeaf{metadata_never_lies}", progressive, precision 8, 528x500, components 3
   ```
   The output shows that the flag was stored directly in the JPEG's `comment` segment.

### Output

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Forgotten_snapshot]-(23-05-2026 18:33:40)
└─$ strings snapshot.jpg | grep "Sec"
SecLeaf{metadata_never_lies}

┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/FORENSICS_Forgotten_snapshot]-(23-05-2026 18:33:54)
└─$ file snapshot.jpg 
snapshot.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, comment: "SecLeaf{metadata_never_lies}", progressive, precision 8, 528x500, components 3
```

**Flag:** `SecLeaf{metadata_never_lies}`
