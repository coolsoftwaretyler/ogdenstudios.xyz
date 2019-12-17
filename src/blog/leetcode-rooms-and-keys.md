---
layout: post
title:  "Leetcode problem: Keys and Rooms"
tags: [leetcode, 'post']
description: "A medium-level leetcode problem"
date: 2019-11-15
---

## Problem description

[Problem on leetcode](https://leetcode.com/problems/keys-and-rooms/)

There are `N` rooms and you start in room `0`. Each room has a distinct number, in `0, 1, 2 ... N - 1`, and each room *may* have some keys to access the next room. 

Formally, each room `i` has a list of keys `rooms[i]`, and each key `rooms[i][j]` is an integer in `[0, 1, 2 . . . N - 1]` where `N = rooms.length`. A key `rooms[i][j] = v` opens the room with the number `v`. 

Iitially, all rooms are locked, except for room `0`. 

You can walk back and forth between all rooms freely. Return `true` if and only if you can enter every room. 

### Examples

**Example 1**
Input: `[[1], [2], [3], []]`
Output: `true`
Explanation: 

* Start in room 0, pick up key 1
* Move to room 1, pickup key 2
* Move to room 2, pickup key 3
* Move to room 3 and return true, since we have visited all rooms

**Example 2**
Input: `[[1, 3], [3, 0, 1], [2], [0]]` 
Output: `false`
Explanation: 

* Start in room 0, pick up key 1 
* Move to key 1, but we can't pick up key 2 and move to the next room 

## Solution 

So we've got some array and we need to try and loop all the way through it. 
At each step along the array, we get some set of keys and we try to get to the next room 
If we have encounted a key for our current room + 1, we can move forward 
If not, we can't. 

Ah, I see, it's a little more complex than that. We can go back and forth through the rooms. So consider: 

`[[2], [], [1]]` 

Which would return `false` if we just try to iterate, but will return `true` if you go from `0 -> 2 -> 1`. 

What if we start at the beginning and push the values into some array, then visit the cells of those inner values and push their values into the array, as well. We should end up with an array of length `rooms.length` if we get all the keys. 

This solution feels right because it's very much like a [depth first search](https://en.wikipedia.org/wiki/Depth-first_search). 

In a depth first search, we start at the root node (in this case, `room 0`), and explore as far as we can before backtracking. 

We can express it in JavaScript like this: 

```
var canVisitAllRooms = function(rooms) {
    const visited = new Set();
    visited.add(0);

    function dfs(room) {
        for (let i=0; i<room.length; i++) {
            if (!visited.has(room[i])) {
                visited.add(room[i]);
                dfs(rooms[room[i]]);
            }
        }
    }
    dfs(rooms[0]);
    return visited.size === rooms.length;
};
```

We create a new `Set` to keep track of rooms we've visited, and we add `0` to it, since we're starting there. 

Then we define the `dfs` function. You pass it a room (we'll end up giving it `rooms[0]` for that first room). Inside the room, it iterates through each set of keys. If our Set already has the room associated with a key, we do nothing. If it doesn't, we add that room number to the visited set, and run the `dfs` function recursively on that room. 

Once `dfs` has completed (it will stop running once it can't find any more unvisited rooms), we check to see if its `size` is equal to the length of the rooms array. 