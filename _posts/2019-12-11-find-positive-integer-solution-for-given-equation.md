---
layout: post
title: ""
tags: []
description: ""
---


## Problem description

[Problem on leetcode](https://leetcode.com/problems/find-positive-integer-solution-for-a-given-equation/)

Given a function `f(x, y)` and a value `z`, return all positive integer pairs `x` and `y` where `f(x,y) == z`.

The function is constantly increasing, i.e.:

```
f(x, y) < f(x + 1, y)
f(x, y) < f(x, y + 1)
```

The function interface is defined like this: 

```
interface CustomFunction {
public:
  // Returns positive integer f(x, y) for any given positive integer x and y.
  int f(int x, int y);
};
```

For custom testing purposes you're given an integer function_id and a target z as input, where function_id represent one function from an secret internal list, on the examples you'll know only two functions from the list.  

You may return the solutions in any order.

### Examples

Example 1:

Input: function_id = 1, z = 5
Output: [[1,4],[2,3],[3,2],[4,1]]
Explanation: function_id = 1 means that f(x, y) = x + y

Example 2:

Input: function_id = 2, z = 5
Output: [[1,5],[5,1]]
Explanation: function_id = 2 means that f(x, y) = x * y

### Constraints

* 1 <= function_id <= 9
* 1 <= z <= 100
* It's guaranteed that the solutions of f(x, y) == z will be on the range 1 <= x, y <= 1000
* It's also guaranteed that f(x, y) will fit in 32 bit signed integer if 1 <= x, y <= 1000

## Solution 

### Intuition 

My first thought is to just brute force it and use nested loops. Check every value for x, and every value for y, up to 1000. Loop through those two iterators and check if the function equals `z`, and if so, push an array of numbers into it.

Here's how I expressed that: 

```
var findSolution = function(customfunction, z) {
    let result = [];
    for (let x=1; x<1001; x++) {
        for (let y=1; y<1001; y++) {
            if (customfunction.f(x,y) == z) {
                result.push([x,y]);
            }
        }
    }
    return result;
};
```

It's brute force and runs in O(n^2) but it works, and looking at the other solutions, seems to be where most people landed.

When I first wrote it, I indexed at 0 and failed a bunch. So make sure you go from 1..1000 in your loops. 

I also initially set `z + 1` as the constraint on the loops, and it worked, but I think that's a fluke and not actually "correct". 
