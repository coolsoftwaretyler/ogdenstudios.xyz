---
layout: post
title: Clean Code Chapter 9
---

# Classes 

We dont' ahve clean code until we've paid attention to higher levels of code organization. Let's talk about clean classes. 

## Organization

Standar Java convention is:

a class should begin with a list of variables
Public static constants first, then private static variables, followed by private instance variables. There are rarely good reasons for public variables. 

Public functions should follow the list of variables. We put the private utilities called by a public funciton right after the public function itself. This follows the stepdown rule and helps the program read liek a newspaper article.

## Encapsulation 

It's good to keep variables and utility functions private, but you don't need to be fanatical. Sometimes it needs to be protected so it can be accessed by a test. Tests rule.

## Classes should be small!

The first rule of classes is they should be small. The second rule of classes is they should be smaller than that. Smaller is the primary rule, like with functions. The immediate question is "how small?"

Functions are measured with lines of code. With classes, we use a different measure: *responsibilities*. 

The name of a class should describe what responsibilities it fulfills. Naming is probably the first way of determining class size. If we cannot derive a concise name for a class, it's likely too large. 

The more ambiguous the class name, the more likely it has too many responsibilities. Calss names including weasel words like *Processor* or *Manager* or *Super* often hint at aggregation of too many responsibilities. 

We should be able to write a brief description of the class in about 25 words, without using the words "If", "and", "or", or "but". 

### Single responsibility principle

States that a class or module should have one and only one *reason to change*. This principle gives us a definition of responsibility and guidelines for class size. Classes should have one responsibility and one reason to change. 

Trying to identify responsibilities (reasons to change) helps us recognize and create better abstractions.

SRP is one of the most important concepts in OO design. It's also simple to understand and ahdhere. Yet its often the most abused class design principle. We regularly encounter classes that do far too many things. Why? 


Getting software to work and making software clean are two very different activities. Most of us have limited room in our heads. So we focus on getting code to work more than organization and cleanliness. This is appropriate. Separation of concerns is just as important in our programming *activities* as it is in the programs. 

The problem is many people think we're done once hte program works. We fail to switch to the *other* concern of organization and cleanliness. We move on to the next problem rather than going back and breaking overstuffed classes into decoupled units with single repsonsibilities. 

Additionally, many devs fear a large number of small, single-purpose classes make it more difficult to understand the bigger picture. They are concerned they must navigatioe from class to class to figure out how everything works. 

However, a system with many small classes has no more moving parts than a system with a few large classes. The question is: 

do you want your tools organized into toolboxes with many small drawers containing well defined and well labeled components? Or do you want a few drawers you just toss everythign into. 

Every sizable system will contain a large amount of logic and complexity. The primary goal in managing such complexity is to organize it so a developer knows where to look to find things and need only understand the directly affected complexity at any time. 

We want our systems to be composed of many small classes, not a few large ones. Each small class encapsulates a single responsibility, a single reason to change, and collaborates with a few others to achiee the desired system behaviors. 

### Cohesion 

Classes should have a small number of instance variables. Each of th emethods of a class should manipulate one or more of those variables. The more variables a method manipulates, the more cohesive that method is to its class. A class in which each variable is used by each method is maximally cohesive. 

In general it is neither advisable or possible to creat esuch maximally cohesive classes. On the other hand, we want coheision to be high. When coheision is high, it means that the methods and varibales of the class are co-dependent andhang together as a logical whole. 

Consider this implementation of a Stack. It's very cohesive. Only `size()` fails to use boht the variables: 

```
var Stack = function() {
    let topOfStack = 0;
    let elements = [];

    function size() {
        return topOfStack;
    }

    function push(element) {
        topOfStack++;
        elements.push(element);
    }

    function pop() {
        if (topOfStack == 0) {
            return;
        }
        element = elements[topOfStack - 1];
        elements.pop(topOfStack);
        return element;
    }
}
```

Keeping funcitons small and parameter lists short an lead to a proliferation of instance variables that are used by a subset of the methods. When this happens, it almost always means there is one other class trying to get out of the larger class. 

### Maintaining cohesion results in many small classes

Breaking large functions into smaller functions causes a proliferation of classes. Consider a large function with many variables declared in it. Let's say you want to extract one small prt of that function into a separate function. However, the code you want to extract uses four of the variables declared in the fucnction. Must you pass all four of those into the function as arguments?

No! If we promote those four variables to instance variables of the class, we can extrac the code without passing any variables at all. It would be *easy* to break the function up into small pieces. 

Unfortunately, this will cause classes to lsoe cohesion since they accumulate more and more variables that exist solely to be shared amongst a few functions. 

But wait! If there are a few functions that want to share certain variable,s doesn't that make them a class in their own right? Of course it does. When classes lose coheision, split them up. 

So breaking a large function into many smaller functions often gives us the opportunity to split several smaller classes out as well. This gives our program a much better organization and more transparent structure. 

Let's use an example 