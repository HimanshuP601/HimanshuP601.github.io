---
layout: page
title: x86_64 Assembly Quick Reference
summary: A handy cheat sheet for common x86_64 instructions and calling conventions.
tags: [Assembly, Reverse Engineering]
date: 2026-04-24
---

## Calling Convention (System V AMD64 ABI)

When reversing linux binaries, it's critical to know how arguments are passed to functions.

*   **Arg 1:** `rdi`
*   **Arg 2:** `rsi`
*   **Arg 3:** `rdx`
*   **Arg 4:** `rcx`
*   **Arg 5:** `r8`
*   **Arg 6:** `r9`
*   **Return Value:** `rax`

## Common Instructions

*   `mov rax, rbx`: Copy value from rbx into rax.
*   `lea rax, [rbx+8]`: Load effective address (calculate rbx+8 and put it in rax, often used for math too).
*   `test rax, rax`: Logical AND, often used right before a `jz` or `jnz` to check if a value is zero.
*   `xor rax, rax`: Fastest way to zero out a register.

Always verify the stack alignment before making function calls in your shellcode!
