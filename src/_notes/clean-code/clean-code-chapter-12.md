---
layout: post
title: Clean Code Chapter 12
---

# Emergence

## Getting Clean via Emergent Design

Many people feel Kent Beck's four rules of *Simple Design* are of significant help in creating well-designed software. They help you create good designs as you work, make it easier to apply principles like SRP nad DIP. These rules facilitate the *emergence* of good design. 

According to Kent, a design is simple if it follows these rules: 

* Runs all the tests
* Contains no duplication 
* Expresses the intent of the programmer
* Minimizes the number of classes and methods 

These rules are given in order of importance. 

## Rule #1: Runs all the tests 

A design must produce a system that acts as intended. It migh thave perfect design on paper, but if there is no simple way to verify the system actually works as intended, all the paper effort is questionable. 

A system that is comprehensively tested and passes its tests all the time is a testable system. It's an obvious statment, but an important one. A system that cannot be verified should never be deployed. 

Making our systems testable pushes us toward a design where clases are small and single purpose. It's easier to write test classes that conform to the SRP. The more tests we write, the more we continue to push toward things that are simpler to test. Making sure our system is fully testable helps create better designs. 

Tight coupling makes it difficult to writ etests. So the more tests we write, the more we use principles like DIP and tools like dependency injection, interfaces, and abstraction to minimize coupling. Our designs improve even more. 

Remarkably, following a simple and obvious rule that says we have to have tests and run them continuously impacts our system's adherance to the primary OO goals of low-coupling and high cohesion. Writing tests leads to better design. 

## Rules #2-4 Refactoring

Once we have tests, we are empowered to keep our code and classes clean. We can do this by incrementally refactoring. For each few lines of code we add, pause and reflect on the new design. Did we degrade it? If so, clean it up and run the tests to make sure it works. Having these tests eliminates the fear we will break it with the change. 

During refactoring, we can increase cohesion, decrease coupling, separate concerns, modularize system concerns, shrink function and classes, choose better names, so on. This is also where we apply the final three rules: eliminate duplication, ensure expressiveness, and minimize the number of classes and methods. 

### No duplication 

Duplication is the primary enemy of of a well-designed system. It represents additional work, additional risk, and additional unnecessary complexity. Duplication manifests in many forms. Lines of code that look exactly alike are, of course, duplication. Lines of code that are similarcan be massaged to look even more alike so they're easily refactorable. But duplication can exist in other forms such as duplication of implementation. 

Consider two methods in a collection class: 

```
size() {} 
isEmpty {} 
```

We could have separate implementations for each method. The `isEmpty` method could track a boolean, while `size` could track a counter. Or we can eliminate this duplication by tying `isEmpty` to the definition of `size`: 

```
isEmpty() {
    return 0 === size();
}
```

Creating a clean system requires the will to eliminate duplication, even in just a few lines of code. Consider: 

```
function scaleToOneDimension(desiredDimension, imageDimension) {
    if (Math.abs(desiredDimension = imageDimension) < errorThreshold>) {
        return;
    }
    scalingFactor = desiredDimension / imageDimension;
    scalingFactor = (Math.floor(scalingFactor * 100) * 0.01);
    newImage = ImageUtilities.getScaledImage(image, scalingFactor, scalingFactor);
    image.dispose();
    System.gc();
    image = newImage;
}

function rotate(degrees) {
    newImage = ImageUtilities.getRotatedImage(image, degrees);
    image.dispose();
    System.gc();
    image = newImage;
}
```

To keep this system clean, we should eliminate the small amount of duplication between the two methods. 

```
function scaleToOneDimension(desiredDimension, imageDimension) {
    if (Math.abs(desiredDimension = imageDimension) < errorThreshold>) {
        return;
    }
    scalingFactor = desiredDimension / imageDimension;
    scalingFactor = (Math.floor(scalingFactor * 100) * 0.01);
    replaceImage(ImageUtilities.getScaledImage(image, scalingFactor, scalingFactor));
}

function rotate(degrees) {
    replaceImage(ImageUtilities.getRotatedImage(image, degrees)));
}

function replaceImage(newImage) {
    image.dispose();
    System.gc();
    image = newImage;
}
```

As we extract commonality at this tiny level, we start to recognize violations of the SRP. So we migh tmove a newly extracted method to another class. That elevates its visibility. Someone else on the eam may recognize the opportunity to further abstract the new method and resue it in a different context. This "reuse in the small" can cause system complexity to shrink dramatically. Understanding how to achieve reuse in the small is essential to achieving reuse in the large. 

### Expressive 

Most of us have worked on convoluted code. Many of us have produced some ourselves. It's easy to write code we understand because at the time we write it, we're deep in the understanding of the problem we're trying to solve. Other maintainers won't have that deep kind of understanding. 

The majority of the cost of a software project is in long-term maintenance. In order to minimize the potential for defects, it's critical for us to be able to understand what the system does. As systems become more complex, they take more and more time for a developer to understand. There is an ever greater opportunity for a misunderstanding. Code should clearly express the intent of its author. The clearer the author can make the code, the less time others will have to spend understanding it. This will reduce defects and shrink the cost of maintenance. 

You can express yourself by choosing good names. We want to be able to hear a class or function name and not be surprised when we discover its responsibilities. 

You can also express yourself by keeping your classes and functions small. Small classes andfunctions are easy to name, easy to write, and easy to understand. 

You can also express yourself by using standard nomenclature. Design patterns, for example, are largely about communication and expressiveness. By using standard pattern names, in the names of classes that implement those patterns, you can succinctly describe your design to other developers.

Well-written unit tests are also expressive. A primary goal of the tests is to act as documentation by example. Someone rading our tests should be able to get a quick understanding of what a class is all about. 

But the most important way to be expressive is to *try*. All too often we get our code working and move on to the next problem without giving sufficient thought to making that code easy for the next person to read. Remember, the most likely next person to read the code will be you. 

So take pride in your workmanship. Spend some time with each of your functions and classes. Choose better names, split large functions into smaller functions, and generally take care of what you've created. Care is a precious resource. 

### Minimal classes and methods 

Even concepts as fundamental as elimination of duplication, code expressiveness, and SRP can be taken too far. In an effort to make oru classes and methods small, we may create too many tiny classes and methods. So this rule suggests we also keep our function and class *counts* low. 

High class and method counts are sometimes the result of pointless dogmatism. Consider, for example, a coding standard that insists on creating an interface for each and every class. Or consider developers who insist that fields and behavior must always be separated into data classes and behavior classes. Such dogma should be resisted and amore pragmatic approach adopted. 

Our goal is to keep our overall system small while we keep our functions and classes small. Remember, however, this rule is the lowest priority of the four. So while it's important, it's more important to have tests, eliminate duplication, and express yourself. 

## Conclusion 

No set of practices can replace experience. On the other hand, the practices described here are a crystallized from of decades of experience of the authors. Following simple design in process can and does encourage and enable developers to adhere to good principles and patterns that take years to learn. 
