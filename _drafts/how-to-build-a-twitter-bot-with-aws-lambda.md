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

I set up the dependencies and variables like so: 

```
var d = new Date();
d.setDate(d.getDate() - 1);
var date = d.toISOString().split('T')[0];
var env = 'test';
var https = require('https');
var openStatesQuery = createOpenStatesQuery(date);
var secrets = require('./secrets.json');
var Twitter = require('twitter');
var twitter = new Twitter({
  consumer_key: secrets.api_key,
  consumer_secret: secrets.api_secret_key,
  access_token_key: secrets.access_token,
  access_token_secret: secrets.access_token_secret,
});
var url = 'openstates.org';
```

- I set `date` to the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format date of **yesterday**. I'll use this to grab bill activity from the previous day. 
- `env` is set to `test` by default. 
- I load in the [Node.js https module](https://nodejs.org/api/https.html) as `https`. 
- I use my `createOpenStatesQuery()` function to create my initial openStatesQuery, using the `date` variable. 
- I load in my sensitive information as `secrets`. The `secrets.json` file is never checked into version control. 
- I load the [Twitter for Node.js](https://www.npmjs.com/package/twitter) npm package as `Twitter`.
- I set the `twitter` variable (note the case difference) to a new instance of `Twitter`, using my `secrets`. 
- I set the `url` to `openstates.org` for convenience. 

### The Lambda handler 

In order for AWS Lambda to invoke the function, we need to provide a [handler](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html). My handler looks like this: 

```
exports.handler = function (event, context, callback) {
  console.log(event);
  console.log(context);
  env = 'production';
  getIt(openStatesQuery, []);
  callback(null, 'Success from lambda');
};
```

The parameters are standard from AWS. I set up a few `console.log()` statements for my own debugging and curiosity (I wanted to see what the `event` and `context` parameters looked like). I set `env` to `production`, which will come into play later on. As I wrote before, `env` is set to `test` by default. Overwriting it only happens when someone calls the `handler` export, which is what's happening with AWS Lambda. 

After that, I run the `getit()` function. I'll explain it in more detail later on, but that's all this script really does! One function call and it executes my logic. 

After getit(), I run a callback. I don't have much meaningful to provide to it, so I add another debugging statement `Success from lambda`, again more as a curiosity for myself than a functional bit. I think the `callback` parameter can do more interesting work for complex Lambda functions, but it's not necessary for Openerr. 

### createOpenStatesQuery()

The first function that fires is `createOpenStatesQuery()`. In the dependencies and variables step, I set `var openStatesQuery = createOpenStatesQuery(date);`. This creates the initial query based on the `date` variable, which represents the previous day. 

`createOpenStatesQuery()` looks like: 
```
function createOpenStatesQuery(date, cursor = null) {
  var query = `
        {
            search: bills(first:100, after:"${
    cursor ? cursor : ''
    }", jurisdiction: "Colorado", actionSince: "${date}") {
                edges {
                    node {
                        id,
                        title,
                        identifier,
                        openstatesUrl,
                        actions {
                            description
                            date
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    endCursor
                    startCursor
                }
            }
        }
    `;
  return encodeURIComponent(query);
}
```

This mostly exists as a convenience for me. I played around with the [Open States GraphQL editor](https://openstates.org/graphql) to determine the correct query to return the results I care about. Keeping it as a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) allows me to edit it in the code as I might edit it in the web application from Open States. It helps keep one-to-one parity with the request I care about/the request I send. In earlier iterations, I tried writing it as a string with no whitespace, but I found it difficult to match expressions, and difficult to read. 

Aside from the template literal I hardcode, the function takes a `date` parameter which it uses as the argument for `actionSince` in the Open States GraphQL query. 

It has an optional parameter for `cursor`. If `cursor` isn't provided, it's set to `null`. The GraphQL query will pass an empty string just fine. The cursor can be provided to allow us to page through the results if there are many. We'll talk more about that logic in the next section.

This function interpolates the `date` and `cursor` values into the template literal, then runs [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) on the result. The function then returns a string we can send as part of a GET request later on. 

### getIt() 

When Lambda calls our handler, we run `getIt(openStatesQuery, []);`. This passes in the initial query created by `createOpenStatesQuery()` and an empty array. 

Inside `getIt()` we do the following: 

#### Set the options for the request 

The `https` module allows us to pass in options, which we define as such: 

```
var options = {
    headers: {'X-API-KEY': secrets.openStatesKey},
    host: url,
    path: `/graphql/?query=${query}`,
};
```

#### Make the request 

#### Handle chunked data 

#### Handle the end of the request 

#### Handle errors

### createBillObject

### startTweeting() 

### createTweetText()

### tweet()

### Testing exports

### Packaging up the script 

### Uploading to Lambda 

### Setting up CloudWatch

### Other Lambda configuration

## Conclusion 

If you like my project or the work Open States does, the best way to support them is [by giving money to Open States](https://openstates.org/donate/)