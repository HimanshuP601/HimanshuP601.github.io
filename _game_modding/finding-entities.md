---
layout: page
title: Finding the Local Player Entity structure
summary: A workflow on locating the root pointer offset for custom engine games using Cheat Engine.
game: AssaultCube (Practice)
tags: [Cheat Engine, Pointer Scanning, RE]
date: 2026-04-27
---

## Introduction

Finding the local player base is the first step in game modding. Without it, you cannot reliably track health, position, or inventory across game restarts.

## Finding Dynamic Addresses
First, find your health value:
1. Attach Cheat Engine
2. Scan for exact value (e.g., `100` float)
3. Take damage -> Next Scan for new value
4. Add to address list

### Finding the Static Pointer
Once you have the dynamic address, Right Click -> *Find out what accesses this address*.

```assembly
// You will usually see an instruction like this:
mov eax, [rcx + 0xF8]
```
The base address is whatever is inside `RCX`. You must then pointer scan back up the chain until you reach a green static module address (e.g., `game.exe + 0x1A2B3C`).

## Reversing the Structure
Once you have the pointer, you can put it into ReClass.NET!
