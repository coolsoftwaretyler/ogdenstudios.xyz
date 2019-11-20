---
layout: post
title:  "Leetcode problem:  Sort Array By Parity II"
tags: [leetcode]
description: "An easy-level leetcode problem"
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/sort-array-by-parity-ii/)

Given an array `A` of non-negative integers, half of the integers in `A` ar odd, and half of the integers are even. 

Sort the array so that whenever `A[i]` is odd, `i` is odd. And when `A[i]` is even, `i` is even. 

You may return any answer array that satisfies this conditions. 

### Examples

**Input:** `[4,2,5,7]`
**Output:** `[4,5,2,7]`
**Explanation:** `[4,7,2,5]`, `[2,5,4,6]`, `[2,7,4,5]` would also have been accepted.

## Solution 

### Intuition 

OK, so it looks like we don't have to actually *sort* the array in any meaningful way. We can probably do something with it in-place. We also know we'll always have enough numbers to fill the pattern, since half of the integers are odd and half are even. 

Can we do this in place? Let's look at the example: 

`[4, 2, 5, 7]`

Check `A[0]`. It's `4`. OK, it's all good since `i` and `A[i]` are both even.

Now check `A[2]`, it's `2`. `i` is odd, but `A[i]` is even. We need to move it. I almost want to just swap it with the next value, but I am pretty sure that won't work all the time so I'm going to leave it alone. 

What if we stored all of the even numbers in an array called `even` and all the odd numbers in an array called `odd`? We could then rebuild an array and pull a number from each depending on the parity of the number. 

I'm worried about basically running two loops and using three arrays. But I think it's still technically O(n), and the space constraints will only ever be 2n. Maybe that's reasonable. Let's find out. 

Here's my first pass at expressing this solution in JavaScript (ES6): 

```
var sortArrayByParityII = function(A) {
    let even = [];
    let odd = [];
    let result = [];
    for (let i=0; i<A.length; i++) {
        if (A[i] % 2 === 0) {
            even.push(A[i]);
        } else {
            odd.push(A[i]);
        }
    }
    for (let j=0; j<A.length; j++) {
        if (j % 2 === 0) {
            result[j] = even.pop();
        } else {
            result[j] = odd.pop();
        }
    }    
    return result;
};
```

It passed, faster than 51.97% of JS solutions, and with less than 27.27% of JS solutions. I wonder where I can optimize it. It feels like I *should* be able to do something in one loop, but I can't really reckon with it. 

### Answer

After checking the discussion section, I found there *is* a one-loop solution. It's not too far off from my first pass. 

First, you set up an empty array, which you'll use as the result. Call it `result`.

Then you set an `evenIndex` to 0, and an `oddIndex` to `. 

You loop through the input array `A`. If `A[i]` is even, you set `result[evenIndex]` to the value and increment `evenIndex` by two. If it's odd, you set `result[oddINdex]` to the value and increment `oddIndex` by two. 

You can express it like this: 

```
var sortArrayByParityII = function(A) {
    let result = [];
    let evenIndex = 0;
    let oddIndex = 1;
    for (let i=0; i<A.length; i++) {
        if (A[i] % 2 === 0) {
            result[evenIndex] = A[i];
            evenIndex += 2;
        } else {
            result[oddIndex] = A[i];
            oddIndex += 2;
        }
    }
    return result;
}
```

And it runs faster than 86% of JS solutions with less memory than 36% of other solutions. Nice! 

After having done a dozen or so easy problems, I'm really starting to see most Leetcode easy problems as array mapping solutions. 