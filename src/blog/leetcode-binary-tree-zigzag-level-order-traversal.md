---
layout: post
title:  "Leetcode problem: Binary Tree Zigzag Level Order Traversal"
tags: [leetcode, 'post']
description: "A medium-level leetcode problem"
date: 2019-11-29
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/single-number-iii/)

Given a binary tree, return the *zigzag level order* traversal of its nodes' values. (i.e. from left to right, then right to left for the next and alternate between).

### Examples

For binary tree `[3, 9, 20, null, null, 15, 7]`

```
    3
   / \
  9  20
    /  \
   15   7
```

Return its zigzag level order traversal as: 

```
[
    [3], 
    [20, 9], 
    [15, 7]
]
```

## Solution 

### Intuition 

In the [rooms and keys problem](/2019/11/15/leetcode-rooms-and-keys.html) I used [depth first search](https://en.wikipedia.org/wiki/Depth-first_search) to traverse the rooms. Looking at how the example lays out, I'm thinking I need to use [breadth first search](https://en.wikipedia.org/wiki/Breadth-first_search) for this one. Instead of following one connected route from beginning to end, I want to explore all the neighboring nodes of the tree in some kind of order. 

Something that always trips me up with binary tree questions is the [array representation of trees](http://www-inst.eecs.berkeley.edu/~cs61bl/r//cur/trees/array-repr.html?topic=lab20.topic&step=1&course=). 

So when we need to convert a tree into an array (or vice versa), here's the process: 

* The root of the tree is at position 0
* The left child of any node `n` is at position `2n`. 
* The right child of any node `n` is at position `2n + 1`.
* The parent node of any node `n` is at position `n/2`. 

The Leetcode JavaScript prompt gives us `TreeNode` objects to work with to implement it. They tell us: 

```
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
```

I think that gives us just about everything we need to work with.

I tried figruing out BFS myself but hit a bunch of stumbling blocks. I couldn't quite express it the way I wanted to in JavaScript. I found a [useful medium post](https://medium.com/basecs/breaking-down-breadth-first-search-cebe696709d9) which details what BFS is and how to implement it in JavaScript. 

Here's how they wrote it: 

```
function levelOrderSearch(rootNode) {
  // Check that a root node exists.
  if (rootNode === null) {
    return;
  }
  
  // Create our queue and push our root node into it.
  var queue = [];
  queue.push(rootNode);
  
  // Continue searching through as queue as long as it's not empty.
  while (queue.length > 0) {
    // Create a reference to currentNode, at the top of the queue.
    var currentNode = queue[0];
    
    // If currentNode has a left child node, add it to the queue.
    if (currentNode.left !== null) {
      queue.push(currentNode.left)
    }
    // If currentNode has a right child node, add it to the queue.
    if (currentNode.right !== null) {
      queue.push(currentNode.right)
    }
    // Remove the currentNode from the queue.
    queue.shift()
  }
  
  // Continue looping through the queue until it's empty!
}
```

Great! Now we can BFS through the tree, but it doesn't solve actual problem. 

I racked my brain for a while but just couldn't quite get it to work. I figured I had to take the result of `queue.shift()` and do something with it. My guess is I could flip a boolean like `leftToRight` and return the `shift()` results in arrays and reverse them based on that boolean. But the sticking point for me is figuring out how to know when I'm done with one level of the tree and push the array into the result.

### Answer

So I turned to the discussion section and found a fast implementation using BFS. You can [check it out here](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/discuss/398601/Simple-JavaScript-solution-using-bfs-(faster-than-95.44)). 

Here's how they expressed it in JavaScript: 

```
var zigzagLevelOrder = function(root) {
    if(!root) return []
    const queue = [[root, 0]]
    const result = []
    while(queue.length) {
        let [node, depth] = queue.shift()
        result[depth] ? result[depth].push(node.val) : result[depth] = [node.val]
        if(node.left) queue.push([node.left, depth + 1])
        if(node.right) queue.push([node.right, depth + 1])
    }
    return result.map((row, idx) => idx % 2 ? row.reverse() : row)
};
```

So the function returns if there is no `root` object, as a failsafe. 

Otherwise, we set up a [queue](https://www.geeksforgeeks.org/queue-data-structure/) and add an array of the `root` node and `0`. **This is the missing piece I was looking for. The array indicates the depth we're at**.

We set up a `result` array, empty at first. 

While there are items in the queue, we `shift()` it and use [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to take the `node` and `depth`. 

Then we check if the `result` array has a value at the index of `depth`. **Again, this is a critical part I was missing, it's how we can tell when to move on to the next level**. If it does, we push the value of the node onto that array. If not, we set that index equal to an array with the node value in it. 

Next, we check if the node has a left child. If so, we push a new array onto the queue containing that node and a depth indicator of the current `depth` plus one. 

We do the same, checking for a right child. 

This goes on until we've traversed the whole tree. 

Finally, we return the result but we use `.map()` to return an array that has every other item (each item is an array) reversed. 

Overall, I'm pleased with how I approached this problem. I identified the correct algorithm (breadth first search), I had to do some research on binary tree implementation and BFS implementation (I didn't know off the top of my head to use a queue). I identified that I would need to recapture the shifted values from the queue, that I would need to set some kind of depth indicator, and I think my `leftToRight` boolean idea can be used in other approaches as well, based on the Leetcode discussion. 

Hopefully next time I hit a BFS question it'll be a little clearer to me. I think in general I'm going to need more exposure to implementing DFS and BFS before I can get them by sheer memory aone. 