import os
import re
import shutil
import datetime

source_dir = "_migration_temp/CTF-Writeups"
target_dir = "_writeups"
assets_source_dir = os.path.join(source_dir, "assets")
assets_target_dir = "assets/img/ctf_assets"
today = datetime.datetime.now().strftime("%Y-%m-%d")

os.makedirs(target_dir, exist_ok=True)
os.makedirs(assets_target_dir, exist_ok=True)

# 1. Migrate assets safely
if os.path.exists(assets_source_dir):
    for root, _, files in os.walk(assets_source_dir):
        for file in files:
            s = os.path.join(root, file)
            d = os.path.join(assets_target_dir, file)
            shutil.copy2(s, d)

# 2. Process markdown files
migrated_count = 0
for root, _, files in os.walk(source_dir):
    if "/.git" in root.replace("\\", "/"): 
        continue
    
    ctf_name = os.path.basename(root)
    if root == source_dir:
        ctf_name = "CTF"

    for file in files:
        if file.endswith(".md") and file != "README.md":
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Extract dynamic title
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if title_match:
                title = title_match.group(1).strip().replace("\"", "'")
            else:
                title = file.replace('.md', '').replace('-', ' ').title()
            
            # Map asset paths to Jekyll structure
            content = re.sub(r'(/)?assets/', r'/assets/img/ctf_assets/', content)
            content = re.sub(r'\.\./assets/', r'/assets/img/ctf_assets/', content)
            
            # Prepend Front Matter UI Hook
            front_matter = f"""---
layout: page
title: "{title}"
summary: "Writeup from {ctf_name}"
tags: ["{ctf_name}"]
date: {today}
---

"""
            # Clean up the very first heading if it's at the top so it doesn't double-render
            content_lines = content.split('\n')
            if content_lines and content_lines[0].startswith('#'):
                content_lines.pop(0)
            
            new_content = front_matter + '\n'.join(content_lines)
            
            new_filename = f"{ctf_name.replace(' ', '-').lower()}-{file}"
            with open(os.path.join(target_dir, new_filename), 'w', encoding='utf-8') as f:
                f.write(new_content)
                migrated_count += 1

print(f"Migration completed cleanly. {migrated_count} writeups formatted and ported.")
