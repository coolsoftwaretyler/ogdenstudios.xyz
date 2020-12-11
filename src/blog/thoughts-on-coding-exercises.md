---
layout: post
title: Thoughts on Coding Exercises
tags: ['post']
description: A curated list of coding exercise resources, and some context around what they are good for and not so good for. 
date: 2020-12-11
---

I originally compiled this list for my mentee at [Emergent Works](https://www.emergentworks.org/), but I thought other people might benefit from it, so I've turned my email to my mentee into a blog post about coding exercises. 

There is an abundance of coding exercise resources out there. I think the reasonable assumption off the bat is that if you're a beginner and complete these exercises, you'll be good at writing software.

Unfortunately, I don't think there's a strong correlation between those two things. That's not to say there's *no* correlation, or that there aren't good reasons to engage with those exercises. I just want to help set some expectations with context I wish I had been given. 

I think coding exercise websites fall into 3 major categories: 

1. Syntax muscle memory
2. Abstract problem solving
3. Gatekeeping aptitude tests

## Syntax muscle memory

Some coding exercises are designed specifically to teach you the syntax of programming languages. It's a reasonable goal on the surface, but I personally don't think it's a useful approach to learning a programming language. 

The challenge is that we call these tools *languages*. In natural language, we expect conversational or fluent speakers to be able to carry on conversations without a dictionary or reference material. But when it comes to programming languages: **the most proficient programmers frequently use reference material to enhance their ability in real time**.

Websites that work on syntax and semantics present some goal that feels like memorization. I think it's an effort that has severely diminishing returns. 

It's good to get used to a new syntax, and to see examples of code and understand the art of the possible. But at a certain point, you can only memorize so much of a programming language. 


Exterting time and effort to get 100% coverage of an entire language's syntax might be better served if you were to spend that time learning a handful of useful commands and applying them to real world problems. 

Websites that fall into this category that come to mind: 

1. [Codecademy](https://www.codecademy.com/)
1. [Codewars](https://www.codewars.com/)

## Abstract Problem Solving

There's a strong relationship between mathematics, computer science, and software engineering. In a different world, we might regard these fields as part of a larger, interdisciplinary whole. Unfortunately, we don't in Western society. 

That said, there are a variety of "classic" logic/mathematics/computer programming problems that exist and are used primarily in computer science curriculum. For people that haven't had a formal education in computer science, exposure to these problems can enhance their understanding and context for the field. 

Websites that fall into this category: 

1. [Project Euler](https://projecteuler.net/about)
1. [Rosalind](http://rosalind.info/problems/locations/)

## Gatekeeping Aptitude Tests 

Software hiring is broken. It's broken because of Facebook, Apple, Amazon, Netflix, and Google (FAANG). 

These mega corporations (also referred to as "Big N", since the pantheon tends to shift over time) have a handful of unique problems to solve in hiring: 

1. They tend to work on entirely novel digital scaling problems. No companies before them have had their reach. Their challenges are often unsolved problems. 
1. Their extremely lucrative compensation structures attract more applicants than any other company would likely receive for job openings. 
1. When people make mistakes at their scale, the implications are far reaching. The stakes are high to find the right candidate for any job opening. 

FAANG and Big N companies have a very obtuse solution to these problems: they create gatekeeping interview processes that heavily prioritize false negatives, in the pursuit of avoiding a single false positive.

To put it another way: they would rather turn down 100 great employees before hiring even 1 mediocre one. 

But not every company can be a FAANG or a Big N. In fact, by their nature, most companies *are not*.

Unfortunately, every other company that wants to hire someone to write code (regardless of the type of code or type of business challenges they have) has tried to emulate these gatekeeping processes. There are a variety of websites and training courses out there designed to teach you *how to pass a gatekeeping FAANG interview*. 

Despite my extreme distaste for the state of software hiring, I think there is value in these sites. 

The first benefit is that they provide a clear path that will get you through many interviewing rounds with many companies. A person could study these sites for months and be ready to pass almost any tech interview. It may not prepare them for the *job*, per se, but it at least provides a clear path through the interviewing process. 

Second, these gatekeeping processes have weaponized data structures and algorithms against career changers. Most of the problems on these sites are variations on [abstract problem solving](#abstract-problem-solving) problems and classic computer science material, as mentioned before. Studying these problem sets will help new folks get more computer science context and also provide practical application for them (how to use data structures and algorithms to get a job, for example). 

Third, I think the problems are a good opportunity to practice both abstract problem solving, and to learn new [programming language syntax](#syntax-muscle-memory), another category mentioned before. One of the best ways to improve your muscle memory on a programming language's syntax is to find a practical application for it. These problems give you prompts that can truly be challenging, with real-world solutions and theory behind them. By coding them up in a new programming language, your mental model of the problem space and language itself will rapidly build up. 

Fortunately, I think many companies are beginning to realize these gatekeeping processes are [preventing them from hiring valuable contributors](https://www.reddit.com/r/programming/comments/39d0u1/google_90_of_our_engineers_use_the_software_you/). The tide seems to be changing slightly. So perhaps we can begin to look at these exercises more for their value than for their deleterious effect on the software engineering industry. 

Putting aside my qualms with the implications of these exercises, I think they provide the most efficient way to "get better" at software, at least as far as pre-made exercises go. Again, you'll continue to find diminishing returns here. At a certain point, knowing the syntax of a language, understanding computer science theory, and getting through job interviews will only get you so far. The practical experience and craftsmanship of software engineering is an experiential kind of learning. 

To get started with these exercises as a complete beginner, I recommend this order of operations: 

1. Read [Cracking the Coding Interview](https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850) to get context and useful tips on how to approach the problem sets.
1. Join [LeetCode](https://leetcode.com/) and work through interesting courses, paths, and problem sets that line up with your interests. 
1. Alternatively, [HackerRank](https://www.hackerrank.com/) provides a similar set of functionality. I find the LeetCode problems easier to work with and understand than HackerRank, but I think HackerRank integrates more tightly with hiring processes. 