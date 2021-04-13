# Longest Substring Without Repeating Characters

Given a string `s`, find the length of the **longest substring** without repeating characters.

**Example 1:**

```
Input: s = 'abcabcbb"
Output: 3
```

**Example 2:**

```
Input: s = "bbbbb"
Output: 1
```

**Example 3:**

```
Input: s = "pwwkew"
Output: 3
```

**Example 4:**

```
Input: s = ""
Output: 0 
```

**Constraints:**

* `0 <= s.length <= 5 * 10^4`
* `s` consists of English letters, digits, symbolx, and spaces.

## Pattern

Since the input is a string and we're asked to find the longest substring, we can use [sliding window]() to solve it. 

### Sliding Window

Use this if the input is a linear data structure, such as an array, linked list, or string, and you're asked to find the longest/shortest substring, a subarray, or a desired value. 

**Steps:**

1. Initialize an empty array
1. Initialize a count of the longest substring
1. Iterate through each character in the string
1. Check if the current array includes the character.
    1. If so, update the longest count - either the current longest value, or the size of the current array, whichever is largest
    1. Then shrink the window. Set the array to slice the current array starting from the index of the repeated character + 1, and going til the end of the array. 
1. If the current array doesn't include the character, push it in to the current array. 
1. Return the largest - either the longest string, or the current size, in case the array is one long substring.

## Code

```rb
# @param {String} s
# @return {Integer}
def length_of_longest_substring(s)
    current = []
    longest = 0

    s.each_char do |char|
        if current.include?(char)
            longest = [longest, current.size].max
        
            index = current.index(char) + 1
            current = current[index..-1]
        end

        current << char
    end

    [longest, current.size].max
end
```