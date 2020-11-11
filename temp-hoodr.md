---
layout: post
title: Heuristics of Object-Oriented Design in Ruby
tags: ['post']
description: A distillation of Sandi Metz's Pratical Object-Oriented Design (POODR), useful for quick refactoring and long term coding improvement. 
date: 2020-11-10
---

Any Rubyist should read and study [Practical Object Oriented Design, An Agile Primer Using Ruby (POODR)](https://www.poodr.com/), by Sandi Metz. 

Personally, I've read through the book three times. Each time I read it, I find new and useful insights that improve my work as a Ruby programmer, and as a software engineer in general. POODR walks through fundamental object-oriented concepts and pairs them with practical examples in Ruby. Over the course of the book, Metz builds and refactors a sample application that demonstrates these principles.

One challenge with these kinds of programming books is that it's hard to keep all of the lessons in your head when you sit down to apply them in your own work. And surely, that is not the intention of Metz's book. She encourages you to come back to it piece by piece as you work and find applications in your day-to-day. Even that can prove to be a challenge. You have to know when it's appropriate to do this kind of reflection, which section of the books to refer to, and you still have to keep the book's context in your head as you're working on the problem at hand.

I'm a big checklist kind of guy, and I wanted to put more effort into applying POODR's lessons to my day to day work. So I put together a checklist I call *Heuristics of Object-Oriented Design in Ruby*. Here's how I use it: 

1. I do my work and solve the challenge at hand
2. I take a breakand step away from the code I've written
3. Before making a pull request, I go over my changes and run through this checklist, evaluating my code against each item.

It's not always clean and simple, and not all of the checklist always applies, hence "heuristics". But overall, this systematic review of my Ruby code has given me a clearer understanding of the lessons Metz teaches in POODR. I hope it will be of similar value to anyone who reads this.

## The Heuristics 

I start with what feels simplest, and progress in complexity towards the end.

### Code smells

These items can be identified directly in code, in any Ruby file, and are often the most straightforward to resolve. At the very least, they may prompt you to consider another item further in the list.

* Use named args to remove order dependencies. 48
* Hide all instance variables behind methods. 24
* Isolate new instances of objects behind methods. 44
* If an object must send messages to any object other than `self`, isolate it in a method. 45
* Hide complex data structures behind methods, or better yet, behind objects. 28
* Follow the Law of Demeter. 81
* Every public method of an object should be tested 227.
* Every object should be testable in isolation. 230

### Code organization 

These items are harder to identify in code alone, but they point to opportunities to improve the structure of your overall application. 

* Objects should not know: the name of another class, the name of a method defined in another class, the arguments of a method in another class, orthe order of arguments to a method in another class. 39
* Use simple dependency injection by passing collaborating objects as arguments to methods. 43
* Use duck typing when you see: case statements that switch on `class`, or methods that ask `is_a?` or `kind_of?` 118
* Use inheritance when you are conditionally sending messages to `self` based on some attribute of `self`. 134
* Any super class that uses the template method pattern must implement every message it sends, even if the implementation is just an error about not being implemented. 151
* Promote code up to superclasses rather than down to subclasses. If you're creating inheritance, build out one new abstract class and move up what you need instead of adapting an existing class to be the superclass. 143
* Write methods to be either public or private. This will give you a well defined public interface. 64

### Abstraction considerations 

These items are concerned with the way in which your code models the problem domain at hand. They are more subjective, but I still believe you can answer yes/no to any of these bullet points and find some actionable refactoring based on your assessment. 

* Every class should have a one sentence description, with no conjunctions. 22
* Rephrase your class methods as questions to the class. Every question should make sense and feel related to the purpose of the class. 22
* Enforce good dependency direction. Never depend on anything that will change more than you. 55
* Depend on abstractions before depending on concrete classes. 57
* If you have a problem that can be solved by composition, default to composition. Only use inheritance when the benefits of using it are clear. 209
* Create shallow hierarchies. 183
* Messages should ask for "what" instead of dictating "how". 70
