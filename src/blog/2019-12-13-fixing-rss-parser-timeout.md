---
layout: post
title: "An Open Source Contribution to the rss-parser node package"
tags: []
description: "I had a strange issue with the rss-parser package and its timeout function. It led me to creating a successful pull request in the project."
---

## Background

I'm working on a project for my girlfriend Sarah to help her with her journalism research. She subscribes to over 5,000 RSS feeds and searches them for specific keywords. When she finds those keywords, she adds the individual stories to a database I built for her a while ago. 

Currently she experiences two bottlenecks: 

1. Updating 5,000+ RSS feeds takes a long time in her RSS reader.
2. Once the feeds are updated, checking them for her keywords takes hours of time and tedious work. 

So I built some AWS Lambda functions to try and make her life easier. These functions check her RSS feeds for her, run the keyword search, and upload the stories to her database so she can do some manual processing and analysis. 

I wrote my lambdas in Node, and use the [rss-parser](https://www.npmjs.com/package/rss-parser) package for convenience. It works like a charm for most feeds, but I encountered a strange edge case. 

Since Sarah subscribes to *so many* feeds, more than I think the average user of rss-parser, she has an inordinate amount of *invalid feeds*. More specifically, many of her feeds are discontinued or out of service, and respond with `ECONNREFUSED` errors. 

These errors *weren't properly timing out, even with rss-parser's timeout function**. It was causing my scripts to hang and hit the lambda timeouts, spiking my runtimes. It was also a difficult bug to diagnose, since ECONNREFUSED wasn't tripping the timeout error in rss-parser. 

## Submit an issue 

So I submitted an [issue](https://github.com/rbren/rss-parser/issues/145) to the rss-parser repository. The maintainer, Robert, told me they would accept a PR about it. I hadn't really considered making the fix, myself. But I had some free time and I haven't done a lot of open source contributions to affect public codebases and how they work. I figured I'd learn a lot, and I sure did.

I've done a few open source PRs to fix documentation, typos, and smaller things. And we use GitHub at work, so I was comfortable with the process. Here's what I did!

## Set up the GitHub workflow

* [First, I forked the repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo).
* [Then, I cloned the forked repo to my computer](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).
* Then I created a topic branch that referenced the issue:

```
git checkout -b fix-145
```

## Initialized the project locally.

I started by installing the project dependencies with: 

```
npm install
```

And before making any changes, I triple-checked that the test suite was passing. I ran:

```
npm test
```

Everything's passing! A good baseline to get started from. 

## Double checked the contribution guidelines 

I re-read the contribution guidelines in the project README. They ask contributors to write test cases for every pull request. 

Seems reasonable, and it's also a great place to start working. I began by opening up the test directory.

The timeout function is passing the test, but when I read the actual test case, it uses `http://localhost` as the domain after starting a server. So the `ECONNREFUSED` error isn't going to happen. 

To make this test fail, I'm going to swap out a specific URL I know is sending `ECONNREFUSED`. I swapped in this broken feed: `http://rss.leg.wa.gov/BillSummary/Home/Rss/2334/2017/House`

As soon as I made that change, I got some errors in the test suite. When I ran `npm test`, I received:

```
1) Parser
should respect timeout option:
Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/mnt/d/dev/rss-parser/test/parser.js)
```

I wasn't sure where to go next, but I know the timeout is getting set on the [HTTP node library](https://nodejs.org/api/http.html): 

```
req.setTimeout(this.options.timeout, () => {
    return reject(new Error("Request timed out after " + this.options.timeout + "ms"));
});
```

So I checked the Node [reference for setTimeout in the HTTP module](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback) and noticed something in the history notes: 

```
Consistently set socket timeout only when the socket connects.
```

So I'm wondering if the ECONNREFUSED error **stops the socket from connecting**. Which means it might need to catch that error elsewhere. I searched for "ECONNREFUSED node http" and found (a StackOverflow post)[https://stackoverflow.com/questions/8381198/catching-econnrefused-in-node-js-with-http-request] that might help. 

This is a piece of code that helped me hone in on it: 

```
msg.on('socket', function(socket) { 
        socket.setTimeout(2000, function () {   // set short timeout so discovery fails fast
            var e = new Error ('Timeout connecting to ' + queryObj.ip));
            e.name = 'Timeout';
            badNews(e);
            msg.abort();    // kill socket
        });
        socket.on('error', function (err) { // this catches ECONNREFUSED events
            badNews(err);
            msg.abort();    // kill socket
        });
    }); // handle connection events and errors
```

In the rss-parser library, I can do that like this: 

```
req.on('socket', function(socket) {
    // Do things
});
```

To see if that works, I dropped a `console.log(socket);` in the `socket` callback, and got a ton of output. I think I'm on to something here. 

I'm going to just copy the error part, because I think that's really where the issue is. 

```
req.on('socket', function(socket) {
  socket.on('error', function (err) { // this catches ECONNREFUSED events
    req.abort();    // kill socket
  });
});
```

Hmm, that didn't quite work. The test suite still failed the same way.

So what if the `req.abort()` call isn't working? Or what if I have the wrong event? 

I looked up the [socket documentation](https://nodejs.org/api/net.html) to see what events I can listen to on the socket. It looks like I'm getting the `lookup` event, but not the `connect` event.

So here's my fix: 

```
// Need to get the timeout option but it's stuck on this 
let socketTimout = this.options.timeout;
req.on('socket', function(socket) {
  setTimeout(() => {
    if (socket.connecting) {
      return reject(new Error("Request timed out after " + socketTimout + "ms"));
    }
  }, socketTimout)
})
```


I think the issue is that `ECONNREFUSED` doesn't throw an error where we can catch it. But we care about how long it takes to get it, so setting a timeout like this may be the only way to check if it's happened within time. 

In order ot test it, I wrote this test: 

```
it('should respect timeout option if the socket does not connect', function(done) {
  var server = HTTP.createServer(function(req, res) {});
  server.listen(function() {
    var port = server.address().port;
    var url = 'http://localhost:80';
    var parser = new Parser({timeout: 1});
    parser.parseURL(url, function(err, parsed) {
      Expect(err).to.not.equal(null);
      Expect(err.message).to.equal("Request timed out after 1ms. The connection may have been refused.");
      done();
    });
  });
});
```

I pushed this work up in a PR. One of the tests was failing, I wasn't quite mocking the ECONNREFUSED error correctly. 

## Code review 

Robert got back to me pretty quickly. They suggested we skip the `socket` event and `req.setTimeout()` entirely and wrap the whole call in a timeout. That made a lot of sense, and definitley solved some of my uneasiness about the test case being brittle, and about writing a custom timeout at the socket level. My initial solution definitely felt like a hack, and this seemed much more idiomatic.

So I removed the socket call, removed the request timeout, and added the suggested code. 

I removed the additional test case and ran `npm test`. everything was passing and looked good. So I made the commit and pushed it back up for review. 

Finally, I swapped out my specific url to `http://rss.leg.wa.gov/BillSummary/Home/Rss/2334/2017/House` locally, and all the tests started passing. 

## Submitting the final PR

I pushed the changes back up to my branch and they got added to the PR. You can [read my PR and the back and forth here](https://github.com/rbren/rss-parser/pull/146). It was merged into master, and the next release will fix my errors. While I wait for that release, I can use my fix by adding the [Github branch as dependency in package.json](https://medium.com/@jonchurch/use-github-branch-as-dependency-in-package-json-5eb609c81f1a).