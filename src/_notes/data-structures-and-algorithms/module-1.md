# Overview 

Become familiar with these data structures: 

1. Trees 
    - binary search
    - red-black
    - binary
    - BST
    - AVL
    - 2-3
    - splay
2. Graphs 
    - directed, weighted
3. Hash tables
4. Heaps
5. Linked lists
    - singly 
    - doubly
    - circularly
6. Stacks
7. Queues
8. Arrays
9. Array lists

## Objectives

1. Define heaps, balanced trees, hash tables
2. Given a data structure by name, identify the structure of the data
3. Given a data structure by name, identify common operations
4. Given a description of the strucutre of a data and list of operations, identify the data structure by names. 

### Trees

#### Binary search

Operations on a BST take time proportional to the height of the trea. Worst case is O(lg n).

We can't always guarantee they're built randomly, but we can design them with good guaranteed worst-case performance. 

They're ogranized in a binary tree. We can represent it by a linke ddata structure in which each node is an object. In addition to a key and satellite data, each node contains left, right, and p that represent its left node, right node, and parent node. 

If it' smissing a child or parent node, the attribute is nil. The root node is the only node whose parent is nil. 

BST is always organized so its left child is less than or equal to itself. Its right child is greater than or equal to its own value. 

#### Red-black tree

Red-black trees are BSTs with one extra bit of storage: its color. Its color can either be red or black. By constraining the node colors on any simple path, red-blac trees enusre no paht is more than twice along as any other. It makes the tree balanced. 

Each node contains the color, key, left, right, and parent. 

The red-black properties are: 

1. Every node is either red or black
2. The root is black
3. Every leaf is black
4. If a node is red, both its children are black
5. For each node, all simple paths from the node to descendant leaves contain the same number of black nodes. 

For convenience, we use a single sentinel node for the nil values at the leaves. We usually only care about internal nodes, since they hold key values. 

We call the number of black nodes on any simple path from, but no tincluding, a node x down the leaf th eblac-height of the node. 

Inserting and deleting a red-black tree may violate the red-black rules. We change the structure through rotation, which preserves its properies. There are left and right rotations. 

### Graphs

There are two ways to represent a graph G = (V, E). As a colleciton of adjacency lists or as an adjacency matrix. 

Usually we use adjacency-list representations. 

#### un/directed

#### un/weighted

### Hash tables

### Heaps

Heaps are efficient priority queues. They are array-based trees. Given the index of a node, we can compute the indices of its parent, left child, anrd right child. 

Parent: i / 2

Left: 2*i

Right: 2*i + 1

You can usually computer the left by shifting the binary representation of i left by one bit position. You can do the same for right by shifting left and adding one. The parent procedure can compute i/2 by shifting i right one bit position. 

There are max heaps and min heaps. In a max heap, the value of a node is at most the value of it sparent. The largest element is stored ad the root, and the subtree contains values no larger than itself. The min heap is the opposite. 

### Linked lists

### Stacks

### Queues

### Arrays

### Array lists

## Quiz 1 First attempt

18 / 30

Array List: got it right but answered underlying structure is an array or linked list - that was incorrect.

Select all of the statements that are true regarding the structure of an Array. 

* Missed that all of the elements are of the same type 

 Select all of the statements that are true regarding the structure of a Directed Graph. 

 got it all correct

 Select all of the statements that are true regarding the structure of a Graph. 

 got it all correct

 Select all of the statements that are true regarding the structure of a Weighted Graph. 

 * got it all correct

 Select all of the statements that are true regarding the structure of a Hash Table. 

 * missed that the underlying data structure is often an array

 Select all of the statements that are true regarding the structure of a Binary Max Heap. 

 * MIssed that it's a colleciton of linked data structure called nodes
 * Incorrectly said all elements are located contiguously in memory
 * Incorrectly said it suports direct access by index

  Select all of the statements that are true regarding the structure of a Binary Min Heap. 

  * Missed that it's a collection of linked data structures called nodes
  * MIssed that each node contains a piece of data called a key

  

Select all of the statements that are true regarding the structure of a Circularly Linked List.

* Got it right



Select all of the statements that are true regarding the structure of a Doubly Linked List.
* Missed that each node contains a piece of data called a key

 Select all of the statements that are true regarding the structure of a Singly Linked List. 
 * Missed that each node contains ap iece of data called a key

  Select all of the statements that are true regarding the structure of a Linked List. 
  * missed that each node contiains a ppiece of data called a key

   Select all of the statements that are true regarding the structure of a Priority Queue. 
   * Missed that it's a linear ordered collection of values

   * Missed the underlying structure is a heap

    Select all of the statements that are true regarding the structure of a Queue.    
    * Missed that it's a linear ordered collection of values

 Select all of the statements that are true regarding the structure of a Stack. 

 * Missed that it's a linear collection of values

  Select all of the statements that are true regarding the structure of a 2-3 Tree. 

  * Missed that it's a colleciton of linked data structures called nodes

   Select all of the statements that are true regarding the structure of a AVL Tree. 

   * Missed that there are no cycles
   * Missed each node contains a piece of data called a key