---
layout: post
title:  "Leetcode problem: Roman to Integer"
tags: [leetcode, 'post']
description: "An easy-level leetcode problem"
date: 2020-01-14
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/roman-to-integer/)

Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.

* I: 1 
* V: 5
* X: 10 
* L: 50 
* C: 100
* D: 500
* M: 1000

For example, two is written as `II` in Roman numeral, just two one's added together. Twelve is written as, `XII`, which is simply `X` + `II`. The number twenty seven is written as `XXVII`, which is `XX` + `V` + `II`.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

* `I` can be placed before `V` (5) and `X` (10) to make 4 and 9. 
* `X` can be placed before `L` (50) and `C` (100) to make 40 and 90. 
* `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer. Input is guaranteed to be within the range from 1 to 3999.

### Intuition 

This problem feels like brute-force by its nature. There are a lot of rules and what feel like inconsistent patterns on the surface. So to start, I really just wanted to codify all these edge cases and different values. 

At the end of function, I need to return some numeric value. So I know I'll start at 0, and all of the numerals are additive, so I'll be adding to it. 

But the trick is that there are these combinations of prefixed numerals that generate distinct values. So I wrote up a pretty length `if/else` branch logic. It takes the input string, checks the first character against any of the possible prefixes. If that character is sometimes found in front of other characters, we check the next one to see the possible value. We set a `length` variable to `2` to indicate that this particular instance is a two-character value. 

If there is no second character, we set `length` to `1`. 

We add to the `result` value, based on the values of each numeral. 

Finally, we subtract either 1 or 2 numerals from the front of the string and repeat this process until the input has `length` 0. 

Here's my first pass. It's a little ugly, and I kept missing values from the prompt, so I added them in poor order:

```
var romanToInt = function(s) {
    let result = 0;
    
    while(s.length > 0) {
        let length; 
        if (s.charAt(0) === 'I') {
            if (s.charAt(1) === 'V') {
                result += 4;
                length = 2;
            } else if (s.charAt(1) === 'X') {
                result += 9;
                length = 2;
            } else {
                result += 1;
                length = 1;
            } 
        } else if (s.charAt(0) === 'X') {
            if (s.charAt(1) === 'L') {
                result += 40
                length = 2;
            } else if (s.charAt(1) === 'C') {
                result += 90;
                length = 2;
            } else {
                result += 10;
                length = 1;
            }
        } else if (s.charAt(0) === 'C') {
            if (s.charAt(1) === 'D') {
                result += 400;
                length = 2;
            } else if (s.charAt(1) === 'M') {
                result += 900;
                length = 2;
            } else {
                result += 100;
                length = 1;
            }
        } else if (s.charAt(0) === 'V') {
            result += 5; 
            length = 1;
        } else if (s.charAt(0) === 'L') {
            result += 50;
            length = 1;
        } else if (s.charAt(0) === 'D') {
            result += 500;
            length = 1;
        } else if (s.charAt(0) === 'M') {
            result += 1000;
            length = 1;
        }
        s = s.substr(length);
    }
    return result;
};
```

This can be much... much cleaner. I found a great [solution](https://leetcode.com/problems/roman-to-integer/discuss/346702/JavaScript-solution%3A-Runtime%3A-98.24-faster-Memory-Usage%3A-95.53-less) in the discussion section that looks like this:

### Solution 

```
var romanToInt = function(s) {
    var map = {
        'I': 1, 
        'V': 5, 
        'X': 10, 
        'L', 50,
        'C': 100,
        'D': 500, 
        'M': 1000
    }

    var number = 0;
    var index; 

    if (s.indexOf('CM') != -1) number -= 200;
    if (s.indexOf('CD') != -1) number -= 200;
    if (s.indexOf('XC') != -1) number -= 20;
    if (s.indexOf('XL') != -1) number -= 20;
    if (s.indexOf('IX') != -1) number -= 2;
    if (s.indexOf('IV') != -1) number -= 2;

    for (let i=0; i<s.length; i++) {
        number += map[s[i]];
    }

    return number;
}
```

This solution is super clean and I like it a lot. It sets up a map object of all the numerals and their values. Then it initializes the return value at `0`. 

Next, it checks for the edge cases: `CM`, `CD`, `XC`, `XL`, `IX`, and `IV`. If the input string contains any of these, it subtracts from the initial value. 

Then it runs a for loop against the input string and adds the value from the map of each character. Since we checked for the prefixed edge cases and subtracted the appropriate values, the final result is correct, even with the edge cases. 

It took me a minute to visualize the values here. So here's an example. Consider an input: "XIV". 

Without the prefix checks, the for loop would return `16`. But since the string has an [indexOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) not equal to `-1` for `IV`, we subtract 2 from the initial value. This means the naive for loop returns `14`, the correct answer. 

It's a neat approach. I like it more than my big long branch. It's well organized, although I do think there's a bit of counter-intuitive logic happening with the initial subtraction of the prefix values. 