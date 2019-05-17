---
layout: post
title: 'How to build a Twitter bot using AWS Lambda'
tags: ['AWS', 'Lambda', 'JavaScript', 'Node.js', 'Twitter bot', 'API']
description: ''
---
*Last updated May 17, 2019*

It feels like everyone is talking about [Lambda functions](https://aws.amazon.com/lambda/). Amazon Web Services Lambda allows you to write code and execute it in the cloud without provisioning, maintaining, and paying for a full server instance yourself. 

I wanted to get in on the action. I've managed plenty of virtual private servers over the course of my career. I haven't ever written a Lambda function before, and I was honestly a little fuzzy on what they were. I was pleased to find out how simple, versatile, and useful Lambda is. 

## The Twitter bot 

I spent a little over three years working at a political non-profit, and I think politics should be important to everyone, especially developers. When I do side projects, I try to work on issues that matter to me. 

One of my go-to resources for building civic projects is [Open States](https://openstates.org/). I wanted to integrate their platform with the [Twitter API](https://developer.twitter.com/en/docs.html). It's unfortunate that [Twitter loves Nazis and the revenue they generate](https://boingboing.net/2019/04/25/why-jack-hasnt-banned-nazis.html), because I think Twitter is a really excellent platform. They have a massive userbase and the microblogging format lends itself to interesting constraints that create engaging content. Twitter bots are super interesting to me and I think there's a lot of value to creating them and using this platform for social justice. 

I wanted to create a Twitter bot that reports on activity in the Colorado State Legislature using Open States data. I call my bot [Colorado Openerr](https://twitter.com/openerr_co). You can view the full source code [here](https://github.com/ogdenstudios/openerr). 

## The logic 

Open States scrapes data nightly. So every morning at 6 am Mountain Time, my Lambda function fires and performs the following work: 

1. Check for all Colorado bills with activity since the day before.
2. For each bill with activity, create an object with that bill's identifier, title, latest action, date of last action, and Open States URL. 
3. Construct a tweet with that information and send it to [@openerr_co](https://twitter.com/openerr_co).

That's it! There are a handful of edge cases to handle: 

1. If there are no bills, exit gracefully. 
2. Twitter has a [300 posts per 3 hours rate limit](https://developer.twitter.com/en/docs/basics/rate-limits). If there are over 300 bills with activity, tweet 299 of them and then send out a tweet acknowledging we weren't able to capture all activity, and direct users to the [Open States Colorado State page](https://openstates.org/co/).
3. If a full tweet with the standard information will be over 280 characters, try truncating it by removing certain information. If even that information exceeds 280 characters, send a default Tweet that just lists the bill identifier and acknowledges there was some activity on it. 

## The stack 

I wrote the entire script with [Node.js](https://nodejs.org/en/). If you've never worked with Node before, but have some experience writing JavaScript, I'd highly recommend [Max Ogden's Art of Node](https://github.com/maxogden/art-of-node). I've been writing in Node for a while now and just recently found this resource while searching for documentation. It's everything I wish I had read three years ago. 

The production script only has one dependency, [Twitter for Node.js](https://www.npmjs.com/package/twitter). Other than that, everything is done with core Node modules and ES6 JavaScript. 

I use [Mocha](https://mochajs.org/) for testing.

I use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting the code itself. I set my ESLint config to use [Felix Geisendörfer's Node.js Style Guide](https://github.com/felixge/node-style-guide). My opinion about style guides like this is: **the best style guide is whichever style guide you choose**. As long as you use and enforce styles consistently, the actual details become arbitrary (generally), and you can adapt as idiomatic JavaScript evolves, but rest assured your code is consistent and easy to understand by other people. Style guides offer a good reference point and key for your code - but they don't necessarily make your code *better* (barring some optimizations). 

The project is larger than 10 MB total, including node dependencies, so I use [Amazon S3](https://aws.amazon.com/s3/) to host the `.zip` files. 

Finally, the script executes in the AWS Lambda Node 8.10 environment. 

## The script 

Again, you can view the full source code [here](https://github.com/ogdenstudios/openerr). I'll walk through different pieces of it here. 

### Dependencies and variables 

### The Lambda handler 

### createOpenStatesQuery()

### getIt() 

### createBillObject

### startTweeting() 

### createTweetText()

### tweet()

### Testing exports 

## Conclusion 

If you like my project or the work Open States does, the best way to support them is [by giving money to Open States](https://openstates.org/donate/)