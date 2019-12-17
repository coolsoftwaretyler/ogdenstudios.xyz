---
layout: post
title:  "Leetcode problem: K-th Symbol in Grammar"
tags: [leetcode, 'post']
description: "A medium-level leetcode problem"
date: 2019-12-03
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

What's more, looking at the way that the pattern stacks (every row `N` is the beginning of the next row `N+1`), I don't think `N` really matters. I think there's something I can do with `K`. 

I'm feeling really good about there being an existing binary operation I can do, but I just can't quite find it or reason about it. I've mentioned this in other posts, but I'm definitely weak when it comes to binary operations and using them for problem solving. This probably comes from my day-to-day in web development, where I'm just not using that kind of problem-solving tool. 

So I looked up the discussion answer and I was absolutely on the right track. There is a single arithmetic I can do, in binary, and ignoring `N` completely. 

### Answer

[Here's a Python one-liner](https://leetcode.com/problems/k-th-symbol-in-grammar/discuss/415514/Python-one-line-solution) which converts `K-1` into its binary representation, counts how many times `1` appears in that representation, and runs a bitwise AND operation on the result. 

I couldn't quite grok what was going on and why, but I found [this explanation](https://leetcode.com/problems/k-th-symbol-in-grammar/discuss/113736/PythonJavaC%2B%2B-Easy-1-line-Solution-with-detailed-explanation) which helps more. 

Basically, since we know the prefix of every row `N` is the same, we only care about how the new row `N+1` is going to generate its new string up to `K`, which will depend on the number `K-1`. 

If we know what `K-1` in binary is, we'll know how many times the `01` and `10` pattern toggles back and forth before the number we care about, `K`. 

So we convert it over, count up the `1s`, and convert that number into binary. We then run [bitwise AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) against it to determine the `K`th value. 

We don't have all the syntactic sugar that comes along with Python, Java, and C++ for bitwise operations, so here's a way to represent it in JavaScript: 

```
var kthGrammar = function(N, K) {
    let binary = (K-1).toString(2);
    let array = binary.split('');
    let count = 0;
    for (let i=0; i<array.length; i++) {
        if (array[i] === '1') {
            count++;
        }
    }
    return count & 1;
};
```