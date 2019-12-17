---
layout: post
title:  "Leetcode problem: Smallest Range I"
tags: [leetcode, 'post']
description: "An easy-level leetcode problem"
date: 2019-11-11
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/smallest-range-i/)

Given an array `A` of integers, for each integer `A[i]` we may choose any `x` with `-K <= x <= K`, and add `x` to `A[i]`.

After this process, we have some array `B`.

Return the smallest possible difference between the maximum value of `B` and the minimum value of `B`.

### Example output 

**Input**: A = [1], K = 0
**Output**: 0
**Explanation**: B = [1]

**Input**: A = [0,10], K = 2
**Output**: 6
**Explanation**: B = [2,8]

**Input**: A = [1,3,6], K = 3
**Output**: 0
**Explanation**: B = [3,3,3] or B = [4,4,4]

## Solution 

So I totally whiffed it on my initial attempts. It's marked easy, and the prompt uses array, so I got tunnel-visioned looking for an answer that used array mapping, filtering, or some other O(n) kind of algorithm, which is somewhat typical in the easy problems that I've encountered so far. 

I initially tried to map array `A` to a new array `B`, and use some logic in the mapping function to determine which value of `x` I should use. But that was doing a ton of work, and I couldn't really come up with the correct rhyme or reason for any array of more than two elements. 

Turns out the answer was more straightforward than I was making it, and I was approaching it all wrong. 

To find the smallest possible difference between the maximum value of `B` and the minimum value of `B`, the trick is to subtract the absolute value of `K` from the greatest value in `A`, and then subtract from that the addition of the least value in `A` plus the absolute value of `K`. If that result is *less than 0*, the answer is 0. Otherwise, return the computed value.

As soon as I saw this solution in the discussion section, I recognized it from my middle school math teacher's weekly brain teasers. It can feel bad to miss the mark like that, but I suppose I'll try again tomorrow! 

You can express this solution in JavaScript like so: 

```
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var smallestRangeI = function(A, K) {
    
    let max = A.reduce(function(a, b) {
    return Math.max(a, b);
    });
    
    let min = A.reduce(function(a, b) {
       return Math.min(a, b); 
    });
    
    let result = (max - Math.abs(K)) - (min + Math.abs(K));
    
    return (result > 0) ? result : 0
};
```