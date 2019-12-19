---
layout: post
title:  "Leetcode problem: Convert Binary Number in a Linked List to Integer"
tags: [leetcode, 'post']
description: "An easy-level leetcode problem"
date: 2019-12-19
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/)

Given head which is a reference node to a singly-linked list. The value of each node in the linked list is either 0 or 1. The linked list holds the binary representation of a number.

Return the decimal value of the number in the linked list.

### Examples

Input: head = [1,0,1]
Output: 5
Explanation: (101) in base 2 = (5) in base 10

Input: head = [0]
Output: 0

Input: head = [1]
Output: 1

Input: head = [1,0,0,1,0,0,1,1,1,0,0,0,0,0,0]
Output: 18880

Input: head = [0,0]
Output: 0

### Intuition 

My guess is the problem just wants to see if we can iterate through the singly-linked list to its end, with a check for `null` to signify the end. While we do so, we can keep track of each node's value and return a binary value at the end. 

Here's how I can express that in JavaScript: 

```
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {number}
 */
var getDecimalValue = function(head) {
    let value = head.val.toString();
    while (head.next) {
        head = head.next
        value += head.val.toString();
    }
    return parseInt(value, 2);
};
```

We start `value` with the string of the given `head` value, then while there is a `next` node, we set `head` to the current `head.next` and concatenate its `val` to our final `value` return, which we return with [parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) base 2. 