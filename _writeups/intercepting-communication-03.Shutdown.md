---
layout: page
title: "🚩 Challenge: Shutdown"
summary: "Writeup from Intercepting Communication"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Intercepting Communication"
date: 2026-04-27
---


**Task:**  
From your host at `10.0.0.1`, connect to the remote host at `10.0.0.2` on port `31337`, and then **shutdown the connection** after you're done sending data.

---

## 🧠 Understanding the Challenge

The server waits to receive all data from the client. It only sends back the **flag** when it sees the client has closed its **sending side** (EOF). This is common in protocols where the server must process all input before responding.

We cannot simply send a string like `"END"` because:
- Network packets might be fragmented or merged.
- `"END"` could appear in actual data, causing confusion.

Instead, we signal the end of input **cleanly** by **shutting down the socket for writing** — this is equivalent to closing `stdin`.

---

## 🛠️ Solution with Netcat

We use the `-N` option with `netcat` (if supported), which tells `nc` to close the connection properly after reaching EOF on stdin.

### ✅ Command:

```bash
nc -N 10.0.0.2 31337
```
If -N isn't supported, you can connect with nc 10.0.0.2 31337, then press Ctrl-D manually to send EOF.

### Example Output
```
root@ip-10-0-0-1:~# nc -N 10.0.0.2 31337
pwn.college{3ndlY_ShUtDoWn_ExPlIcIt}
```
---
