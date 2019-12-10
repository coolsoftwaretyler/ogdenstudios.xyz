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

I'm going to just copy the error part, because I think that's what we want to hone in on here: 

```
req.on('socket', function(socket) {
        socket.on('error', function (err) { // this catches ECONNREFUSED events
            req.abort();    // kill socket
        });
});
```

Hmm, that didn't quite work. I'm getting the same fails in the tests as I was before. 

So what if the `req.abort()` call isn't working? Or what if I have the wrong event? 

I looked up the [socket documentation](https://nodejs.org/api/net.html) to see what events I can listen to on the socket. It looks like I'm getting the `lookup` event, but not the `connect` event. I can't access the `error` on the lookup event (or can i)

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


I think the issue is that ECONNREFUSED doesn't throw an error where we can catch it. But we care about how long it takes to get it, so setting a timeout like this may be the only way to check if it's happened within time. 

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

The maintainer got back to me pretty quickly. I had included much of this information with the PR and he was happy with the detailed writeup. He suggested we skip the `socket` event and `req.setTimeout()` entirely and wrap the whole call in a timeout. That's pretty much what I was trying to get at but couldn't quite express. It was super helpful to have someone else look at it. 

So I removed the socket call, removed the request timeout, and added the suggested code. 

I removed the additional test case and ran `npm test`. everything was passing and looked good. So I made the commit and pushed it back up for review. 

Finally, I swapped out my specific url to `http://rss.leg.wa.gov/BillSummary/Home/Rss/2334/2017/House` locally, and all the tests started passing. 

I pushed the changes back up to my branch and they got added to the PR. You can [read my PR and the back and forth here](https://github.com/rbren/rss-parser/pull/146).