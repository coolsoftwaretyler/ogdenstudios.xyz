---
title: Introduction to Algorithms
layout: post
---

# Data structures

## Introduction 

Sets are fundamental to computer science, as in mathematics. Mathematical sets are unchanging, but sets manipulated by algorithms can grow, shrink, or otherwise change over time. 

We call these sets dynamic. The next five chapters present basic techniques for representing finite dynamic sets and mainuplating them. 

The best way to implement a dynamic set depends on the operations that need to be supported by the algorithm manipulating it. 

### Elements of a dynamic set

In most implementations of dynamic sets, each element is represented by an object whose attributes can be examined and manipulated if we have a pointer to the object. 

Some dynamic sets assume one of the object'sattributes is an identifying key. If all the keys are different, the set is a set of key values. 

The object may contain satellite data, which are carreid in other attributes but not used by the set implementation. 

### Operations on dynamic sets

Operations on a dynamic set can be grouped into two categories: 

1. Queries - return information about the set
2. Modifying operations - change the set.

The operations are: 

* search
* insert
* delete
* minimum (smallest key)
* maximum (largeest key)
* successor 
* predecessor

# Elementary data structures

This chapter examins rudimentary data structures: 

* stacks
* queues 
* linked lists
* rooted trees

We also examine ways to synthesize objects and pointers froma rrays. 

## Stacks and queues

Stacks and queues are dynamic sets in which the element removed from the set by the DELET operation si prespecified. 

In a stack, the element deleted from the set is the one most recently inserted. In a stack, the element deleted from the set is most recently inserted. Stacks are last-in, first-out, or LIFO. 

A queue deletes the element that has been in th elongest time. They are first-in, first-out or FIFO. 

There are several efficient ways to implement stacks and queues on a computer. Here we show how to use a simple array to implement each. 

### Stacks

The INSERT operation on a stack is often called PUSH, and the DELETE operation, which doesn't take an element argument, is often called POP. These names are allusions to physical stacks, like spring-loaded stacks in cafeterias. 

We can implement a stack of at most `n` eleents with an array `S[1..n]`. 

The array has an attribute `S.top` that indexes the most recently inserted element. The stack consists of elements `S[1..S.top]`, where `S[1]` is the element at the bottom of the stack and `S[S.top]` is the element at the top. 

When S.top = 0, the stack contains no elements and is empty. We can tests to see i fthe stack is empty by query operation STACK-EMPTY. If we attempt to pop an empty stack, we say the stack underflows, which is an error. If S.top exceeds n, the stack overflows. In our implementation, we don't worry about stack overflow. 

We can implement each of the stack operations with just a few lines of code. See `code-snippets\stack.js`.

### Queues 

We call the INSERT operation on a queue ENQUEUE, and we call the DELETE operation DEQUEUE. Like the stack POP, DEQUEUE takes no element argument. 

The FIFO property of a queue causes it to opearate like a line of customers waiting to pay a cashier. It has a head and a tail. When an element is enqueued, it takes its place at the end of the queue. Just as a new customer takes ap lace at the end of a the line. 

The element dequeued is always the one at the head of the queue. LIke the customer who has waited longest. 

We can implement a queue of at most n - 1 elements with an array Q[1..n]. The queue has an attributed Q.head that indexes or points to its head. The attribute Q.tail indexes th enext location at which a newly arriving element will be inserted into the queue. 

The elements in the queue reside in locations Q.head, Q.head + 1 ... Q.tail - 1, where we wrap around in the send that location 1 immedately follows location n in a cricular order. 

When Q.head = Q.tail, the queue is empty. Initially, we have Q.head = Q.tail = 1. 

If we attempt to dequeue an element form an empty queue, the queue underflows. 

When Q.head = Q.tail + 1, the queue is full. If we try to enqueue an element, the queue overflows. 

See `code-snippets\queue.js`.

### Exercises 

See `code-snippets\stacks-and-queues-exercises.js`