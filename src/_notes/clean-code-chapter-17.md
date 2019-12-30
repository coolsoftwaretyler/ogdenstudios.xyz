---
layout: post
title: Clean Code Chapter 17
---

# Smells and heuristics 

## Comments 

### C1: Inappropriate information 

It is inappropriate for a comment to hold information better held in a difference kind of system, such as source control, issue tracking, or any othe rrecord-keeping system. Change histories clutter up source files. Meta-data should not papear in comments. 

Comments should be reserved for technical notes about the code and design. 

### C2: obsolete comment

A comment that has gotten old, irrelevant, and incorrect is obsolete. Comments get old quickly. It is best not to wrtie a comment that will become obsolete. If you find an obsolete comment, it is best to update it or get rid of it as quickly as possible. Obsolete comments migrate away from code they once described. They become floating islands of irrelvance and misdireciton in the code. 

### C3: redundant comment

A comment is redundant if it describes something that adequately describes itself. For example: 

```
i++; // increment 1
```

Comments should say things the code cannot say for itself. 

### C4: poorly written comment

A comment worht writing is worth writing well. Choose words carefully. use correct grammar and punctuation. Don't ramble. Don't state the obvious. Be brief. 

### C5: commented-out code 

Don't comment out stretches of code. You don't know how old it is or if it's meaningful. No one will delete it because everyone assumes someone else needs it. 

It sits and rots, getting less and less relevant with every day. 

Delete commented-out code. Source code control will remember. If someone needs it, they can get it. 

## Environment 

### Build requires more than one step 

Builing a project should be a single trivial operation. You shouldn't have to get a ton of dependencies and scripts. You should check out a system with a comman and issue another one to build it. 

### Tests require more than one step

You should be able to run all the unit tests with just one command. Being able to run all the tests is so fundamental and so important it should be quick, easy, and obvious to do. 

## Functions

### Too many arguments

Functions shoul dhave a small number of arguments. None is best, followed by one, two, and three. More than three is quesitonable and should be avoided. 

### Output arguments

They're counterinitive. Readers expect arguments to be inputs, not outputs. If your function must change the state of something, have it change the state of the object it's called on. 

### Flag arguments

Boolean arguments loudly declare the function does more than one thing. They are confusing and should be eliminated. 

### Dead function 

Methods that are never called should be discarded. Keeping dead code around is wasteful. delete it. Source control will have it for you if you need it again. 

## General

### Multiple languages in one source file 

A source file should contain one and only one language. SOmetimes we have to use more than one, but we should minimze this. 

### Obvious behavior unimplemented

Following the principle of least surprise, any funciton should implement the behaviors anothe rpgorammer could rexpect.  

When an obvious behavior is not implemented, readers and users of the code can no longer depend on their intuition about function names. They lose their trust in the original author and must fall back on reading the details of the code. 

### Incorrect behavior at the boundaries

There is no replacement for due diligence. Every boundary condition, every corner case, every quirk and excption represents something that can confound an elegant and intuitive algorithm. Don't rely on your intuition. Look for every condition and writ ea test. 

### Overridden safeties

It's risky to override safeties. TUrning off failing tests and saying you'll get them to pass later is as bad as pretending credit cards are free money. 

### Duplication 

One of th emost important rules. DRY pinciple. If you see duplication in code, it represents a missed opportunity for abstraction. 

### Code at the wrong level of abstraction 

It's important to create abstractions that separate higher level general concepts from lowe level detialed concepts. 

YOu cannot lie or fake you rway out of mispalced abstraction. Isolating abstracitons is hard, and there's no quick fix when you get it wrong. 

### Base classes depending on their derivatives 

Partitioning concepts into base and derivative classes is so higher level base calss concepts can be indpeendent of the lwoer level classes. When we see base classes mentioning th enames of their derivative,s we suspect a problem. These based classes should know nothing about theri derivatives. 

There are exceptions 

### Too much information 

Well-define dmodules have small interfaces that allow you to do a lot with a little. Poorly defined modules have wide and edeep interfaces that force you to use many different gestures to get simple things done. A well-defined interface does not offer many functions to depend on, so coupling is low. A poorly defined interface dprovices lots of functions to call, so coupling is high. 

Hid your data. Hide your utility functions. Hide your constants and temps. DOn't create classes with lots of methods or lots of instance variables. Don't create lots of protected variables and functiosn for your subclasses. Concentrate on keeping interfaces very tight and very small. Keep coupling low by limiting information. 

### Dead code 

Dead code is code that isn't executed. It swells. It festers. iIt isn't updated when designs change, it compiles, but doesn't follow updates. 

### Vertical separation 

Variables and function should be defined close to where they are used. 

### Inconsistency 

If you do something a certain way, do all similar things in the same way. This goes back to the principle of least surprise. 

### Clutter 

Keep source fi,es clean, well orgnized, and free of clutter. 

### Aritficial coupling

Things that don't depend on each other shouldn't be coupled. General enums shouldn't be contained within more specific classes. 

### Feature envy 

Methods of a class should be interested in the variables and functions of the class they belong to. Not the variables and functions of other classses.  When a method usses accessors and mutators of som eothe robject to manipulate data in that objec,t it envies the scope of the class of that other object. It wishes it were in that other class. 

Eliminate this because it exposes the internals of one class to another. Sometime si'ts ncecessary. 

### Selector arguments

Each selector argument combines many functions into one. 

### Obsucred intent 

We want expressive code. Don't use esoteric names and ideas. Write straightforward. 

### Msipalced resonsibility 

Again, the principle of least surprise. Put stuff where it belongs. 

### Use explanatory variables 

Use meaningful names for variables, break up long calculations with them. 

### Function names should say what they do 

If you have to look at the implementation or documentation of a funciton to know what it does, you should work to find a better name or rearrang ethe functionality so it can be place din functions with better names. 

### Understand the algorithm 

Sometimes you have to guess and check to make at hing work. But don't just leave it there. Make sure you understnad how it works. 

### Follow standard conventions 

Every team should follow a coding standard based on industyr norms. 

### Replace magic numbers with named constants 

Thi sis an old rule in softwar dev. 

It's bad to have raw numbers in code. Hide them behind well-named constants. 

### Be precise 

When you make a decision in your code, make it precisely. Know why you made it and how you will deal with any exceptions. Don't be lazy about the precision of your decisions. 

### Structure over convention 

Enforce design decisiosn with structure over convention. 

### Encapsulate conditionals 

```
if (shouldBeDeleted(timer))
```

is better thant 

```
if (time.hasExpered() && !timer.isRecurrent())
```

### Avoid negative conditionals

They're a bit harder to understand than positives. 

### Function should do one thing 

### Hidden temporal couplings

Temporal couplings are often necessary, but don't hide it. Structure the arguments of your fucntions such that the order in which they should be called is obvious. 

### Don't be arbitary

Have a reason for how you structure code. If it's communicated and thoughtful, others will follow it. Otherwise, they will try to change it. 

### Functions should descend only one level of abstraction 

The statements within a function a should all be written at the same level of abstraction, which should be one level below the operation described by the name of the function. This may be the hardest of these heuristics to interpret and follow. Humans are good at mixing levels of abstraction. 

### Keep configurable data at high levels 

### Avoid transitive navigation 

We don't want a single module to know much about its collaborators.  The law of Demeter. 

## Names

### Choose descriptive names 

Names in software are 90 percent of what make software readable. Carefully chosen names overalod the structure of code with description. 

### Choose names at the approrpaite level of abstraction 

### Use standard nomencalture where possible 

### Use unambiuous names 

### Use long names for long scopes 

The length of an ame shoudl be related to the length of its scope 

### Avoid encodings

Nms should not be encoded with type or scope information.  

### Name sshould describe side effects 

## Tests

### Insufficient tests

A test suite should test everythign that could possibly break. The tests are insufficient as there are conditions that have not been explroed by tests or calculation s that havne't been validated

### Use a voerage tool 

### Don't skip trivial tests. 

They are easy to write and their documentary value is higher than the cost to produce them 

### An ignored test is a question about an ambiguity 

Sometimes we are uncertain about a behaviro deatil because req s are unclear. We can express our question about the requirements as a test with @ignore. 

### Test boudnary conditions

Take special care to test boundary conditions. 

### Exhaustively test near bugs

Bugs tend to congergeate. Do an exhaustive test of a function with a bug. 

### Pattersn of failure are revaling 

SOmetimes you cna diagnose a problem by finding pattersn in how the test cases fail. Thi sis another arugment for making the test cases as completea as possible. Complete test cases in a reasonable way expose patterns. 

### Test coverage patterns can be revealing 

Looking at code that is or isn ot executed by passsing tests gives clues to why the failing test sfail. 

### Tests should be fast. A slow test is a test that won't run. 