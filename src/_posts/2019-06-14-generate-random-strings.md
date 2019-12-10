---
layout: post
title: How do I get a random string in JavaScript and Ruby?
tags: ["javascript", "ruby"]
description: "A quick tidbit about generating random strings in JS and Ruby"
---

At work we build almost all our sites in Ruby on Rails. As such, I'm writing JavaScript and Ruby day-to-day. Sometimes when we're prototyping and messing around, I just need a random string of characters. I know there are things like the Faker [gem](https://github.com/stympy/faker) and [node package](https://www.npmjs.com/package/faker), but we don't always have those dependencies available in our workflow, and sometimes *I just want the one-liner*.

Here are two StackOverflow answers that helped me out a ton this week. 

## Generate a random string of characters in JavaScript

```
Math.random().toString(36).substring(7);
```

[source](https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript)

## Generate a random string of characters in Ruby 

```
(0...8).map { (65 + rand(26)).chr }.join
```

[source](https://stackoverflow.com/questions/88311/how-to-generate-a-random-string-in-ruby)
