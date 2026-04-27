---
layout: page
title: privilege-escalation-detector
summary: A real-time Windows daemon that detects common privilege escalation patterns via API hooking.
tags: [C++, Windows, API Hooking]
---

## Privilege Escalation Detection System

This tool monitors common escalation indicators on a Windows endpoint, including:
1. Unauthorized Token Duplication
2. Suspicious process lineage
3. Registry run-key modification

### Implementation

The core logic revolves around deep hooking of Win32 APIs like `CreateProcessWithTokenW` and implementing heuristic checks on the calling thread's security descriptors.

```cpp
// Example pseudocode snippet
if (CheckTokenMembership(NULL, AdministratorsGroup, &bIsAdmin)) {
    LogSuspiciousActivity("Process spawned with Admin token directly");
}
```

This project helped me understand the delicate intricacies of Windows Access Tokens.
