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

Single-letter names and numeric constants have a problem because they are hard to location across a body of text. 