---
layout: post
title: Clean Code Chapter 13
---

# Concurrency

Writing clean concurrent programs is very hard. It is much easier to write code that executes in a single thread. It's also easy to write multithreaded code that looks fine on the surface level, but is broken at a deeper level. Such code works fine until the system is placed under stress. 

Clean concurrency is a complex topic, worthy of a book by itself. The strategy here is to present an overview. 

## Why concurrency 

Concurrency is a decoupling strategy. It decouples *what* gets done from *when* it gets done. In single-threaded applications, *what* and *when* are so strongly coupled that the state of the entire application can be determined by looking at the stack backtrace. 

Decoupling *what* from *when* can improve the throughput and structures of an application. From a structural point of view, the application looks like many collaborating computers rather than one big main loop. This can make the system easier to understand and offers some powerful ways to separate concerns. 

But structure is not the only motive for adopting concurrency. Some systems have response time and throughput constraints that require handcoded concurrent solutions. For examples, consider a single-threaded information gatherer that acquires information from many different web sites and merges that information into a daily summary. In a single-threaded system, it may take longer than 24 hours to run every day. A single thread involves a lot of waiting at web sockets for I/O to complete. We could improve performance by using a multithreaded algorithm that hits more than one site at a time. 

Or a system that handles one user at a time and requires only one second of time per user. It's responsive for a few users, but as the number of users increases, the response time increases. No user wants to get in line behind 150 others. We could improve the reponse time by handling many users concurrently. 

Or consider a system that interprets large data sets but can only give complete solutions after pcoessing all of them. Perhaps each set could be processed on a different computer so many sets are processed in parallel. 

### Myths and misconceptions 

So there are compelling reasons to adopt concurrency. But it's hard. If you aren't careful, you can create some nasty situations. Consider these myths and misconceptions: 

1. Concurrency always improves performance 
    - Concurrency can sometimes improve prformance, but only if there is a lot of wait time that can be shared between multiple threads or processors. Neither situation is trivial. 
2. Design does not change when writing concurrent programs 
    - Design of a concurrent algorithm can be remarkably different from the desing of a single-threaded system. The decoupling of what from when usually has a huge effect on the structure of a system. 
3. Understanding concurrency issues is not important when working with containers 
    - You'll need to know what your container is doing and how to guard against the issues of concurrent update and deadlock described later in he chapter. 

Here are some more balanced soundbytes about concurrent software: 

* Concurrency incurs some overhead, both in performance as well as writing additional code. 
* Correct concurrency is complex, even for simple problems 
* Concurrency bugs usually aren't repeatable, so they are often ignored as one-offs instead of the true defects they are. 
* Concurrency often requires a fundamental change in design strategy. 

## Challenges 

What makes concurrent programming so difficult? Consider the trivial class: 

```
var X = function() {
    let lastIdUsed;

    function getNextId() {
        return ++lastIdUsed
    }
}
```

Let's say we create an instance of X and set `lastIdUsed` to 42. Then we share the instance between two threads. If both threads call the `getNextId()` method, there are three possible outcomes: 

* Thread one gets 43, thread two gets 44. LastIdUsed is 44. 
* Thread one gets 44, thread two gets 42. LastIdUsed is 44. 
* Boththreads get 43, last thread is 43. 

The surprising third result occurs when two threads step on each other. This happens because there are many possible paths the thwo threads can take through that one line of Java code, and some of those paths generate incorrect results. To understand the answer, we need to understand the Just-In-Time compiler does with the byte-code, and understand what the Java memory model considers atomic. 

A quick answer is that there are 12,80 possible exuection paths for thoset two threads executing. If the type of `lastIdUsed` is changed from `int` to `long`, the number increases to 2,704,156. Most of those paths generate valid results. But *some of them don't*. 

## Concurrency defense principles. 

### Single Responsibility principle

A given method/class/component should have a single reason to change. Concurrency design is complex enough to be a reason to change in its own right. It deserves to be separated from the rest of the code. 

Often, concurrency implementation details get embedded directly into other production code. Consider: 

* Concurrency-related code has its own life cycle of development, change, and tuning
* Concurrency-related code has its own challenge, which are different from, and often more difficult than nonconcurrency related code. 
* The number of ways a miswritten concurrency based code can fil makes it challenging even without added burden of application code

**Keep your concurrency related code separate from other code**. 

### Corollary: limit the scope of data

Two threads modifying the same field of a shared object can interfere with each other. It is important to restrict the number of criticla sections. The more places shared data can get updated, the more likely: 

* you will forget to protect one or more of those places 
* There will be duplication of effort required to make everything guarded
* It will be difficult to determine the source of failures, which are hard enough to find. 

**Take data encapuslation to heart; severely limit the access of any data that may be shared**. 

### Corollary: use copies of data

A good way to avoid shared data is to avoid sharing the data in the first place. If it is possible to copy objects and treat them as read only, that helps. 

In other cases, you may be able to copy objects, collect results from multiple threads, and merge the results in a single thread. 

If there's an easy way to avoid sharing objects, the code will be less likely to casue problems. 

### Corollary: threads should be as independent as possible

Consider writing threaded code such that ecah thread exists in its own world, sharing no data with any other thread. Eachthread processes one client request, with all of its required data coming from an unshared source and stored as local variables. This makes each thread behave as if it were the only thread and there are no synch requirements. 

**Attempt to partition data into independent subsets that can be operated on by independent threads, possibly in different processors**

## Know your