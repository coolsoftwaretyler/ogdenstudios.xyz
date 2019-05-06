---
layout: post
title: 'How to build a Twitter bot using AWS Lambda '
tags: ['AWS', 'Lambda', 'JavaScript', 'Node.js', 'Twitter bot', 'API']
description: ''
---
*Last updated May 6, 2019*

Everyone is talking about [lambda functions](https://aws.amazon.com/lambda/). Amazon Web Services lambda allows you to write code and have it execute it the cloud without provisioning, maintaining, and paying for a full server instance yourself. 

I wanted to get in on the action. I've managed plenty of virtual private servers, shared hosting sites, and even bare-metal servers over the course of my career. I haven't ever written a Lambda function before and I honestly was a little fuzzy on what they were before starting this project. I was excited to find out how simple, versatile, and useful Lambda can be. 

## The Twitter bot 

I spent a little over three years working at a political non-profit. Making change and helping other people make change is important to me. Politics should be important to everyone, especially developers. 

One of my go-to resources for building political projects is [Open States](https://openstates.org/). If you like this project or the work they do, the best way to support them is [by giving them money](https://openstates.org/donate/).

Something something twitter platform, twitter loves nazis, etc. 

I wanted to use the Open States API to create a Twitter bot that reports on activity in the Colorado State Legislature. I call my bot [Colorado Openerr](https://twitter.com/openerr_co). You can view the full source code [here](https://github.com/ogdenstudios/openerr). 

## The logic 

Open States usually scrapes data nightly. So every morning at 6am Mountain Time, my Lambda function fires and performs the following work: 

1. Check for all Colorado bills with activity since yesterday.
2. For each bill with activity, create a JavaScript object with that bill's identifier, title, latest action, date of last action, and Open States URL. 
3. Construct a tweet with that information and send it to [@openerr_co](https://twitter.com/openerr_co).

That's it! There are a handful of edge cases to handle: 

1. If there are no bills, we can exit gracefully. 
2. Twitter has a [300 posts per 3 hours rate limit](https://developer.twitter.com/en/docs/basics/rate-limits). If there are over 300 bills with activity, tweet 299 of them and then send out a tweet acknowledging we weren't able to capture all activity, and direct users to the [Open States Colorado State page](https://openstates.org/co/).
3. If a full tweet with the standard information will be over 280 characters, try truncating it by removing certain information. If even that information exceeds 280 characters, send a default Tweet that just lists the bill identifier and acknowledges there was some activity on it. 

## The stack 

I wrote the entire script with [Node.js](https://nodejs.org/en/). If you've never worked with Node before, but have some experience writing JavaScript, I'd highly recommend [Max Ogden's Art of Node](https://github.com/maxogden/art-of-node). I've been writing in Node for a while now and just recently found this resource while searching for some documentation, and it's everything I wish I had read three years ago. 

The production script only has one dependency, [Twitter for Node.js](https://www.npmjs.com/package/twitter). Other than that, everything is done with core Node modules and ES6 JavaScript. 

I use [Mocha](https://mochajs.org/) for testing.

I use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting the code itself. 