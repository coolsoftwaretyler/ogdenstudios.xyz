---
layout: post
title: Heuristics of Object-Oriented Design in Ruby
tags: ['post']
description: A distillation of Sandi Metz's Pratical Object-Oriented Design (POODR), useful for quick refactoring and long term coding improvement. 
date: 2020-11-10
---

Any Rubyist should read and study [Practical Object Oriented Design, An Agile Primer Using Ruby (POODR)](https://www.poodr.com/), by Sandi Metz. 

Personally, I've read through the book three times. Each time I read it, I find new insights that improve my work as a Ruby programmer, and as a software engineer in general. POODR walks through fundamental object-oriented concepts and pairs them with practical examples in Ruby. Over the course of the book, Metz builds and refactors a sample program that demonstrates these principles.

Despite the book's clarity and practicality (it's a short, to-the-point read), it's hard to keep all of the lessons in your head when you sit down to apply them in your own work. To help myself accomplish that very task, I put together a checklist I call *Heuristics of Object-Oriented Design in Ruby*. Here's how I use it: 

1. I do my work and solve the challenge at hand
2. I take a break, and step away from the code I've written
3. Before making a pull request, I go over my changes and run through this checklist, evaluating my code against each item.

It's not always clean and simple, and not all of the checklist always applies, hence "heuristics". But overall, this systematic review of my Ruby code has given me a more concrete understanding of the lessons contained in POODR. I hope it will be of similar value to you.

## The Heuristics 

Starting with (what I consider) the simplest items, work you way towards the more complex and philosophical line items.

### Code smells

These items can be identified in any Ruby file. They are often the most straightforward to resolve. At the very least, these items may prompt you to consult with an item further down in the list.

* Use named args to remove order dependencies. 48
* Hide all instance variables behind methods. 24
* Isolate new instances of objects behind methods. 44
* If an object must send messages to any object other than `self`, isolate sending that message in one single method. 45
* Hide complex data structures behind methods, or better yet, behind objects. 28
* Follow the Law of Demeter. 81
* Every public method of an object should be tested 227.
* Every object should be testable in isolation. 230

### Code organization 

These items are harder to identify in code alone, but looking for them will help you find opportunities to improve the structure of your program holistically. 

* Objects should not know: the name of another class, the name of a method defined in another class, the arguments of a method in another class, or the order of arguments to a method in another class. 39
* Use simple dependency injection by passing collaborating objects as arguments to methods. 43
* Use duck typing when you see: case statements that switch on `class`, or methods that ask `is_a?` or `kind_of?` 118
* Use inheritance when you are conditionally sending messages to `self` based on some attribute of `self`. 134
* Any super class that uses the template method pattern must implement every message it sends, even if the implementation is just an error about not being implemented. 151
* Promote code up to superclasses rather than down to subclasses. If you're creating inheritance, build out one new abstract class and move up what you need instead of adapting an existing class to be the superclass. 143
* Use the `private` keyword to create intentionally designed public interfaces. 64

### Abstraction considerations 

These items are concerned with the way in which your code models the problem domain at hand. They are more subjective, but remain useful even in quick code reviews. 

* Every class should have a one sentence description, no conjunctions allowed. 22
* If you rephrase your class methods as questions to the object, each question should make sense; it should be related to the purpose of the class. 22
* Messages should ask for "what" instead of dictating "how". 70
* Enforce good dependency direction. Never depend on anything that will change more than you. 55
* Depend on abstractions before depending on concrete classes. 57
* If you have a problem that can be solved by composition, default to composition. Only use inheritance when the benefits of using it are clear. 209
* Create shallow hierarchies. 183
