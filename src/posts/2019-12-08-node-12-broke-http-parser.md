---
layout: post
title:  "HPE_INVALID_HEADER_TOKEN in Node 12+"
tags: [eleventy, plugin, 'post']
description: "Node 12 changed http parsing to be more strict about header values, and it broke my application."
date: 2019-12-08
---

So I've got a Node app that scrapes over 5,000 RSS feeds. Originally I built it using Node 12. But every time I ran it, over 1,000 of my 5,000 RSS feeds were coming back with errors. 

I expected to have some failed feeds, but over 20% is higher than anticipated and I assumed I had done something incorrectly. 

As I dug into the logs, I found one common error across 50% of the failed feeds. My requests were returning with this error: 

```
HPE_INVALID_HEADER_TOKEN
```

But the weird thing was when I visited those feeds in a browser, I didn't have a single problem. 

So I searched for: "HPE_INVALID_HEADER_TOKEN node" and found [this open issue](https://github.com/nodejs/node/issues/27711) in Node. 

It looks like Node 12 makes http parsing more sensitive to the headers which is causing this problem. For now, there are two clear options: 

* Roll back to a previous Node (I chose this route and have rolled my application back to Node 10). 
* Run the application with the flag `--http-parser=legacy` (this doesn't work for Node 13+). 

It also looks like [there is an incoming patch to allow insecure headers in Node](https://github.com/nodejs/node/pull/30567). So it's worth it to subscribe to the PR and see if that fixes it. 

## Why are all these headers malformed?

I found some search results mentioning [Incapsula, which is now Imperva](https://www.imperva.com/). According to this [GitHub issue](https://github.com/kazuho/p5-http-parser-xs/issues/10), Imperva uses invalid unicode characters in its headers to prevent [DDoS attacks](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/). And that's fair: if I was feeling malicious, I could set up my RSS scraper to run millions of times against each feed and lock up their system. 

So if you're hitting a bunch of different URLs in a Node script on Node 12+ and you find yourself failing on the headers - consider rolling back or watiing for the configuration option to land in the software. 