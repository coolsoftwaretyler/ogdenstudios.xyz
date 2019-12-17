---
layout: post
title:  "Leetcode problem: Single Number III"
tags: [leetcode, 'post']
description: "A medium-level leetcode problem"
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/single-number-iii/)

Given an array of numbers `nums`, in which exactly two elements appear only once and all other elements appear exactly twice, find the two elements that appear only once. 

The order of the result is not important. 

The algorithm should run in linear time complexity. Try to implement it with constant space, as well. 

### Examples

**Input:** [1, 2, 1, 3, 2, 5]
**Output:** [3, 5]

## Solution 

### Intuition 

To run in linear time complexity, the solution has to traverse the array once and only once. It'll need to keep track of how many times it sees each element. When I think about keeping track of how many times distinct elements appear, my mind jumps to a [hash table](https://en.wikipedia.org/wiki/Hash_table) or [set](https://en.wikipedia.org/wiki/Set_(abstract_data_type)). 

My big concern is that checking the hash will make the solution worse than linear time. But as a first stab, let's see if it works. Here's how I'm thinking about expressing it in JavaScript: 

```
var singleNumber = function(nums) {
    let tracker = {}; 
    let result = [];
    
    for (let i=0; i<nums.length; i++) {
        if (tracker.hasOwnProperty(nums[i])) {
            tracker[nums[i]] += 1;
        } else {
            tracker[nums[i]] = 1;
        }
    }
    
    for (item in tracker) {
        if (tracker[item] === 1) {
            result.push(item);
        }
    }
    
    return result
};
```

This sets up a [JavaScript Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects), which I can use as a hash map, and an empty results array. 

Then it loops through the `nums` array and checks if the `tracker` object has that number in it. If it does, it increments the count by one. If the hash doesn't have it yet, we set the default value of that key to `1`. 

Then we loop through all the items in tracker. We check if each key's value is `1`. If so, we add it to the `result` array and return it. 

It's only faster than 38.31% of other JavaScript solutions, and uses less space than 66.67% of them. I feel like my suspicions about the time complexity are true: this might technically be linear, but looping through the hash the second time is taking more time than I need. And considering the prompt asks about constant space, I'm thinking there's another approach here that would be faster and take up less space. 

### Answer

The discussion section on Leetcode had an [O(n), constant space solution in JavaScript](https://leetcode.com/problems/single-number-iii/discuss/259512/Javascript-solution-with-O(n)-time-and-O(1)-space-beats-100). You love to see it. The author says: 

1. Use [XOR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) to remove all duplicated numbers;
2. Find the right shift offset where the two single numbers have different bit;
3. With the offset from step 2, divide all numbers into 2 groups, each of which has a single number.

Here's how you express it in JavaScript: 

```
var singleNumber = function(nums) {
    var s = nums.reduce((n1, n2) => n1 ^ n2);
    var offset = 0;
    while (true) {
        if (s & 1 == 1) {
            break;
        }

        offset++;
        s >>= 1;
    }

    var a = 0;
    var b = 0;
    nums.forEach(num => {
        if ((num >> offset) & 1 == 1) {
            a ^= num;
        } else {
            b ^= num;
        }
    });

    return [a, b];
}
```

This is one of those solutions I feel like you can't really reason your way to without understanding some additional concepts, like [XOR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators) and [right shift offset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Unsigned_right_shift). 

If you haven't worked much with bitwise operators (I personally don't in my day-to-day), there's a great discussion post on Leetcode about them that goes over some tips and tricks. [Check it out](https://leetcode.com/problems/sum-of-two-integers/discuss/84278/A-summary%3A-how-to-use-bit-manipulation-to-solve-problems-easily-and-efficiently).