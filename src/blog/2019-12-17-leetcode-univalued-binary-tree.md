---
layout: post
title: "Leetcode problem: Univalued Binary Tree"
tags: [leetcode]
description: "An easy-level leetcode problem"
---


## Problem description

[Problem on leetcode](https://leetcode.com/problems/univalued-binary-tree/)

A binary tree is univalued if every node in the tree has the same value.

Return true if and only if the given tree is univalued.

## Intuition 

We've got to visit all the nodes of this tree and make sure they're the same value. So I'm figuring I can accomplish this with [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) or [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search). Either will get the job done. 

I'll set the first root value as my value check, since it's easy to grab that to start. 

Then I can implement DFS or BFS. At each node, I'll check if the value matches the root node's value. If it doesn't, I can return false. If it does, I'll keep on going with the algorithm. 

If the algorithm completes and I haven't returned false, I'll return true. 

Here's how I expressed that in JavaScript: 

```
var isUnivalTree = function(root) {
    let val = root.val;
    let response = true;
    dfs(root);
    return response;

    function dfs(node) {
        if (node.val !== val) {
            response = false;
            return;
        }
        if (node.left) {
            dfs(node.left);
        }
        if (node.right) {
            dfs(node.right);
        }
    }
};
```

I chose DFS purely because it's been a few weeks since I last coded it up and wanted aother refresher. Also note I'm using [hoisting](https://scotch.io/tutorials/understanding-hoisting-in-javascript#toc-hoisting-functions) on the function - so I can call `dfs()` above where I've defined it. On my first submission I forgot to actually call it and failed. Classic.