# Longest Palindromic Substring

Given a string `s`, return the *longest palindromic substring* in `s`.

**Example 1:**

```
Input: s = "babad"
Output: "bab" (or "aba")
```

**Example 2:**

```
Input: s = "cbbd"
Output: "bb"
```

**Example 3:**

```
Input: s = "a"
Output: "a"
```

**Example 4:**

```
Input: s = "ac"
Output: "a"
```

**Constraints:**

* `1 <= s.length <= 1000`
* `s` consist of only digits and English letters (lower-case and/or upper-case)

## Pattern

https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed

This can be solved with [sliding window](), since the input is a string and we're asked to find a substring that meets a certain criteria within it. 

**Steps:**

Start from the first element, keep shifting right by one element and adjust the length of the window according to the problem you are solving. 

In some cases, the window size remains constant, and in others it grows or shrinks. 

1. If the string is only one character long, return it. 
1. Iterate as many times as there are characters in the input
1. Expand the window from the start character to the end character and check if that substring is a palindrome


## Solution

```rb
# @param {String} s
# @return {String}
def longest_palindrome(s)
    return s if s.length == 1

    lower_bound = 0
    upper_bound = s.length - 1

    (0..s.length - 1).each do |i|
        make_palindrome(s, i, i)
        make_palindrome(s, i, i + 1)
    end

    def make_palindrome(s, j, k)
        while (j >= 0 && k < s.length && s[j] == s[k]) {
            j -= 1
            k += 1
        }

        if upper_bound < k - j - 1 
            
    end
end
```