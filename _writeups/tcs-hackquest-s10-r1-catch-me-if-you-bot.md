---
layout: page
title: "Catch Me If You Bot"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Bypass a time-limited challenge by extracting hidden paths and utilizing a custom user-agent."
---

**Flag:** `HQX{48f0b6ae4c34f08ec8da92bf818378a3}`

## Approach (Step by Step)

1. The provided website included a timer of 60 seconds and nothing else.
2. In order to gain more information I used `robots.txt` and it fortunately resulted in some information (`botname = HQBOT`).
3. It clearly hints that there exists a special user-agent `HQBOT`.
4. But where to use this information? In search of more information I checked `sitemap.xml` which resulted in some more hidden paths (like index, blog, portfolio, and developer):

### Hidden Paths:
```xml
<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>http://challenge.tcshackquest.com:23791/</loc></url>
    <url><loc>http://challenge.tcshackquest.com:23791/index.html</loc></url>
    <url><loc>http://challenge.tcshackquest.com:23791/blog.html</loc></url>
    <url><loc>http://challenge.tcshackquest.com:23791/devl0per-2754d622cf.html</loc></url>
    <url><loc>http://challenge.tcshackquest.com:23791/portfolio-details.html</loc></url>
    <url><loc>http://challenge.tcshackquest.com:23791/blog-single.html</loc></url>
</urlset>
```

5. Among all paths, the developer path had a random integer which hinted that at each attempt this specific path integer changes. (e.g., `http://challenge.tcshackquest.com:23791/devl0per-2754d622cf.html`)
6. Every other path worked with the default user-agent except the special developer one. Hence, after using the special user-agent `HQBOT`, it succeeded, but even after that it seemed to redirect to a different path (`/dev-website`).
7. Requesting each path was difficult due to the 60-second time limit; exceeding the time resulted in rejection of requests.
8. Hence to solve this challenge, I used `curl` with the special `-H` option to set the `User-Agent`.
9. After several tries I managed to make a successful request to `/dev-website` and got the flag.

### Output:

![Bot Flag Capture 1](/assets/images/writeups/tcs-hackquest/08-catch-me-bot-flag-1.png)

![Bot Flag Capture 2](/assets/images/writeups/tcs-hackquest/09-catch-me-bot-flag-2.png)
