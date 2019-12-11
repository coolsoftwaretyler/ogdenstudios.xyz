---
layout: post
title: Clean Code Chapter 8
---

# Boundaries 

We don't control all the code we use in our work. We often use open source or paid for packages.  In this chapter we lookat practices and techniques to keep the boundaries of our software clean. 

## Using third-party code 

There is a natural tension between the provider of an interface and the user of an interface. 

Providers strive for broad applicability so they can work in many environments and appeal to a wide audience. 

Users, on the other hand, want an interface focused on their needs. This can cause problems at the bvboundaries of our systems. 

We'll consider the `java.util.Map` as an example. The author lists a broad interface with many capabilities. 

This power and flexibility is useful, but it can be a liability.  Our application might build up a `Map` and pass it around. Our intention might be that none of the recipients of our `map` delete anything in it. but there is a `clear()` method. Any user of the `Map` has the power to clear it. 

Basically, anything we don't want users to do, if the API provides for it, they can then do. 

Passing an instance of the `map` around liberally means there will be a lot of places to fix if the interface to `Map` ever changes. This happens often enough to be a real problem. 

A cleaner way might be something like this: 

```
var Sensors = function() {
    let sensors = new Map();

    function getById(id) {
        return sensors.get(id)
    }
}
```

The interface at the boundary (`Map`) is hidden. It is able to evolve with little impact on the rest of the application. 

The interface is also tailored and constrained to meet the needs of the application. It results in code that is easier to understand and harder to misuse. The `Sensors` class can enforce design and business rules. 

Avoid returning from, accepting arguments to third parties through public APIs. 

## Exploring and Learning Boundaries 

Third-party code helps us get more functionality delivered in less time. Where do we start when we want to utilize some third-party package? 

It's not our job to test the third party package, but it may be in our best interest to write tests for the third party code we use. 

Learning third party code is hard. Integrating third party cod is hard, too. Doing both at the same time is doubly hard. 

What if we took a different approach. 

Instead of experimenting and trying out the new sutff in our produciton code, we could write some tests to explore our understanding of the third-party code. Jim Newkirk calls this *learning tests*. 

We call the third-party API, as we expect to us e it. We're essentially doing controlled experimens that check our undertsanding of that API. The tests focus on what we want out of the api. 