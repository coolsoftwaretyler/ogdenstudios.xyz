---
layout: post
title: How do I loop over an HTML Collection in JavaScript?
tags: ["javascript", 'post']
description: 'Loop over HTML collections correctly'
---
[Source](https://stackoverflow.com/questions/22754315/for-loop-for-htmlcollection-elements)

Recent version of modern browsers support for/of iteration on DOM lists. 

```
var list = document.getElementsByClassName("events");
for (let item of list) {
    console.log(item);
}
```

Older browsers (like IE) need 

```
var list= document.getElementsByClassName("events");
for (var i = 0; i < list.length; i++) {
    console.log(list[i]);
}
```