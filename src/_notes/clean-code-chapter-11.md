---
layout: post
title: Clean Code Chapter 11
---

# Systems 

This chapter considers how to stay clean at the higher levels of abstraction, the *system* level. 

## Separate constructing a system from using it

Consider that *construction* is a very different process from *use*. 

Software systems should separate the startup process, when the application objects are constructed and the dependences are wired together, from the runtime logic that takes over after startup. 

The startup process is a *concern* that any application must address. It is the first concern we will examine in this chapter. The *separation of concerns* is one of the oldest and most important design techniques in our craft. 

Unfortunately, most applications don't separate this concern. The code for the startup process is ad hoc and mixed in with runtime logic. Here's a typical example: 

```
function getService() {
    if (service === null) {
        service = new MyService();
        return service;
    }
}
```

This is the LAZY INITIALIZATION/EVALUATION idiom. It has several merits. We don't incur the overhead of construction unless we actually use the object. Our startup times can be faster. We also ensure that `null` is never returned. 

But we now have a hard-coded dependency on `MyService` and everything its constructor requires. We can't compile without resolving these dependencies, even if we never actually use this object at runtime. 

Testing can be a problem. If `MyService` is a heavyweight object, we need to makes sure an appropriate test fixture gets assigned to the field before the method is called. Since we have construction logic mixed with normal runtime processing, we should test all execution paths. Having both these responsibilities means the method is doing more than one thing, so we are breaking the Single Responsibility Principle. 

Perhaps worst of all, we don't know if `MyService` is the right object in all cases. Why does this class have to know the global context? Can we ever really know the right object to use here? Is it possible for one type to be right?

One occurrence of LAZY-INITIALIZIATION isn't a serious problem, of course. However, there are normally many instances of little setup idios like this in applications. This makes the global setup *strategy* scattered across the application with no modularity and significant duplication. 

If we are diligetn about building well-formed and robust systems, we should never let little convenient idioms lead to modularity breakdown. the startup process of object construction and wiring is no exception. We should modularize this process separately from the normal runtime logic and we should make sure we have a global, consistent strategy for resolving our major dependencies. 

## Separation of Main

One way to separate construction from use is to move all aspects of construction to `main`, or modules alled by `main` and to design the rest of the system assuming all objects have been constructed and wired up appropriately. 

The flow of control is easy to follow. The `main` function builds the objects necessary for the system, then passes them to the application, which just uses them. The application has no knowledge of `main` or the of the construction process. It jsut expects everything has been built properly. 

## Factories

Sometimes, of course, we need to make the application responsible for when an object gets created. For example, in an order processing system, the application must create the `LineItem` instance to add to an `Order`. IN this cae, we can use the ABSTRACT FACTORY pattern to give the application control of when to build the `LineItems`, but keep the details of that construction separate from the application code. 

This means the application is decoupled from the details of how to build a `LineItem`. That capability is held in the `LineItemFactoryImplementation`. yet the application is in complete control of when the `LineItem` instances get built and can even provide application-specific constructor arguments. 

## Dependency Injection 

A powerful mechanism for separating construction from use is Dependency Injection, the application of inversion of control to dependency management. 

Inversion of control moves secondary responsibilities from an object to other objects that are dedicated to the purpose, thereby supporting the single responsibility principle. 

In the context of dependency management, an object should not take responsibility for instantiating dependencies itself. instead, it should pass this responsibility to another "authoritative" mechanism, thereby inverting the control. Because setup is a global concern, this authoritative mechanism will usually be either the "main" routine, or a special-purpose container. 

JNDI lookups are a partial implementatoion of DI, where an object asks a directory server to provide a service matching a particular name. 

The invoking object doesn't control what kind of object is actually returned, but the invoking object still actively resolves the dependency. 

True dependency injection goes one step further. The class takes no direct steps to resolve its dependencies; it is completely passive. Instead, it provides setter methods or constructor arguments (or both) that are used to inject the dependencies. During the construction process, the DI container instantiates the required objects (usually on demand), and uses the constructor arguments or setter methods to wrie together the dependencies. 

Which dependent objects are actually used is specified through a configuration fileor programmatically in a special-purpose construction module. But what about the virtues of LAZY-INITIALIZATION? This idiom is still sometimes useful with DI. First, most DI containers won't construct an object until needed. Second, many of these containers provide mechanisms for invoking factories or for constructing proxies, which could be used for LAZY-EVALUATION and similar optimizations. 

## Scaling up 

It is a myth that we can get systems "right the first time". Instead, we should implement only today's stories, then refactor and expand the system to implement new stories tomorrow. This is the essence of iterative and incremental agility. Test-driven development, refactoring, and the clean code they produce make this work at the code level. 

But what about the system level? Doesn't the system architecture require preplanning? Certainly it can't grow incrementally from simple to complex, can it? 

Software systems are unique compared to physical systems. Their architectures can grow incrementally if we maintain the proper separation of concerns. 

The ephemeral nature of software systems makes this possible, as we will see. Let's first consider a counterexample of an architecture that doesn't separate concerns adequately. 

The original EJB1 and EJB2 architectures did not separate concerns appropriately and thereby imposed unnecessary barriers to organic growth. Consider an *Entity Bean* for a persistent *bank* class. An entity bean is an in-memory representation of relational data. In other words: a table row. 

First, you had to define a local (in process) or remote (separate JVM) interface, which clients would use. Here's a possible interface: 

```