# Title

[Description]

**Example 1:**

**Example 2:**

**Example 3:**

**Constraints:**

* `2 <= nums.length <= 10^3`
* `-10^9 <= nums[1] <= 10^9`
* `-10^9 <= target <= 10^9`
* Only one valid answer exists

## Pattern

https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed

### Sliding Window

Use this if the input is a linear data structure, such as an array, linked list, or string, and you're asked to find the longest/shortest substring, a subarray, or a desired value. 

**Steps:**

Start from the first element, keep shifting right by one element and adjust the length of the window according to the problem you are solving. 

In some cases, the window size remains constant, and in others it grows or shrinks. 

### Two Pointers or Iterators

Useful when searching pairs in a sorted array or linked list; for example, when you have to compare each element of an array to its other elements. 

**Steps:**

Two pointers iterate through the data structure in tandem until one or both of the pointers hit a certain condition. 

Problem input linear data (array, linked list, string), and/or asked to find longest/shortest substring, subarray, or a desired value

    - Sliding window

If input array is sorted: 

    - Binary search
    - Two pointers

If asked for all permutations/subsets:

    - Backtracking

If given a tree then 

    - DFS
    - BFS

If given a graph then 

    - DFS
    - BFS

If given a linked list then

    - Two pointers

If recursion is banned then

    - Stack

If must solve in-place then

    - Swap corresponding values
    - Store one or more different values in the same pointer

If asked for maximum/minimum subarray/subset/options then

    - Dynamic programming

If asked for top/least K items then

    - Heap

If asked for common strings then

    - Map
    - Tree

Else

    - Map/Set for O(1) time & O(n) space
    - Sort input for O(nlogn) time and O(1) space