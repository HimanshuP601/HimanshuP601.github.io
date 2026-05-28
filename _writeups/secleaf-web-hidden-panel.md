---
layout: page
title: "Hidden Panel"
major_type: CTF
parent_group: SecLeaf
sub_module: Web
summary: "Finding a flag left behind in a robots.txt file."
---

## Description

We discovered a partially exposed internal web portal during reconnaissance.

Developers claimed sensitive endpoints were "properly hidden."

Can you discover what was left behind?

**Link:** `https://s3.secleaf.tech/`

**Flag format:** `SecLeaf{}`

## Approach

The challenge involves a web portal where developers claim sensitive endpoints are "properly hidden". One of the most common ways developers "hide" endpoints from search engines is by using a `robots.txt` file. While this stops legitimate crawlers (like Googlebot) from indexing those pages, it acts as a treasure map for attackers, explicitly listing the sensitive directories!

1. **Checking `robots.txt`:** We use `curl` to fetch the `robots.txt` file from the root directory of the provided URL.
   
   ```bash
   ┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/WEB_Hidden_panel]
   └─$ curl https://s3.secleaf.tech/robots.txt
   ```

2. **Analyzing the Output:** The output returns a large file containing standard Cloudflare content signals and user-agent blocks. 
   
   Towards the bottom, we see the expected hidden endpoints:
   ```text
   User-agent: *

   Disallow: /admin/
   Disallow: /backup/
   Disallow: /panel-final/
   ```

   But right below that, the developers made a critical mistake. They left a temporary comment containing the flag itself!

   ```text
   # temporary developer note:
   # SecLeaf{r0b0ts_sh0uldnt_t4lk}
   ```

### Output

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/ctf/SecLeaf/WEB_Hidden_panel]-(23-05-2026 19:35:29)
└─$ curl https://s3.secleaf.tech/robots.txt | grep Sec     
# SecLeaf{r0b0ts_sh0uldnt_t4lk}
```
