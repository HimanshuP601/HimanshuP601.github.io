---
layout: page
title: "Paper Scripts"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Extract a hidden flag from malicious JavaScript embedded within a PDF file."
---

**Flag:** `HQX{2e05d5c636776f6dc52e158f266cfb0c}`

## Approach (Step by Step)

1. The description hints the challenge is a forensic/steganography challenge.
2. After extracting the zip file, I got a `.pdf` file.
3. Just to get more information, I used `pdfid`:

### Output:
```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/paper script]-(13-12-2025 12:23:10)
└─$ pdfid 4F8aD5D762.pdf
PDFiD 0.2.10 4F8aD5D762.pdf
PDF Header: %PDF-1.7
obj        32
endobj     32
stream     7
endstream  7
xref       1
trailer    1
startxref  1
/Page      1
/Encrypt   0
/ObjStm    0
/JS        1
/JavaScript 2
/AA        0
/OpenAction 0
/AcroForm  0
/JBIG2Decode 0
/RichMedia 0
...
```

4. Clearly, we can see a JavaScript block is embedded in the PDF, hence I used another tool `pdfinfo` with the `-js` option.

### Output:
```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/paper script]-(13-12-2025 12:23:13)
└─$ pdfinfo -js 4F8aD5D762.pdf
Name Dictionary "9bfabf7e-40b0-4573-b6dc-1442aea2415f":
var
_0x790b=['\x32\x38\x31\x35\x38\x38\x67\x6a\x48\x79\x61\x43',...];
var _0x407b=function(_0x294226,_0x4a3243){...};
...
var _0x870b = '\x48'+'\x51'+'\x58'+'\x7b'+'\x32'+'\x65'+'\x30'+'\x35'+'\x64'+'\x35'+'\x63'+'\x36'+'\x33'+'\x36'+'\x37'+'\x37'+'\x36'+'\x66'+'\x36'+'\x64'+'\x63'+'\x35'+'\x32'+'\x65'+'\x31'+'\x35'+'\x38'+'\x66'+'\x32'+'\x36'+'\x36'+'\x63'+'\x66'+'\x62'+'\x30'+'\x63'+'\x7d';
console['\x6c'+'\x6f'+'\x67'](_0x870b);
```

5. The variable `_0x870b` contains a suspicious hex string. After concatenating and converting it into ASCII characters, I found the flag.
