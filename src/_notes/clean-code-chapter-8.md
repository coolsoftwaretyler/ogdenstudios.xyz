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

## Learning log4j

Let's say we want to use the apache `log4j` package rather than a custom logger. We write our first case, expecting it to write "hello" to the console. 

```
@Test 
function testLogCreate() {
    logger = Logger.getLogger("MyLogger");
    logger.info("hello");
}
```

but we get an error that says we need something called an `Appender`. We read a bit more and find there is a `ConsoleAppender`. So we create one and see if we got it: 

```
@Test 
function testLogAddAppender() {
    logger = Logger.getLogger("MyLogger");
    appender = new ConsoleAppender();
    logger.addAppender(appender);
    logger.info("hello");
}
```

Now we find the `Appender` has no output stream. We google and try the following: 

```
@Test 
function testLogAddAppender() {
    logger = Logger.getLogger("MyLogger");
    logger.removeAllAppender();
    logger.addAppender(new ConsoleAppender(
        new PatternLayout("%p %t %m%n"),
        ConsoleAppender.SYSTEM_OUT));
    ));
    logger.info("hhello");
}
```

And it works! Now we know how to get a simple consoel logger initialized and we can encapsulate that knwoledge into our own logger class so the rest of the application is isolated from the `log4j` boundary interface. 

## Learning tests are better than free 

The learning tests end up costing nothing. We had to learn the API anyway, and writing those tests was an easy and isolated way to get the knwoledge. They are precise experiments that helped increase our understanding. 

Not only are learning tests free, they have a positive ROI. When there are new releases of the package, we run them to see if there are behavioral differences. 

We can use them to verify the third party packages we use work the way we expect them to. 

**A clean boundary should be supported by a set of outbound tests that exercise the interface in the same way the production code does**. 

Without these *boundary tests* to ease the migration, we may be tempted to stay with older versions longer than we should. 

## Using code that does not yet exist

There is another kind of boundary that separates the known form the unknown. 

There are often places in code where our knowledge seems to drop off the edge. Sometimes what is on the other side is unknownable (at least right now). Sometimes we choose not to look into it. 

## Clean boundaries 

Interesting things happen at boundaries. Change is one of those things. 

Good software designa coomodate change without huge investments and rework.

When we use code that is out of our control, special care must be taken to protect our investment and make sure future change is not too costly. 

Code at the boundaries needs clear separation and tests that define expectations. We should avoid letting too mcuh of our code know about the third-party particulars. It's better to dpeend on something we control rather than soething we don't. 

We manage third-party boundaries by having few places int he code that refer to them. We wrap them, or use an adapter. 

Either way, our code speaks to us better. 