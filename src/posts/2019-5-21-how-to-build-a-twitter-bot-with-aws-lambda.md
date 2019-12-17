---
layout: post
title: 'How to build a Twitter bot with AWS Lambda'
tags: ['AWS', 'Lambda', 'JavaScript', 'Node.js', 'Twitter bot', 'API', 'post']
description: 'A step by step tutorial for building a Twitter bot with JavaScript and Amazon Lambda'
---
*Last updated May 21, 2019*

It feels like everyone is talking about Amazon Web Services [Lambda functions](https://aws.amazon.com/lambda/). Lambda allows you to write code and execute it in the cloud without provisioning, maintaining, and paying for a full server instance. 

I wanted to get in on the action and write my first Lambda function. I was pleased to find out how simple, versatile, and useful Lambda is. 

## The Twitter bot 

After college, I spent a three years working at a political non-profit. I think politics should be important to everyone, especially developers. When I do side projects, I try to choose projects which advance progressive politics. 

One of my go-to resources for building civic projects is [Open States](https://openstates.org/). I wanted to integrate their platform with the [Twitter API](https://developer.twitter.com/en/docs.html). It's unfortunate that [Twitter loves Nazis and the revenue they generate](https://boingboing.net/2019/04/25/why-jack-hasnt-banned-nazis.html), because I think Twitter is a really excellent platform. They have a massive userbase, and the microblogging format lends itself to interesting constraints that create engaging content. Twitter bots are super interesting to me and I think there's a lot of value in using Twitter for social justice. 

I wanted to create a Twitter bot that reports activity in the Colorado State Legislature using Open States data. I call my bot [Colorado Openerr](https://twitter.com/openerr_co). You can view the full source code [here](https://github.com/ogdenstudios/openerr). 

## The logic 

Open States scrapes data nightly. So every morning at 6 am Mountain Time, my Lambda function fires and performs the following work: 

1. Check for all Colorado bills with activity since the day before.
2. For each bill with activity, create an object with that bill's identifier, title, latest action, date of last action, and Open States URL. 
3. Construct a tweet with that information and post it from [@openerr_co](https://twitter.com/openerr_co).

That's it! There are a handful of edge cases to handle: 

1. If there are no bills, I'd like the Lambda to exit gracefully. 
2. Twitter has a [300 posts per 3 hours rate limit](https://developer.twitter.com/en/docs/basics/rate-limits). If there are over 300 bills with activity, I want to post 299 of them and then send out a tweet acknowledging we weren't able to capture all activity. The tweet should direct users to the [Open States Colorado State page](https://openstates.org/co/).
3. If a full tweet with the standard information will be over 280 characters, I'll try to truncate it by removing certain information. If that information also exceeds 280 characters, I want to send a default Tweet that just lists the bill identifier and acknowledges there was some activity related to it.

## The stack 

I wrote the entire script with [Node.js](https://nodejs.org/en/). If you've never worked with Node before, but have some experience writing JavaScript, I'd highly recommend [Max Ogden's Art of Node](https://github.com/maxogden/art-of-node) as a primer. I've been developing in Node for a while now and just recently found this resource while searching for documentation. It's everything I wish I had read three years ago. 

The production script only has one dependency, [Twitter for Node.js](https://www.npmjs.com/package/twitter). Other than that, everything is done with core Node modules and ES6 JavaScript. 

I use [Mocha](https://mochajs.org/) for testing.

I use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) for formatting and linting the code itself. I set my ESLint config to use [Felix Geisendörfer's Node.js Style Guide](https://github.com/felixge/node-style-guide). My opinion about style guides is: **the best style guide is whichever style guide you choose**. As long as you use and enforce styles consistently, the actual details become arbitrary (usually). You can adapt as JavaScript idioms change, and rest assured your code is consistent and easy to understand by other people. Style guides offer a good reference point and key for your code - but they don't necessarily make your code *better*, IMO.

The project is larger than 10 MB total, including node dependencies, so I use [Amazon S3](https://aws.amazon.com/s3/) to host the entire project and deploy to Lambda from it. 

Finally, the script executes in the AWS Lambda Node 8.10 environment. [Lambda recently added support for Node.js v10](https://aws.amazon.com/about-aws/whats-new/2019/05/aws_lambda_adds_support_for_node_js_v10/), and I think this script would execute just fine in that environment, but I have yet to migrate over.

## The script 

Again, you can view the full source code [here](https://github.com/ogdenstudios/openerr) as I take a deep dive through it in this blog post.

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

- I set `date` to the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date of **the previous day**. 
- `env` is set to `test` by default. 
- I load in the [Node.js https module](https://nodejs.org/api/https.html) as `https`. 
- I use my `createOpenStatesQuery()` function to create the initial openStatesQuery, passing in the `date` variable. 
- I load in my sensitive information as `secrets`. The `secrets.json` file is never checked into version control and lives in the root of the project on trusted machines (local dev and Lambda).
- I load the [Twitter for Node.js](https://www.npmjs.com/package/twitter) npm package as `Twitter`.
- I set the `twitter` variable (note the case difference) to a new instance of `Twitter`, using my `secrets` information. 
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

After getit(), I run a callback. I don't have much meaningful to provide to it, so I add another debugging statement `Success from lambda`, again more as a curiosity for myself than a functional bit. I think the `callback` parameter can do more interesting work for complex Lambda functions, but it's not necessary for Openerr. Overall, I believe I have *under-utilized* the options Lambda provides.

### createOpenStatesQuery()

The first function that fires is `createOpenStatesQuery()`. In the dependencies and variables step, I set `var openStatesQuery = createOpenStatesQuery(date);`. This creates the initial query based on the `date` variable, which represents the previous day. 

The function looks like: 

```
function createOpenStatesQuery(date, cursor = null) {
  var query = `
    {
      search: bills(first:100, after:"${cursor ? cursor : ''}", jurisdiction: "Colorado", actionSince: "${date}") {
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

This mostly exists as a convenience for me. I played around with the [Open States GraphQL endpoint](https://openstates.org/graphql) to determine the query that would return the results I care about. Keeping it as a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) allows me to edit it in the code as I might edit it in the web application from Open States. It helps keep one-to-one parity with the request I care about/the request I send. In earlier iterations, I tried writing it as a string with no whitespace, but I found it difficult to match expressions, and difficult to read. 

The function takes a `date` parameter that it [interpolates](https://stackoverflow.com/questions/1408289/how-can-i-do-string-interpolation-in-javascript) as the argument for `actionSince` in the Open States GraphQL query. 

It has an optional parameter for `cursor`. If `cursor` isn't provided, it's set to `null`. The GraphQL query will pass an empty string just fine, so it's a reasonable fallback. The cursor can be provided to allow us to page through the results if there are many. We'll talk more about the paging in the next section.

After the function interpolates the `date` and `cursor` values into the template literal, its runs [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) on the result. The function then returns a string we can send as part of a GET request later on. 

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

We use the `secrets.openStatesKey` as the `X-API-KEY` header, which [Open States requires](https://docs.openstates.org/en/latest/api/v2/index.html#basics).

The `host` option is set to the `url` variable set earlier. This bit tripped me up for a while. `host` needs to *only be the domain name*, and `path` is the actual path we want to hit on the API. We interpolate `query` which is passed in as a parameter to the function.

#### Make the request 

With our options set up correctly, we set `req` equal to `https.get(options, function(res) { ... })`. In the beginning of the callback function, we make a few `console.log()`s out of personal curiosity. They aren't truly necessary, but I like to use them to see what all is going on. 

We also set up an empty array called `bodyChunks` to store chunks of data that come back from `https.get()`. 

In the past, I've struggled with the HTTP module and requests. I found playing around with the [learnyounode tutorial](https://github.com/workshopper/learnyounode) really helped me understand what was going on and how to make HTTP requests in Node. 

#### Handle chunked data 

In the callback function for `https.get()` we set up a handler for `data`, which takes a callback with the signature of `function (chunk) { ... }`. In our callback, all we do is `bodyChunks.push(chunk)` - which pushes the data chunk into the `bodyChunks` array we set up in the initial `https.get()` callback.

#### Handle the end of the request 

When `https` indicates the response has finished, we can process the data chunks we've grabbed. We use [Buffer](https://nodejs.org/api/buffer.html) to concatenate the `bodyChunks` array into one `body` variable. 

Then we use `JSON.parse()` to set `parsedBody` as a JSON object from the concatenated `body` variable. 

We grab some helper variables to make the logic a little cleaner and remove the need for continuing to access nested data: 

- `hasNextPage`: tells us if there are multiple pages to the response.
- `endCursor`: provides the location of the end of the page, if there are more pages.
- `responseData`: the actual JSON data from the response we'll use for processing.

The callback then loops through the `responseData` JSON and runs `createBillObject` on each JSON object. We'll talk more about that function later. It creates a [JavaScript object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects) from the data. Then the loop runs `bills.push(bill)` to add the object to the `bills` array, which is passed in as a parameter to the recursive `getIt()` call. 

On the first function call, `bills` will be an empty array. But subsequently, if `hasNextPage` is true, we create a new Open States query (with `createOpenStatesQuery()` and the `endCursor` from the request) and recurse `getIt()` with that new query and the `bills` array as is. 

If `hasNextPage` is false, we run `startTweeting(bills)` to send out the bill tweets.

#### Handle errors for https.get()

`https.get()` might return some errors, so in its callback, we set up a `console.log()` call with: 

```
req.on('error', function (e) {
  console.log('ERROR: ' + e.message);
});
```

Lambda will output the `console.log()`s so we can check in and see what's going on. If the application had a wider scope or more users, we could add more in-depth error handling and reporting.

### createBillObject()

In the last section I mentioned we take the response JSON and turn it into a JavaScript object with `createBillObject()`. 

`createBillObjet()` takes one param, `data`, which should be a JSON object. It then creates the `bill` variable as an object and sets the following attributes:

- `identifier`
- `title`
- `latestAction`
- `latestActionDate`
- `openstatesUrl`

Encapsulating the bill object creation here gives us some flexibility if we end up wanting different information to get sent out, if our Open States query changes (which could change the structure of the data), or if the Open States API changes in a significant way. The function returns the object for use. 

### startTweeting() 

The `startTweeting()` function controls the Twitter loop. It takes two params: `bills` and `testing`. Testing is set to `false` by default, since it's reserved for a specific use-case. 

We start by setting the `limit` to 0. Then we check if the `bills` array passed in as a parameter has a length of 0. If it length was 0, we `console.log()` "No bills found today" and `return false` to end execution. 

If the bills array contains over 300 items, we begin by tweeting out a message notifying readers that over 300 bills had activity the previous day, and that exceeds the rate limit for Tweeting. We then set `limit` to 299. 

Finally, if `0 < bills.length < 300`, we set `limit` to `bills.length` and run a `for` loop with that many iterations. Inside the loop we use `createTweetText()` on `bills[i]` to create a tweet that complies with Twitter character limits.

If `testing` has been passed in as `true`, we return the bills object to the test. If not, we use `tweet()` to send out the status created with `createTweetText()`.

### createTweetText()

Twitter has a 280 character limit on tweets. Our ideal Tweet text looks like: 

```
Colorado [BILL IDENTIFIER]: [BILL TITLE]. On [DATE OF LAST ACTION], the following action was taken: [NAME OF LAST ACTION]. Read more at: [OPEN STATES BILL LINK].
```

Depending on how long each of those variables is, we might end up with a tweet above the 280 character limit. To avoid that, we use `createTweetText()` to control the Tweet composition. 

First, we set `tweetText` to an empty string. We then set `tweetBody` to:

```
`Colorado ${bill.identifier}: ${bill.title}. On ${bill.latestActionDate}, the following action was taken: ${bill.latestAction}.`
```

Then we set up the `readMore` text, which uses a [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) to determine its value. Some Open States bills don't have corresponding links. If the bill is missing one, `readMore` is set to an empty string. If the bill has one, we set it to `'Read more at: ' + bill.openstatesUrl.toString()`. 

These two variables, `tweetBody` and `readMore` represent the fully composed Tweet we'd like. We then check if the `.length` of them is `<= 280`. If it is, we set `tweeText = tweetBody + readMore`. 

If their combined length is greater than 280, we check to see if just `tweetBody.length <= 280`. If that's the case, we set `tweetText` to `tweetBody`. 

Finally, if `tweetBody` is also too long, we set a default `tweetText` to: 

```
`There was action on Colorado ${bill.identifier}, but it was too long to tweet.`
``` 

Finally, we return `tweetText`, as it will be used by the `tweet()` function. 

### tweet()

Our `tweet()` function is pretty much just a wrapper around the `twitter` object created by the Twitter Node package. It takes one parameter, `status`.

If `env` is set to `production`, the function runs `twitter.post('statuses/update', {status: status})`. 

The `.then()` function just logs the tweet to the console, and the `.catch()` logs out the `error` if there is one. 

If `env` isn't set to `production`, we just run `console.log(status)` instead of sending out the tweet. We set `env` in our different exported handlers to control this behavior. 

### Run local 

At the bottom of the script you'll notice the following: 

```
if (process.argv[2] === 'local') {
  getIt(openStatesQuery, []);
}
``` 

This allows you to run `npm run local` in the directory of the project and see the `console.log()` output of the script. It's useful if you want to run the script and check its output without Lambda or Twitter. I find it to be a convenient debugging tool. 

### Packaging up the script 

Lambda won't run `npm install` for us. **It just runs the script handler export**. So we need to actually upload our `node_modules` folder along with everything. In order to upload it, we'll need a `.zip` file. 

I wrote an npm script to make this easier. `npm run zip` is an alias for `zip -r ./openerr.zip *`. This will create (and overwrite!) `openerr.zip` in the root of the project, which is added to the `.gitignore` file to stay out of version control. 

### Uploading to Lambda 

If your `.zip` file is small enough, you can upload directly through the Lambda console. But at 10 MB and larger, AWS requires you to upload the package to an S3 bucket and select it from there. Openerr is 10.5 MB, so I set up an S3 bucket to hold it. S3 is outside the scope of this article, but you can [read about it in the AWS docs](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html). 

- Log in to the [AWS Console](https://console.aws.amazon.com). 
- Click **Lambda**. 
- Click **Create function**.
- Select a **Function name** and **Runtime** (Openerr and Node.js 8.x for our script).
- Click **Create function** 
- Change the **Code entry type** to **Upload a .zip file** or **Upload a file from Amazon S3**. 
- Select the file and click **Upload**. 
- Click **Save**. 

Now the Lambda function is correctly set up! So exciting!

### Setting up CloudWatch

I [use CloudWatch to schedule the Openerr Lambda function](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html). There are other ways you can trigger a Lambda function, but Openerr just needs to run once a day.

Back in the AWS console: 

- Click **Services**
- Click **CloudWatch** 
- Click **Rules** 
- Click **Create rule** 
- Click **Schedule** 
- You can either use a **Fixed rate** or **Cron expression**
- Openerr uses a **cron expression** of `0 12 ? * * *` which runs every day at 12 GMT. 

Heads up! Amazon has a *slightly* different syntax for cron than you might be used to. Here's [the documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) for that. 

## Conclusion 

I had a ton of fun building this Lambda function. It was a great way to hone my JavaScript and Node skills. And now that I'm comfortable working with Lambda, I feel like I'm *in with the cool kids*. I hope you this blog post is a useful to other developers looking to improve their JavaScript, Node, and Lambda skills.

### Limitations

Of course, there are some limitations we should address!

#### Openerr doesn't handle 300+ actions very well

In the `startTweeting()` section, I explained the looping logic respects the Twitter rate limits of 300 requests per 3 hours. The Colorado State Legislature might take action on more than 300 bills in a given day. Right now I'm taking the easy way out by tweeting 299 bills and sending an initial "Read more" tweet to capture all the activity. I'm satisfied with this approach for now, but eventually I'd like to figure out a way to run this Lambda function such that it can make 300+ tweets and respect the rate limits. The difficulty is that Lambda functions are limited to 15 minutes execution time max, and the rate limit window is 3 hours long. I'd need to preserve my bills array, preserve the position I'm in, and trigger the script to fire again. I think it's possible, but I haven't gotten around to figuring it out yet. I am open to suggestions if you have any! Send an email to [tyler@ogdenstudios.xyz](mailto:tyler@ogdenstudios.xyz) or find me [on Twitter](https://twitter.com/tylerwilliamsct).

#### My test coverage is poor 

The tests I wrote were really for my own benefit of learning the Mocha testing syntax. They don't provide a tremendous amount of coverage. If this were more than a hobby project, I'd set up more in-depth testing. As Openerr grows and more folks use it, better tests are on the agenda. 

#### My logging system is poor

Using `console.log()` to log activity to AWS Lambda feels sloppy. In an ideal world, I'd like the script to maybe send me some emails with error reports, summaries of what happened, etc. etc. I think CloudWatch also has some reporting capabilities I'm not tapping into and could learn more about. 

#### I'm not taking full advantage of Lambda

This is somewhat related to all the previous limitations. I've just scratched the surface of Lambda and what it can do. I'd like to find a way to chain together Lambda functions to work with Twitter rate limits. I'd like to set up a real test environment in Lambda. I'd like to provide the proper handlers to give clear error and success reports to CloudWatch and have them sent to me for monitoring. Hopefully I'll have some time soon to explore these ideas and do some follow up blog posts about them.

## Give money to Open States 

If you like my project or the work Open States does, the best way to support them is [by giving money to Open States](https://openstates.org/donate/)