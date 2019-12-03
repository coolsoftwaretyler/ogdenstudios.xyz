---
layout: post
title:  "Leetcode problem: K-th Symbol in Grammar"
tags: [leetcode]
description: "A medium-level leetcode problem"
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/k-th-symbol-in-grammar/)

On the first row, we write a `0`. Now in every subsequent row, we look at the previous row and replace each occurence of `0` with `01`, and each occurrence of `1` with `10`.

Given row `N` and index `K`, return the `K`-th indexed symbol in row `N`. The values of `K` are `-indexed. 

### Examples

**Input:** N = 1, K = 1
**Output:** 0

**Input:** N = 2, K = 1
**Output:** 0

**Input:** N = 2, K = 2
**Output:** 1

**Input:** N = 4, K = 5
**Output:** 1

**Explanation:** 

row 1: 0
row 2: 01 
row 3: 0110
row 4: 01101001

## Solution 

### Intuition 

Based on the generating of the rows, I have a feeling there's a mathematical solution to this that's faster than a data structure based algorithm. 

To get a feel for what's going on and how I might express it mathematically, I'm going to manually write out the pattern. 

Looking at four rows: 

```
0
01
0110
01101001
0110100110010110
```

I notice that the number of items in each row is `2^N`. Which suggests to me there might be some bitwise solution here, which also feels right considering all the `0` and `1` values. 

### Answer