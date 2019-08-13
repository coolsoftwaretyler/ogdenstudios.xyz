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

Promises have a *this-then-that* operation as a building block, but we can string multiple Promises together to represent a sequence of async steps.

We can make this work with two behaviors intrinsic to Promises: 

1. Every time you call `then(..)` on a Promise, it creates and returns a new Promise, which we can *chain* with.
2. Whatever value returned from the `then(..)` call's fulfillment callback (the first param) is automatically set as the fulfillment of the chained Promise from the first point.

Consider: 

```
var p = Promise.resolve(21);

var p2 = p.then( function(v){
    console.log(v); // 21

    // fulfill `p2` with value `42`
    return v * 2;
});

// chain off `p2`
p2.then( function(v) {
    console.log(v); // 42
});
```

By returning `v * 2`, we fulfill the p2 pfromise that the first `then(..)` call created and returned. When p2's `then(..)` call runs, it's receiving the fulfillment from the `return v * 2` statement. `p2.then(..)` creates another promise, which could have been stored in a variable like `p3`. But it can get a bit annoying to keep using these intermediate variables. 

Fortunately, we can just chain them together like so: 

```
var p = Promise.resolve(21);

p.then(function(v){
    console.log(v); // 21 

    // fulfill the chained promise with value `42`
    return v * 2 
})
// Incoming chained process
.then(function(v){
    console.log(v); // 42
})
```

Now the first `then(..)` is step one in an asycn sequence, the second `then(..)` is the second step. You can just keep on going. 

Missing piece: what if step 2 needs to wait for step 1 to do something async? 

To make a Promise squence truly async capabile at every step has to do with the `Promise.resolve(..)` operation. Here, `Promise.resolve(..)` directly returns a received genuine Promise, or it unwraps the value of a received thenable - and keeps going recursively while it keeps unwrapping thenables. 

This unwrapping happens if you return a thenable or Promise from the fulfillment (or rejection handler). Consider: 

```
var p = Promise.resolve(21);

p.then(function(v){ 
    console.log(v); // 21

    // create a promise and return it 
    return new Promise(function(resolve, reject) {
        // fulfill with value `42`
        resolve(v * 2);
    });
})
.then(function(v) {
    console.log(v); // 42
})
```

Even though we wrapped 42 up in a promise that we returned, it still got unwrapped and ended up as the resolution of the chained promise, such that the second `then(..)` still received 42. If we introduce asynchrony to that wrapping promise, everything still nicely works the same: 

```
var p = Promise.resolve(21);

p.then(function(v) {
    console.log(v); // 21

    // create a promise to return 
    return new Promise(function (resolve, reject) {
        // introduce async! 
        setTimeout(function() {
            // fulfill with value `42` 
            resolve(v * 2);
        }, 100);
    });
})
.then (function(v) {
    // runs after the 100ms delay in the previous step 
    console.log(v); // 42
});
```

That's the ticket. Now we can construct a sequence of however many async steps we want, and each step can delay the next step as necessary. 

The value passing from step to step is optional. If you don't return an explicit value, an implicit `undefined` is assumed, and the promises still chain the same way. 

Let's consider a chain of ajax request: 

```
// assume an `ajax({url}, {callback})` utility 

// Promise-aware ajax 
function request(url) {
    return new Promise(function(resolve, reject) {
        // the ajax(..) callback should be 
        // the promises' resolve function 
        ajax(url, resolve);
    })
}
```
We first define a `request(..)` utility that constructs a promise to represent the completion of the `ajax(..)` call. 

```
request("http://some.url.1")
.then( function(response1) {
    return request("http://some.url.2/?v=" + response1);
})
.then(function(response2) {
    console.log(response2);
});
```

Using the Promise-returning `request(..)`, we create the first step in our chain implicity by calling it with the first URL, and chain off that returned promsit with the first `then(..)`. 

The promise chain we construct is not only a flow control that expresses a mutlistep async sequence, but it also acts as a message channel to propagate messages from step to step. 

What if something went wrong in one of the steps? It's possible to catch an error at any point in the chain since error/exception is on a per-Promise basis. We can catch and reset the chain back to normla operation at that point, like so: 

```
// step 1: 

request( "http://some.url.1")

// step 2:
.then (function(response1) {
    foo.bar(); // undefine, error! 

    // never gets here 
    return request ("http://some.url.2/?v=" + response1);
})

// step 3: 
.then(function fulfilled(response2) {
    // never gets here
},

function rejected(err){
    console.log(err);
    // TypeError form foo.bar() error
    return 42
})


// step 4: 

.then(function(msg) {
    console.log(msg); // 42
})
```

If you were to forget to add an exception handler, the Promise will use an assumed rejection handler, which basically just throws the error. This will propagate an error along until it hits an explicitly defined rejection handler. 

Similarly, there's a default success handler that just returns a value. 

Review the intrinsic behaviors of Promises that allow chaining flow contro: 

* A `then(..)` call against one Promise automatically produces a new Promise to return from the call. 
* Inside the fulfillment/rejection handlers, if you return a value or an exception is thrown, the new returned (chainable) Promise is resolved accordingly. 
* If the fulfillment or rejection handler returns a Promise, it is unwrapped, so that whatever its resolution is will become the resolution of the chained Promise returned from the current `then(..)`

While chaining flow is useful, it's really just a side benefit of how Promises compose together, rather than the main intention. 

Promise normalize asynchrony and encapsulate time-dependent value state, and *that* is what lets us chain them together usefully. 

* * * 

# Terminology:  Resolve, Fulfill, Reject

The words you use will affect how you think about the code and how other devs on your team will think about it. So while it doesn't technically matter what you call the callbacks, it matters in practicality. 

Promise constructors use the syntax: 

```
var p = new Promise( function(X,Y) {
    // X() for fulfillment
    // Y() for rejection
});
```

Where Y is always for rejected, and X is only *usually* for fulfilled. 

So the second param is easy to decide. Almost all sources use `reject(..)`, which works because that's exactly and only what it does. 

But the first param has some ambiguity. It's often labeled as `resolve(..)`, but resolution in terms of Promises means *fulfilling* or *rejecting*. Why  not use `fulfill(..)`? 

Here's an illustration: 

```
var rejectedTh = {
    then: function(resolved, rejected) { 
        rejected("Oops");
    ;
};

var rejectedPr = Promise.resolve(rejectedTh);
```

`Promise.resolve(..)` will return a received genuin Promise directly, or unwrap a received thenable. 

If that thenable unwrapping reveleas a rejected state, the Promise returned from `Promise.resolve(..)` is in fact that same rejected state. 

So `Promise.resolve(..)` is a good,a ccurate name for the API method, because it can result in either fulfillment or rejection. 

The first callback parameter of the `Promise(..)` wil lunwrap either a thenable (identically to `Promise.resolve(..)` or a geunuine promise: 

```
var rejectedPr = new Promise(function(resolve, reject) {
    // resolve the promise with a rejected promise
    resolve(Promise.reject("oops"));
});

rejectedPr.then(
    function fulfilled() {
        // never gets here
    },
    function rejected(err) {
        console.log(err); // "oops"
    }
);
```

So `resolve(..)` is the appropriate name for the first callback param of the `Promise(..)` constructor. 

But let's look at the callbacks provided to `then(..)`. What should we call them? 

the author recommends `fulfilled(..)` and `rejected(..)`.

The first parameter to `then(..)` is always unambiguously the fulfillment case. There's no need for the duality of "resolve". 

The ES6 specs use `onFullfiled(..)` and `onRejected(..)` to label them, so they're accurate. 

* * * 

# Error Handling 

We can't use `try..catch` with promises since it's synchronous. 

So standards have emerged for patterned error handling. Notably, the *error-first callback style*: 

```
function foo(cb) {
    setTimeout(function(){
        try {
            var x = baz.bar();
            cb(null, x); // success!
        }
        catch (err) {
            cb(err);
        })
    }, 100);
}

foo(function(err, val) {
    if (err) { 
        console.error(err); // bummer 
    }
    else {
        console.log(val);
    }
})
```

The callback passed to `foo(..)` expets to receive a signal of an error by the reserved first param, `err`. If present, error is assumed. If not, success is assumed. 

This error handling is technically async compatible, but difficult to compose. Multiple levels of these error-first callbacks will lead back to callback hell. 

So instead we use error handling in Promises with the rejection handler passed to `then(..)`. It looks more like: 

```
var p = Promise.reject("Oops");

p.then(function fulfilled() {
    // never gets here
},
function rejected (err) {
    // console.log(err); // "oops"
})
```

It looks easy on the surface, but has some nuance. Consider:

```
var p = Promise.resolve(42);

p.then(function fulfilled(msg) {
    // numbers don't have string functions, so it will throw an error 
    console.log(msg.toLowerCase());
},
function rejected(err) {
    // Never gets here
})
```

`msg.toLowerCase()` legit throws an error but our handler doesn't get notified, because *that* error handler is for the `p` promise. Since that's already been fulfilled with the 42 value, and promises are immutable, the only promise that can be notified of the error is the one returned from `p.then(..)`, which in this case we don't caputre. 

Error handling with Promises is difficult. Errors can get swallowed because of the nuance. 

This is basically *pit of despair* programming. Some people tag a final `.catch(handleErrors)` on the end of all their promise chains - but what if there's an error there? It keeps going. It's a difficult problem to solve completely. 

Some libraries have global unhandled rejection errors which works OK. 

The author goes on to explain a proposal for a pit of success around Promise error handling. 

* * * 

# Promise patterns 

There are tons of other abstactions we can build on top of promise control flow. 

There are two patterns built directly into ES6 Promises: 

1. Promise.all([..])
2. Promise.race([..])

## Promise.all([..])

`Promise.all([..])` expects a single argument, an array, of Promise instances. 

The promise returned from `Promise.all([..])` will receive a fulfillment message that is an array of all the fulfillment messages from the passed i npromises, in the same order as specified. The main promise returned from `Promise.all([..])` will only be fulfilled if and when all its constituent promises are fulfilled. If any one of those promises is instead rejected, the main promise is rejected as well. This is a case where rejection handlers become very important. 

## Promise.race([..])

This is basically "first Promise to cross the finish line". It's classically called a latch, but in Promises it's a race. Not to be confused with *race conditions*. 

You can race a promise against a timeout, as well, whihc is a neat way to set up time limits on certain processes. 

* * * 

# Promise API Recap 

## new Promise(..) Constructor 

The revealing constructor `Promise(..)` must be used with `new` and provided a function callback, which is called synchronously/immeditaely. This function is passed two callbacks that act as resolution capabilities for the promise. 

## Promise.resolve(..) and Promise.reject(..)

`.resolve(..)` is used to create an already-fulfilled Promise, like `Promise.reject(..)`, but it also unwraps thenable values. 

## then(..) and catch(..)

Each Promise instance has `then(..)` and `catch(..)` methods, which allow registering of fulfillment and rejection handlers for the Promise. Once it's resolved, one or the other is called, but not both. It will always be called async. 

`then(..)` takes two params: first for the fulfillment callback, and the second for the rejection callback. If either is ommitted, there are defaults. 

`catch(..)` takes only the rejection callback as a param, and defaults on fulfillment. 

Both of these also create and return a new promise, which can be used to express Promise chain flow control. 

## Promise.all([..]) and Promise.race([..])

Static helpers create Promises as their return values, and their resolution is dependent on the arrays passed in. All acts as a gate (all must get fulfilled), race acts as a latch (only the first fulfillment matters). 

## Promise limitations 

* An error in a Promise chain can be silently ignored accidentally 
* There's no external way to observe a Promise chain and its errors 
* Promises only have a single fulfillment value - usually not a huge deal, but in complex apps it may matter more
* Since promises can only be resolved once, we may run into issues in things like classic event listeners
* It's difficult to port callbacks back over to promises. 
* You can't cancel a promise once you've created it and registed its fulfillment and/or rejection handlers. 
* Promises are very slightly slower. 
* Promises make everything async, which means some immediate complete steps will defer advancement of th enext step to a job. 

## Review 

Promises solve the inversion of control issues that callbacks have

They don't get rid of callbacks, the just redirect the orchestration of those callbacks to a trustable intermediary mechanism that sits between us an anohter utility. 

Promise chains begin to address a better way of expressing async flow in sequential fahion. 

* * * 

# Generators 

Two key drawbacks to expressing async flow control with callbacks: 

1. It doesn't fit how our brain plans steps of a task
2. Not trustable or composable because of inversion of control. 

Promise uninert the inversion of control, restoring trustability and composability. 

Now we turn to expressing async flow control in a sequential, synchronous looking fasion. The magic here is ES6 *generators*.

# Breaking run-to-completion 

Generators do not behave with the run-to-completion behavior. Consider: 

```
var x = 1; 

function foo() {
    x++;
    bar(); // what about this line? 
    console.log("x:", x);
}

function bar() {
    x++;
}

foo(); // x: 3
```

We know for sure that `bar()` runs between `x++` and the console log. But what if it wasn't there? The result would be 2 instead of three. 

Ok, but what if `bar()` wasn't there, but it could run between the `x++` and console log? 

Here's the ES6 code to accomplish this cooperative concurrency: 

```
var x = 1;

function *foo() {
    x++;
    yield; // pause!
    console.log("x:", x)
}

function bar() {
    x++;
}
```

Now it can be run in a way that executes `bar()` at the point of the yield inside of `*foo()`: 

```
// construct an iterator `it` to control the generator 

var it = foo();

// start `fo()` here: 
it.next();
x; // 2
bar();
x; // 3
it.next(); // x: 3
```

So on start, we run until `yield`, and resume later. But we didn't have to. 

A generator is a special kind of function that can start and stop one or more times, and doesn't necessarily ever have to finish. This is a fundamental building block of constructing generators as async flow control as a pattern for coding. 

* * * 

# Input and Output

Generators still accept arguments and return values if you want. 

In order to actually execute generator code, we need to tie it to an iterator object and kick it off with `.next(..)`.

* * * 

# Multiple iterators 

It might seem like syntactic usage of an iterator controls a generator function itself. But each time you make an iterator, you're implicitly constructing an instance of the generator which that iterator will control. So it's not assignment by reference, it's assignment by copy to some degree. 

* * * 

# Interleaving 

Generators make clear interleaving possible: 

```
var a = 1; 
var b = 2; 

function *foo() {
    a++;
    yield;
    b = b * a;
    a = (yield b) + 3;
}

function *bar() {
    b--; 
    yield;
    a = (yield 8) + b;
    b = a * (yield 2);
}
```

Depending on what order the *iterators* controlling `*foo()` and `*bar()` are called, this program could produce several different results, much like the race conditions in multithreaded applications. Consider a helper function called `step()`: 

```
function step(gen) {
    var it = gen();
    var last; 

    return function() {
        // whatever is `yield`ed out, just send it right back in the next time!
        last = it.next(last).value;
    }
}
```

Consider the effects of this interleaving: 

```
// reset `a` and `b` 
a = 1;
b = 2;

var s1 = step(foo);
var s2 = step(bar);

// run `*foo()` completely first 
s1();
s1();
s1();

// now run `*bar()`
s2();
s2();
s2();
s2();

console.log(a, b); // 11 22
```

And then you can mix and match to get different values. It's certainly not desireable to have this level of interleaving, but it's good to know it's possible. 

* * * 

# Generator-ing Values

## Producers and Iterators 

Imagine you're producing a series of values where each value has a definable relationship to the previous value. To do this, you need a stateful producer that remembers the last value it gave out. 

We can implement this with a function closure: 

```
var gimmeSomething = (function() {
    var nextVal; 
    return function() {
        if (nextVal === undefined) {
            nextval = 1;
        } else {
            nextval = (3 * nextVal) + 6;
        }
        return nextVal
    }
}());

gimmeSomething(); // 1 
gimmeSomething(); // 9
gimmeSomething(); // 33 
gimmeSomething(); // 105
```

Random number series aren't realistic, but imagine if we used this same code to generate records from a data source. 

This is a common design pattern that iterators solve. An *iterator* is a well defined interface for stepping through a series of values from a producer. The JS interface for iterators is to call `next()` each time you want the next value from the producer: 

```
var something = (function() {
    var nextVal;

    return {
        // needed for `for..of` loops 
        [Symbol.iterator]: function() {return this;},

        // standard iterator interface method
        next: function() {
            if (nextVal === undefined) {
                nextVal = 1;
            }
            else {
                nextVal = (3 * nextVal) + 6;
            }
            return { done: false, value: nextVal};
        }
    }
});

something.next().value; // 1
something.next().value; // 9 
something.next().value; // 33 
something.next().value; // 105
```

# Iterables 

the `something` object in our example is called an *iterator* because it has the `next()` method on its interface. A closely related term is *iterable*, which is an object that contains an `iterator` that can iterate over its values. 

In ES6, the way to retrieve an `iterator` from an `iterable` is that the `iterable` hmust have a function on it, with the name being the special ES6 symbol value `Symbol.iterator`. When this function is called, it returns an `iterator`. Generally, each call should return a fresh new `iterator`. 

# Generator iterator

So back to generators, in the context of *iterators*. A generator can be treated as a producer of values we extract one at a time through an *iterator* interface's `next()` calls. 

A generator itslef is not technically an *iterable*, but it's similar - when you execute a generator, you get an *iterator* back. We can implement the `something` generator with a generator like this: 

```
function *something() {
    var nextVal; 

    while(ture) {
        if (nextVal === undefined) {
            nextVal = 1;
        }
        else {
            nextVal = (3 * nextVal + 6);
        }
        yield nextVal;
    }
}
```

Which looks cleaner and is simpler to implement. Since the generator is pausing at the `yield`, the scope sticks around. There's no need for closure to preserve variable state across calls. 

We can even use this in `for .. of` loops. 

* * * 

# Iterating Generators Asynchronously 

So what do these have to do with async coding patterns? 

Think again about a callback: 

```
function foo(x,y,cb) {
    ajax("http://some.url.1/" + x + y, cb);)
}

foo(11, 31, function(err, text) {
    if (err) {
        console.error(err);
    } else {
        console.log(text);
    }
});
```

But we can express this task flow control with a generator like so: 

```
function foo(x,y) {
    ajax("https://some.url.1/" + x + y, 
    function(err, data) {
        if (err) {
            // throw an error into `*main()`
            it.throw(err);
        }
        else {
            // resume `*main()` with received `data` 
            it.next(data);
        }
    });
}

function *main() {
    try {
        var text = yield foo(11, 31);
        console.log(text);
    }
    catch (err) {
        console.error(err);
    }
}

var it = main();

// start it all up! 
it.next();
```

This is longer, maybe more complex looking. But it's better. Here's why: 

We can get back the async ajax call back in a synchronous feeling way because of the `yield`. 

We get synchronous-looking code inside the generator (other than `yield` itself), but hidden behind the scenes, the operations can happen asycn. 

We're abstracing the asynchronicity away as an implementation detail, so we can reason synchronously/sequentially about our flow contro. 

We also get synchronous error handling in the `try..catch`. The yield allows `try..catch` to catch async errors as well. 

So we get synchronous looking code and synchronous looking error catching. 

* * *

# Generators + Promises 

The last section is a great way to get sync looking code in async implementation, but we still don't have our trustability and composability. Fortunately, we can incorporate that as well. 

We could construct a promise and yield it from a generator, and then the iterator control code would receive that promise. 

But what should the iterator do with the promise? 

It can listen for the promise to resolve andthen either resume the generator with the fulfillment message or throw an error. 

To repeat: **the natural way to get the most ouf of Promises and generators is to yield a Promise, and wire that Promise to control the generator's iterator**. 

Here's how: 

```
function foo(x,y) {
    return request("http://some.url.1/" + x + y);
}

function *main() {
    try {
        var text = yield foo(11, 31);
        console.log(text);
    }
    catch(err) {
        console.error(err);
    }
}
```

The code in `*main()` didn't have to change at all. Whatever values are yielded out is an opaque implementation detail, so we don't worry about it. 

But how to run `*main()`? We still need to do some plumbing. Maybe something like this: 

```
var it = main(); 

var p = it.next().value;

// wait for the promsie to resolve
p.then(function(text) {
    it.next(text);
}, 
function(err) {
    it.throw(err0;)
});
```

This isn't quite robust enough - it requires us to manually write out the promise chain for each generator differently. What we really want to do is loop over the iteration control and each time a Promise comes out, wait on its resolution before continuing. We also want to handle errors. 

# Promsise-aware Generator Runner 

We'll want something of a utility to do this for us. Many libraries have this, and if you use one, you want to write it once and get it right. 

Let's learn and build one, and call it `run(..)`.

```
function run(gen) {
    var args = [].slice.call(arguments, 1), it;

    // initialize the generator in the current context 
    it = gen.apply(this, args);

    // return a promise for the generator completing 
    return Promise.resolve()
        .then(function handleNext(value) {
            // run to the next yielded value 
            var next = it.next(value);

            return (function handleResult(next) {
                // generator has completed running? 
                if (next.done) {
                    return next.value;
                }
                // otherwise keep going 
                else {
                    return Promise.resolve(next.value) 
                        .then(
                            // resume the async loop on success
                            // send the resolved value back into the generator 
                            handleNext,

                            // if `value` is a rejected promise, propagate error back into the generator for its own error handling
                            function handleErr(err) {
                                return Promise.resolve(
                                    it.throw(err);
                                )
                                .then(handleResult);
                            }
                        );
                }
            })(next);
        });
}
```

It's pretty complex, and you might not want to manage this yourself, especially for each generator you use. Utilities and libary helpers are a good choice for this. 

## Async/Await 

This pattern of generators yielding Promises that then control the generator's iterator to advance it to completion is a powerful and useful approach. Ideally we'd be able to do it without the clutter of a library or helper. 

Fortunately, post ES6 is coming out with something. There's a decent chance we'll see something like: 

```
function foo(x,y) {
    return request("http://some.url.1/" + x + y);
}

async function main() {
    try {
        var text = await foo(11,31);
        console.log(text);
    }
    catch (err) {
        console.error(err);
    }
}

main();
```

There's no external helper call. `main()` is just called as a normal function. `main()` doesn't even need to be declared as a generator fucntion: it's an async function. Instead of yielding a promise, we just wait for it to resolve. 

* * * 

# Promise Concurrency in Generators 

Most of these examples have had single-step async flow. Most programs will have much more. The sync-looking style of generators may make you complacent. It can lead to suboptimal performance patterns. 

Imagine you want to fetch data from two different places, combine the data, and make a third request. Finally, you want to print out the response. Using these techniques, you might try something like: 

```
function *foo() {
    var r1 = yield request("https://some.url.1");
    var r2 = yield request("https://some.url.2");

    var r3 = yield request("https://some.url.3/?v=" + r1 + "," + r2);

    console.log(r3)
}

run(foo);
```

It'll work, but it won't be optimal. r1 and r2 should run concurrently, but the run sequentially here. Since the requests are independent, they should be run at the same time. 

But how do we do that with yield? 

The most effective answer is to base the async flow on Promises, specifically on their capability to manage state in a time-independent fashion. Something like this: 

```
function *foo() {
    // make both requests 'in parallel' 
    var p1 = request('https://some.url.1);
    var p2 = request('https://some.url.2');

    // wait until both promises resolve 
    var r1 = yield p1;
    var r2 = yield p2;

    var r3 = yield request("https://some.url.3/?v=" + r1 + "," + r2);

    console.log(r3);
}

run(foo);
```

This is different because the `yield` is waiting for the resolutions of the promises, not the requests themselves. p1 and p2 will run concurrently, and both have to finish before r3 can be made. 

It's basically the gate pattern, so we could also use that. 

All of the concurrency capabilities of Promises are available to us in the generator + Promise approach. Any place you need more than sequential this-then-that async flow, Promises are likely your best bet. 