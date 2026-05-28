---
layout: page
title: "Force-push won't save you"
major_type: CTF
parent_group: SecLeaf
sub_module: Forensics
summary: "Digging deep into Git internals, reflogs, and exclusions to uncover a hidden flag."
---

## Description

A developer force-pushed several times before the repository was archived.

We suspect sensitive data may still exist somewhere in the project history.

Some objects may no longer be referenced.

**Flag format:** `SecLeaf{}`

## Approach

The challenge provides a zip archive (`challenge.zip`) containing a Git repository named `force-push-wont-save-you`. The goal is to find the real flag matching the pattern `SecLeaf{..}`. The challenge name itself is a hint — force-pushing rewrites history, but Git keeps a lot more state than most developers realize.

### Step 1: Unzip and Inspect the Archive

```bash
unzip -l challenge.zip
```

The archive contained a single Git repository with `app.js` and the `.git/` directory.

### Step 2: Enumerate Git History

```bash
git log --all --oneline
```

**Output:**
```
ebcdf22 final
04352ce fix
64e9d7f WIP on master: 3859618 final cleanup     ← stash
1596979 index on master: 3859618 final cleanup    ← stash index
3859618 final cleanup
2877024 urgent cleanup
b7d5c13 remove sensitive file before push
0fbc9b5 temporary env file
5b33ec1 initial commit
```

The commit names were already suspicious: "remove sensitive file before push", "urgent cleanup", "final cleanup". The developer clearly panicked and tried to erase something. Checking `git reflog --all` revealed an abandoned branch `backup/recovery`.

### Step 3: Hunt All SecLeaf Strings Across Git Objects

We can dump all objects in the repo and `grep` for the flag:
```bash
for obj in $(git cat-file --batch-all-objects --batch-check | awk '{print $1}'); do
  content=$(git cat-file -p $obj 2>/dev/null)
  echo "$content" | grep "SecLeaf" && echo "FOUND in $obj"
done
```

This revealed **three decoy flags** planted across the object store:
| Location | Content |
|---|---|
| blob `738689a` (`.env` file, commit `0fbc9b5`) | `FLAG=SecLeaf{not_the_real_flag}` |
| blob `6d7e0a0` (dangling/lost-found object) | `SecLeaf{fake_dangling_flag}` |
| blob `24dab13` (`secrets.txt` in orphaned branch) | `SecLeaf{still_fake}` |

### Step 4: Exhausting All Git Internals

After ruling out all blobs, commits, trees, stash, reflog, notes, and tags, the next logical area was Git's non-object metadata files:

```bash
cat .git/config           # remote config — nothing
cat .git/description      # default text — nothing  
cat .git/COMMIT_EDITMSG   # last commit message — nothing
cat .git/ORIG_HEAD        # old HEAD before merge/rebase — nothing
cat .git/info/exclude     # gitignore-style file for local exclusions
```

**`.git/info/exclude`:**
```
SecLeaf{history_was_the_trap}
```

**The real flag was hiding in `.git/info/exclude`** — a file almost nobody ever checks. It functions like `.gitignore` but is local to the repository clone and never committed to history.

### Summary of All Decoys vs. the Real Flag

| Location | Content | Real? |
|---|---|---|
| `.env` blob (commit `0fbc9b5`) | `SecLeaf{not_the_real_flag}` | ❌ Decoy |
| `lost-found/other/6d7e0a0` | `SecLeaf{fake_dangling_flag}` | ❌ Decoy |
| `secrets.txt` on orphaned branch (`a197682`) | `SecLeaf{still_fake}` | ❌ Decoy |
| Git stash `app.js` | `AWS_SECRET=AKIAFAKEKEY` | ❌ Decoy |
| `.git/info/exclude` | `SecLeaf{history_was_the_trap}` | ✅ **REAL FLAG** |
