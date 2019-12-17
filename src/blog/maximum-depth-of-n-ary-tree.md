---
layout: post
title: "Leetcode problem: Maximum Depth of N-ary Tree"
tags: [leetcode, 'post']
description: "An easy-level leetcode problem"
date: 2019-12-16
---


## Problem description

[Problem on leetcode](https://leetcode.com/problems/maximum-depth-of-n-ary-tree/)

Given a n-ary tree, find its maximum depth.

The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

*Nary-Tree input serialization is represented in their level order traversal, each group of children is separated by the null value (See examples).*

### Examples

Input: root = [1,null,3,2,4,null,5,6]
Output: 3

Input: root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
Output: 5

## Intuition 

I've done a handful of tree-traversal problems at this point, and this one is screaming out to me as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) problem. I believe I just need to find the final value of how many levels I travel in the BFS and return it. 

I wrote a BFS algorithm in the [zigzag level order traversal problem](/2019/11/29/leetcode-binary-tree-zigzag-level-order-traversal.html). The problem even references *level order traversal* in its problem statement, so I feel like I"m on the right track.

The two lessons I learned from zigging and zagging were: 

1) Implement a BFS with a queue 
2) Use a `depth` variable to indicate how far down I've gone. 

Remembering this, I think I can express the solution in JavaScript like so: 

```
var maxDepth = function(root) {
    if(!root) return 0;
    const queue = [[root, 0]]
    let result;
    while(queue.length) {
        let [node, depth] = queue.shift();
        if (node.children) {
            for (let i=0; i<node.children.length; i++) {
                queue.push([node.children[i], depth+1]);
            }
        }
        result = depth + 1;
    }
    return result;
};
```

And it works! Again, a strong reminder that I need to keep practicing my BFS and DFS implementations. When I first saw this problem, I got flipped the wrong direction and thought I needed to do *depth-first search* because I was going down. But I didn't realize I was just counting the levels of hierarchy in the tree, which wants BFS. I also had to go back and really read through my zigzag solution to reverse engineer the correct algorithm. 