---
layout: post
title: How do I just get the file name from a URL or file path?
tags: ["regex"]
description: "A regex for getting just a file name, nothing more or less"
---

Sometimes you just need the name of a file, and its buried under any number of URL or local file paths. Here's a regular expression that will get you that file name (in Ruby, assuming `url` is the long form name).

`filename = /([^\/]+)(?=\.\w+$)/.match(url)`