---
layout: page
title: "The Invoice Incident"
major_type: CTF
parent_group: SecLeaf
sub_module: MISC
summary: "Analyzing mail and endpoint logs to reconstruct a phishing attack chain."
---

## Description

At 09:14 AM, a finance employee reported receiving an urgent invoice email. Shortly after, suspicious activity began on the host.

You have been provided mail and endpoint logs collected during the incident.

Analyze the logs carefully, determine the malicious attachment responsible for the compromise, and submit the flag.

## Approach

This challenge simulates a real-world incident response scenario where we must correlate mail gateway logs with endpoint process logs to reconstruct an attack chain.

### Step 1 — Analyze the Mail Gateway Logs

We begin by reviewing the provided mail logs. Most entries appear normal, benign emails intended to create noise:
```text
ALLOW from=userXX@example.com subject=Routine Update attachment=None
```

However, one entry immediately stands out:
```text
2026-05-02 09:14:03 ALLOW from=billing@micr0soft-support.com
to=finance.aarti
subject=Pending Invoice Notice
attachment=Invoice_April_2026.docm
```

**Indicators of Suspicion:**
1. **Typosquatted Domain:** The sender impersonates Microsoft using `micr0soft` (with a zero replacing the letter `o`).
2. **Social Engineering Subject:** Invoice-themed phishing emails are extremely common because they create urgency.
3. **Dangerous Attachment Type:** The `.docm` extension stands for a Microsoft Word Macro-Enabled Document. These are frequently used to execute VBA macros, launch PowerShell, and download malware.

### Step 2 — Correlate with Endpoint Activity

Next, we inspect the endpoint logs from the finance workstation (`FIN-WS23`). Around the incident timeframe, we observe this sequence:

```text
2026-05-02 09:16:11 host=FIN-WS23 process=WINWORD.EXE file=Invoice_April_2026.docm
```
This confirms the malicious document was opened on the finance workstation.

### Step 3 — Identify Macro Execution

A few seconds later:
```text
2026-05-02 09:16:18 host=FIN-WS23
parent=WINWORD.EXE
process=powershell.exe
cmd=-enc SQBFAFgA
```
This is a classic macro execution chain (`WINWORD.EXE → powershell.exe`). Legitimate Word documents rarely spawn PowerShell. Furthermore, the attacker uses the `-enc` (EncodedCommand) flag to pass Base64-encoded PowerShell, attempting to obfuscate malicious commands.

### Step 4 — Confirm Malicious Network Activity

Finally:
```text
2026-05-02 09:16:24 host=FIN-WS23
process=powershell.exe
netconn=198.51.100.24:80
```
This confirms outbound network communication from PowerShell, fully establishing the compromise chain.

### Root Cause

The compromise was caused by the malicious macro-enabled document `Invoice_April_2026.docm`.

**Flag:** `SecLeaf{Invoice_April_2026.docm}`
