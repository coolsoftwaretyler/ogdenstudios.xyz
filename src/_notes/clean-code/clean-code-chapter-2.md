---
layout: post
title:  "Clean Code Chapter 2"
---

# Names 

Programming is all about naming. We do it in almost every aspect of programming. Here are simple rules for creating good names. 

## Use intention-revealing names 

Take your time finding the right names. Change names when you need to. It will make things better. 

The name of a variable, function, or class should answer the big questions. It should tell you why it exists, what it does, and how it isused. If you need a comment, then the name doesn't reveal its intent. 

Consider: 

```
var d; // elapsed time in days 
```

`d` is a terrible name. Perhaps something like: 

```
var elapsedTimeInDays;
var daysSinceCreation;
var daysSinceModification;
var fileAgeinDays;
```

Something like this becomes revelatory. 

Consider a bad example that's hard to tell what's going on: 

```
function getThem() {
    list1 = new ArrayList();
    for (x=0; x<theList; x++) {
        if (x[0]==4) {
            list1.add(x);
        }
    }
    return list1;
}
```

This code is straightforward, indentation is fine. There aren't any fancy methods. 

The problem isn't the simplicity or complexity of the code. The problem is the *implicity* of the code. The code implicitly requires we know the answers to questions such as: 

1. What kinds of things are in `theList`?
2. What is the significants of the zeroth subscript of an item in `theList`?
3. What is the significance of the value 4? 
4. How would I use the list being returned? 

The answers to these questions don't exist in the code snippet, but they could. 

Let's say we're making a minesweeper game. The board is a list of cells called `theList`. Let's rename it to `gameBoard`. 

Each cell on the board is represented by an array. We find that the zeroth subscript is the location of a status value and that a status value of 4 means "flagged". Just by giving these concepts names, we can improve the code: 

```
function getFlaggedCells() {
    var flaggedCells = []; 
    for (x=0; x < gameBoard.length; x++) {
        if (cell[STATUS_VALUE] == FLAGGED) {
            flaggedCells.add(gameBoard[x]);
        }
    return flaggedCells
    }
}
```

The complexity of the code hasn't changed. It's almost identical. But it's become more explicit. 

This is the power of choosing good names. 

## Avoid disinformation 

Look out for acronyms, or things like `list` - which have specific meaning to programmers. Beware of names that vary only slightly. 

Spelling similar concepts similarly is *information*. Using inconsistent spellings is *disinformation*. With things like autocompletion, it can be helpful if names for very similar things sort together alphabeitcally and are close to each other. 

## Make meaningful distinctions

OFten programmers create problems when they try to write names for compilers and not for humans. A good examples is using number series or noise words. Even though this works to write different variables in a scope, it creates a problem. `a1` and `a2` are not meaningfully different. 

Consider: 

```
function copyChars(a1, a2) {
    for (var i = 0; i < a1.length; i++) {
        a2[i] = a1[i];
    }
}
```

This reads better when `source` and `destination` are used for the argument names. 

Noise words are also a meaningliess distinction. If you have a `Product` class, naming something `ProductInfo` or `ProductData` creates a problem. 

Here is an egregious example from a real program: 

```
getActiveAccount();
getActiveAccounts();
getActiveAccountInfo();
```

How could you possible know what to call and when? 

## Use pronouncable names 

Human brains are wired to work with words. Words are, by definition, pronouncable. Don't waste human capability by using unpronouncable names. If you can't pronounce it, you can't discuss it without sounding like an idiot. 

Compare a bad example vs. a good one: 

```
var DtaRcrd102 = {
    genymdhms: new Date(),
    modymdhms: new Date()
    pszqint: '102'
}
```

vs. 

```
var Customer = {
    generationTimestampe: new Date(),
    modificationTimestamp: new Date(),
    recordId = '102'
}
```

Now you can have reasonable conversations about these two different objects. 

## Use searchable names 

Single-letter names and numeric constants have a problem because they are hard to locate across a body of text. 

The author's preference is to use single-letter names only as local variables inside short methods. *The length of a name should correspond to the size of its scope*. 

Compare something like these two snippets: 

```
for (var j=0; j<34; j++) {
    s += (t[j]*4)/5;
}
```

vs 

```
var realDaysPerIdealDay = 4;
const WORK_DAYS_PER_WEEK = 5; 
var sum = 0; 

for (var j=0; j < NUMBER_OF_TASKS; j++) {
    var realTaskDays = taskEstimate[j] * realDaysPerIdealDay;
    var realTaskWeeks = (realdays / WORK_DAYS_PER_WEEK);
    sum += realTaskWeeks;
}
```

Note that `sum` is not particularly useful, but at least it's searchable. This intentionally named code makes for longer function, but it will be much easier to find `WORK_DAYS_PER_WEEK` than to find all the places where `5` was used and filter them down. 

## Avoid Encodings 

Encoding type or scope information into names adds an extra burden of deciphering. It adds more cognitive load on top of learning the codebase itself. Encoded names are seldom pronounceable, and easy to mis-type. 

## Avoid mental mapping 

Readers shouldn't have to mentally translate your names into other names they know. This problem usually arises from not using problem domain terms or solution domain terms. This is also a problem with single-letter variable names. 

A professional programmer understands that *clarity is king*. 

## Class names 

Classes and objects should have noun or noun phrase names like `Customer`, `WikiPage`, `Account`, or `AddressParser`. A class name should not be a verb. 

## Method names 

Methods should have verbs. Like `postPayment`, `deletePage`, `save`. 

## Don't be cute 

If names are too clever, they will only be memorable to people who share the author's sense of humor, and only as long as they remember the joke.  Will they know what the `HolyHandGrenade()` function does in two years? `DeleteItems` might be a better name. Choose clarity over entertainment. 

Say what you mean. Mean what you say. 

## Pick one word per concept 

It's weird to have `fetch`, `retrieve`, and `get` as equivalent methods of different classes. A consistent lexicon is a great boon to the programmers who must use your code. 

## Don't pun 

Don't use the same word for two purposes. This is essentially a pun. If you follow the "one word per concept" rule, you could end up with many classes that have, for example, an `add` method. As long as the parameter lists and return values are semanticallye quivalent, all is well. 

But if you use the same word for a different type of addtion, you've added confusion to the code. 

As authors, our goal is to make our code as easy as possible to understand. We want our code to be a quick skim, not an intense study.

## Use solution domain names

The people who read your code will be programers. Use CS terms, algorithm names, pattern names, etc. Don't draw every name from the problem domain because you don't want coworkers referencing the customer for every name meaning. 

## Use problem domain names 

When there isn't much in common programming lexicon for what you're doing, try to use names that are meaningful in the domain you're working in. Seaprating solution and problem domain concepts is part of the job of a good programmer and designer. The code that has more to do with problem domain concepts should have names drawn from the problem domain. 

## Add meaningful context 

Some names are meaningful by themselves. Most are not. Place names in context for your reader by enclosing them in well-named classes, functions, etc. Prefixing a name can be used as a last resort. 

Imagine `firstName`, `lastName`, `street`, `houseNumber`, `city`, `state`, and `zipcode`. Together, it looks like an address. But if `state` was on its own, that might not be clear. 

You could add context with a prefix like `addrState`. Of course, a better solution is for `state` only to appear in an `Address` object or associated function. Consider this code snippet. Do the variables need more meaningful context? the function name provides part of the context, the algorithm provides the rest: 

```
function printGuessStatistics(candidate, count) {
    var number;
    var verb; 
    var pluralModifier; 
    if (count == 0) {
        number = "no";
        verb = "are"; 
        pluralModifier = "s";
    } else if (count == 1) {
        number = "1";
        verb = "is";
        pluralModifer = "";
    } else { 
        number = count.toString();
        verb = "are"; 
        pluralModifier = "s";
    }

    var guessMessage = `There ${verb} ${number} ${candidate} ${pluralModifier}`;
    console.log(guessMessage);
}
```

`number` `verb`, and `pluralModifier` are part of the "guess statistics" message. But that context has to be inferred. The meanings of the variables are opaque. 

The funciton is a bit too long and the variables are used throughout. Consider creating a class for `GuessStatisticsMessage` and making the variables into properties. This provides a clear context for the three variables. They are *definitively* a part of the `GuessStatisticsMessage`.  The improvement of context also allows the algorithm to be made much cleaner by turning it into smaller functions. 

``` 
var GuessStatisticsMessage = function () {
    var number;
    var verb;
    var pluralModifier;

    function make(candidate, count) {
        createPluralDependentMessageParts(count);
        return `There ${verb} ${number} ${candidate} ${pluralModifier}`;
    }

    function createPluralDependentMessageParts(count) {
        if (count == 0) {
            thereAreNoLetters();
        } else if (count == 1) {
            thereIsOneLetter(0;)
        } else {
            thereAreManyLetters(count);
        }
    }

    function thereAreManyLetters(count) {
        number = count.toString();
        verb = "are";
        pluralModifier = "s";
    }

    function thereIsOneLetter() {
        number = "1";
        verb = "is";
        pluralModifier = "";
    }

    function thereAreNoLetters() {
        number = "no";
        verb = "are";
        pluralModifier = "s";
    }
}
```

## Don't add gratuitous context 

Shorter names are generally better than logner ones, as long as they're clear. Only add as much context as is necessary. So don't overdo it on the last point.

## Final words 

The hardest thing about choosing good names is that it requires good descriptive skills and a shared cultural background. This is a teaching issue, not a technical, business, or management issue. Many people who are programmers don't do it well. 

People are also afraid of renaming things for fear that some other dev will object. Don't be afraid of that. Most people haven't memorized your names. We have modern tools to handle those details, so we can focus on whether the code reads like paragraphs and sentences, or at least like a narrative. You might surprise someone when you do this, but don't let it stop you. 

Follow some of these rules and see if you improve the readability of your code. If you are maintaining someone else's code, use refactoring tools to resolve these problems. It will pay off. 