---
layout: post
title:  "HPE_INVALID_HEADER_TOKEN in Node 12+"
tags: [eleventy, plugin]
description: "Node 12 changed http-parser to be more strict about header values, and it broke my application."
---

So I've got a node app that scrapes over 5,000 RSS feeds. Originally I built it using Node 12. But every time I ran it, over 1,000 of my 5,000 RSS feeds were coming back with errors. 

I expected to have some failed feeds, but over 20% is higher than anticipated and I assumed I had done something incorrectly. 

As I dug into the logs, I found one common error across 50% of the failed feeds. My requests were returning with this error: 

```
HPE_INVALID_HEADER_TOKEN
```

But the weird thing was when I visited those feeds in a browser, I didn't have a single problem. 

So I searched for: "HPE_INVALID_HEADER_TOKEN node" and found [this open issue](https://github.com/nodejs/node/issues/27711). 

[incapsula](https://github.com/kazuho/p5-http-parser-xs/issues/10)