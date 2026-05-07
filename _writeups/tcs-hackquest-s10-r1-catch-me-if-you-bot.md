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
8. Hence to solve this challenge, I used `curl` with the special `-H` option to set the `User-Agent`. I had to fetch the sitemap to find the active developer URL (which changes rapidly), request it with the `HQBOT` agent, and quickly follow the redirect to the final page containing the flag.
9. Here is the trace of the successful sequence:

```bash
# Fetch sitemap to find the current active path
$ curl http://challenge.tcshackquest.com:23791/sitemap.xml                                       
...
  <url><loc>http://challenge.tcshackquest.com:23791/devl0per-2754d622cf.html</loc></url>
...

# Use HQBOT user-agent to access the restricted developer path
$ curl -L -H "User-Agent: HQBOT" http://challenge.tcshackquest.com:23791/devl0per-2754d622cf.html
<head>
  <meta http-equiv="Refresh" content="0; URL=/dev-website/2754d622cf79d09d074b22c85db7a27c.html" />
</head>

# Follow the redirect to the final flag page
$ curl -L -H "User-Agent: HQBOT" http://challenge.tcshackquest.com:23791/dev-website/2754d622cf79d09d074b22c85db7a27c.html
<!DOCTYPE html>
<html lang="en" >
<head>
  <title>Agent 007 Flag</title>
</head>
<body>
<div class="wrapper">
    <div class="typing">
      You found the flag HQX{48f0b6ae4c34f08ec8da92bf818378a3}.
    </div>
</div>
</body>
</html>
```

### Output:

![Bot Flag Capture 1](/assets/images/writeups/tcs-hackquest/08-catch-me-bot-flag-1.png)

![Bot Flag Capture 2](/assets/images/writeups/tcs-hackquest/09-catch-me-bot-flag-2.png)
