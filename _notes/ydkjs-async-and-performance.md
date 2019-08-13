---
layout: post
title:  "YDKJS - Async and Performance"
---

The relationship between now and later parts of a program are the heart of asynchronous programming.

Programs are usually comprised of several chunks. Some run now. Some run later.

The most common unit of a chunk is the function.

The main problem new JS devs have is that later doesn't happen strictly and immediately after now.

The simplest way of waiting from now until later is to use a callback function.

* * *

In the example on page three, there are two chunks. Stuff that runs now, and stuff that runs later.

```
// Example page 3
function now() {
  return 21;
}

function later() {
  answer = answer * 2;
  console.log( "Meaning of life:", answer);
}

var answer = now();
```

Now is the function now, the function later, the var answer, and the setTimeout call.

Later is the code inside the function called later, but not the declaration of it.

This later part is created by wrapping the function in setTimeout. Any time you wrap a portion of code into a function and specify it should be executed in response to some event (timer, mouse, etc.), you are creating a later chunk of code, and introducing asyc to the program.

* * *

JavaScript wasn't built with async in mind. It just executes single chunks at any given moment when asked to - by the hosting environment's event loop.

Think about the event loop as somehwat of an array-based queue that operates one tick at a time, with ticks being executed as they're inserted.

Each iteration of the while loop for an event queue is a tick, and if there's an event waiting on the queue, it's taken off and executed. These are the function callbacks.

The basic rundown is: a JavaScript program is generally broken up into lots of small chunks, which happen one after another in the event loop queue. Technically, other events not related directly to your program can be interleaved within the queue as well.

* * *

# Parallel threading

It's easy to conflate "async" and "parallel", but they're distinct. Async is about the gap between now and later. Parallel is about running things simultaneously.

Parallel computing uses processes and threads, which execute independently and possibly simultaneously.

An event loop, by contrast, breaks its work into tasks and executes them in a serial manner. Parallel access is prevented.

JavaScript doesn't have parallel programming, so we dn't have to worry about the nondeterminism that comes with it.

* * *

# Run-to-completion 

JavaScript's single-threading means the code inside of a function is atomic. Once it starts running, the entirety of its code will run before another function's can. 

However, since these atomic functions are often able to happen in any order, there is still nondeterminism. Instead of being at the process level, it's at the function (event) ordering level. 

This function-ordering nondeterminism is often called a race condition. 

* * * 

# Concurrency 

Concurrency is when two or more proceses are executing simultaneously over the same period, regardless of whether their individual constituent operations happen in paralle. It's task-level parallelism vs. operational level parallelism. 

If these tasks don't need to interact with each other, nondeterminism can be perfectly acceptable. 

## Interaction 

It's more common that concurrent processes will need to interact through scope or the DOM. 

You can use checks to guard against this behavior. Check the data exists, check where the data is coming from, etc. Identify the conditions you need for your code to function properly and check against it in the logic. 

These checks are traditionally called *gates*. 

Another concurrency interaction condition is sometimes called a race, but more accurately described as a *latch*. 

*Latches* are characterized by "only the first one wins" behavior. This is another place where nondeterminism is acceptable. It's OK for the race to finish and only have one winner. 

## Cooperation 

The focuse isn't so much about interacting via value sharing in scopes. Rather, take a long running process and break it up into steps or batches, so that other concurrent processes have a chance to interleave their operations into the event loop queue. 

Say we had to process millions of pieces of data. If we wrote one function to process an entire array, it would hang the thread until done. 

Instead, we can take the array, splice out 1000 pieces of data at a time, then at the end of processing that thousand, call the function again as a `setTimeout()` argument and add it to the event queue. 

## Jobs 

In ES6 there is a new concept on top of the event loop called the *Job queue*. It works with Promises. 

The Job queue is a queue hanging off the end of every tick in the event loop queue. It allows you to stick things directly in front of the queue. It's like getting off a ride and then immediately cutting in front to get on again. 

Jobs are basically like the `setTimeout(..0)` hack, but implemented in a well defined way. 

* * * 

# Callbacks 

In all of the previous cases where functions are treated as an indivisible unit of code that runs to completion, the functions are operating as *callbacks*, where the event loop can "call back into" the program whenever that item is processed. 

Callbacks are everywhere and build out a ton of legendary JS code. But there are some shortcomings. 

## Continuations 

Callbacks introduce a disconnect between code authoring, mental models of the code, and the way the code is executed in the JS engine. It makes the code more difficult to understand, reason about, debug, and maintain. 

How we express asynchrony with callbacks doesn't map very well to the synchronous brain planning most humans do. 

We very often think in step-by-step terms, but callbacks are not expressed that way.

## Nested/Chained Callbacks 

It's not just the nesting in callbacks that makes callback hell and the pyramid of doom. 

The real problem is that the actual logic is often split across multiple areas throughout the code and execution, and reasoning with those pieces altogether is a difficult excerise, leading to bugs pretty easily through all that noise. 

We also often need to link callbacks together in a hardcoded way. The code is brittle and breaks when things don't happen as anticipated. 

The nesting and indentations are a red herring. Callback hell is really about the brittle nature of this logic flow. 

Squential, blocking brain planning behaviors don't map well onto callback oriented async code. 

## Trust issues 

There's even more to be concerned about with callbacks. 

Sometimes the callback code isn't code you wrote or directly control. Often times it's a third party tool. 

This is called *inversion of control*. 

Even when it isn't someone else's code - can you always trust code that *you yourself* have written? 

As with any robust code, we want to write a ton of mechanisms to protect callbacks from bad data, input, etc. But callbacks don't offer us many mechanisms to do that. We end up having to write a ton of ad hoc logic and it isn't very DRY. 

## Saving callbacks 

There are some efforts to make callbacks better to use. Something like *split callbacks* catches things like success and failures as separate callback functions. The split-callback design is what ES6 Promises use. 

Or perhaps the error-first style, like in Node. It checks for an error first and executes nothing else if that's true. 

In both of these cases, we don't really prevent the untrusted third party code issue. It's also more verbose and boilerplate-ish without much reuse. 

Over and over, callbacks work, but they require a ton of custom work to work correctly and the effort is a lot of technical debt. 

* * * 

# Promises 

The first issue to address here is inversion of control. 

What if instead of handing the continouation of our program to another party, we could expect it to return us a capability to know when its task finishes, and then our code could decide what to do next? 

This is *promises*. 

There are two analgoies for what a Promise *is*. 

1. Future value 
2. Completion event

## Future value 

Ordering food at a restaurant, paying for it, and getting a ticketed receipt is a lot like the future value analogy. 

The receipt represents the *future value*, and with it in hand, we can do other things like check the phone or even talk about the forthcoming burger. 

The receipt makes the value *time independent* It's a *future value*. 

Imagine the restaurant finds it's out of meet. Future values can also resolve to failures. They represent possible success or possible failure. 

Because Promises encapsualte the time-dependent state (waiting on the fulfillment or rejection of the underlying value) from the outside, the Promise itself is time-independent. 

Therefore, Promises can be composed in predicatable ways regardless of the timing or outcome underneath. 

Once a Promise is resolved, it stays that way forever - it becomes an *immutable value* at that point, and can be observed as many times as necessary. 

Promises are an easily repeatable mechanism for encapsulating and composing future values. Added benefits being that they can't be modified by anyone else. 

## Completion event 

Another way to think of Promises is as a flow-control mechanism. *this-then-that* for two or more steps in an async task. 

* * * 

# Thenable Duck Typing

It's important to know for sure if some value is a genuine Promise or not. Will it behave like a Promise? 

Unfortunately, we can't just use `p instanceof Promise` to check. 

Instead, we can recognize Promises if they have a `then(..)` method on them. 

# Promise trust 

The single most important aspect Promises establish is: trust. 

When you pass a callback to a utility, it might: 

* Call the callback too early 
* Call the callback too late (or never)
* Call the callback too few or too many times 
* Fail to pass along any necessary environment/parameters 
* Swallow any errors/exceptions that may happen

Promises are designed to provide useful, repeatable answers to all these concerns. 

## Calling too early 

Even an immediately fulfilled Promise cannot be observed sycnhronously. 

When you call `then(..)` on a Promise, even if that Promise was already resolved, the callback you provide to `then(..)` will always be called asynchronously. 

## Calling too late 

A Promise's `then(..)` registered observation callbacks are automatically scheduled when either `resolve(..)` or `reject(..)` are called by the Promise createion capability. 

Those scheduled callbacks will predictably be fired at the next async moment. 

Since sync observation isn't possible, it's not possible for a synchronous chain of events to delay another callback from happening as expected. 

That is to say, when a Promise is resolved, all `then(..)` registered callbacks on it will be called, in order, immediately as the next async opportunity. 

Still, there are some nuances of scheduling, and it's best to avoid ordering multiple callbacks on promises in a significant way. 

## Never calling the callback 

Promises offer several solutions here. First - nothing can prevent a Promise from notifying you of its resolution. If you register both fulfillment and rejection callbacks, and the Promise gets resolved, one of the two will always be called. 

Even if a Promise never gets resolved, you can use a higher level abstraction called a *race*. 

Use the code sample from page 70 for this one. 

```
// Example page 70

// utility for timing out a Promise
function timeoutPromise(delay) {
  return new Promise( function(resolve, reject) {
    setTimeout(function() {
      reject( "Timeout!" );
    }, delay);
  });
}

// setup a timeout for foo()

Promise.race( [
  foo(), // attempt foo
  timeoutPromise(3000) // give it 3 seconds
])
.then( 
function() {
  // Foo fulfilled
},
function(err) {
  // foo reject, or it didn't finish in time, so inspect err to know which
})
```

## Calling too few or too many times 

By definition, one is the appropriate number of times for the callback to be called. Too few is 0 calls, which is the same as the "never" case already covered. 

Too many is also easy to solve. Promises can only be resolved once. The Promise will accpet only the first resolution and silently ignore subsequent resolution attempts. 

Since a Promise can only be resolved once, any `then(..)` registered callbacks will only ever be called once (each). 

## Failing to pass along any parameters/environment 

Promise can have at most one resoltuion value. If you don't explicitly resolve it, the value is undefined. Whatever the value is, it's *always* passed to all registered callbacks. 

## Swallowing any errors/exceptions

This is a restatement of the previous point. If you reject a Promise with a reason, that value is passed to the rejection callback(s).

But a bigger point: if at any point in the creation of a Promise, or in the observation of its resolution, a JS exception error occurs, that exception will be caught and the Promise will become rejected. 

This is important because errors that could create a synchronous reaction are now treated asynchronously so there's no chance of race conditions. 

## Trustable promise? 

Promises don't get rid of callbacks. They just change where the callback is passed to. INstead of passing a callback to a function, we get something back from the function, and we pass the callback to that something instead. 

One of the mos timportant details of Promises is that they have a solution to the trust issue. Native ES6 Promises have `Promise.resolve(..)`. 

If you pass an immediate, non-Promise, non-thenable value to `Promise.resolve(..)`, you get a promise that's fulfilled with that value. In this case, promises p1 and p2 will behave identically, as in the example on page 73. 

```
// Example page 73

var p1 = new Promise( function(resolve, reject) {
  resolve(42);
});

var p2 = Promise.resolve(42); 
```

But if you pass a genuine Promise to `Promise.resolve(..)` you get the same promise back, as in the example on page 74.

More importantly, if you pass a non-Promise thenable value to `Promise.resolve(..)`, it will attempt to unwrap that value and the unwrapping will keep going until a concrete final non-Promise-like value is extracted. 

Looking at the evil laugh code, we can pass either of those versions to `Promise.resolve(..)` and get the normalized, safe result we'd expect. 

`Promise.resolve(..)` will accept any thenable and unwrap it to its non-thenable value. You get back a real, genuine Promise in its place, one you can trust. If you gave it one to begin with, you just get it back. No real risk there. 

If you're using a third party library and you're not sure you can trust something to be a well-behaving promise, but you know it's at least thenable, we can `Promise.resolve(..)` it to get a trustable Promise wrapper to chain off of. Like the example from page 74. 

```
// Example page 74 

var p = {
  then: function(cb) {
    cb(42);
  }
};

// this works OK but only by good forutne 

p.then(
function fulfilled(val) {
  console.log(val); // 42
},
function rejected(err) {
  // never gets here
});

// This p is thenable, but it's not a genuine Promise. 
// Luckly, it's reasonable, as most will be, but what if you go back something that looked like: 

var p = { 
then: function(cb, errcb){ 
cb(42);
errcb("evil laugh");
}
};

p.then(function fulfilled(val) {
  console.log(val); // 42
},
      function rejected(err) {
  // oops, shoulnd't have run 
  console.log(err); // evill laugh
})

// Example page 74 

// don't just do this: 

foo(42)
.then( function(v) {
  console.log(v);
});

// instead, do this: 

Promise.resolve( foo(42 ) )
.then(funciton(v) {
      console.log(v);
      })
```

* * * 

# Chain flow 

