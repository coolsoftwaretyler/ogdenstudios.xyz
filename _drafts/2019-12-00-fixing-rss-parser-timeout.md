---
layout: post
title: ""
tags: []
description: ""
---

## Background

## Submit an issue 

[issue](https://github.com/rbren/rss-parser/issues/145)

## Get started working

* [Fork the repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
* [Clone the forked repo to my computer](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
* Open up the project
* Create a topic branch. I'll do: 

```
git checkout -b fix-145
```

To reference issue #145 in the original repo. 

Run 

```
npm install
```

To install the project dependencies. 

I check that the test suite is passing out the gate with: 

```
npm test
```

Then I read the contribution portion of the project README. They direct contributors to write test cases for PRs. So I'm going to start in the test directory. As it happens, the timeout function is passing the test, but it looks like they're using `http://localhost` as the domain for that test case. I know timeout doesn't work with some specific URLs, like `http://rss.leg.wa.gov/BillSummary/Home/Rss/2334/2017/House`

So the first thing that strikes me is I should swap out that url in the test case and see what happens. 

Here's something. I've immediately gotten some feedback from that. When I run `npm test` now I see: 

```
3) Parser
       should respect timeout option:
     Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/mnt/d/dev/rss-parser/test/parser.js)
```

And all other tests are passing. 

Robert, the maintainer of rss-parser showed me where the timeout gets set. They're passing the option to the HTTP node library. 

I wasn't sure where to go next, but I know the timeout is getting set here: 

```
req.setTimeout(this.options.timeout, () => {
    return reject(new Error("Request timed out after " + this.options.timeout + "ms"));
});
```

So I checked the Node [reference for setTimeout in the HTTP module](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback) and noticed something in the history notes: 

```
Consistently set socket timeout only when the socket connects.
```

So I'm wondering if my ECONNREFUSED error **stops the socket from connecting**. Which means we might need to catch that error elsewhere. I searched for "ECONNREFUSED node http" and found (a StackOverflow post)[https://stackoverflow.com/questions/8381198/catching-econnrefused-in-node-js-with-http-request] that might help. 