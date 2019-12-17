---
layout: post
title: ""
tags: []
description: ""
---

## Lambda pain points 

I've written a handful of [AWS Lambda Functions](https://aws.amazon.com/lambda/). I think they're super neat! I even wrote a blog post about [making a Twitter bot with AWS Lambda](https://ogdenstudios.xyz/2019/05/21/how-to-build-a-twitter-bot-with-aws-lambda.html). 

But if you read through my post, you'll see there are two big pain points: 

* Packaging up the script to upload to Lambda
* Configuring CLoudwatch to run the script 

When I built that Twitter bot, I was entirely new to Lambda and didn't really understand the ecosystem and tooling for it. So it was a huge hassle to make changes to my function, version control them, package them up, upload them to AWS, and then reconfigure the script as needed. 

After a few months of playing around with Lambda and encountering these pain points, I knew I was missing something. Everyone is so excited about Lambda. Netlify and ZEIT are using lambda functions and making them easy for their users to write. How could people be this excited about such an annoying process? 

## The Serverless Framework 

Turns out I was one internet search away from the solution. [The Serverless Framework makes developing Lambda easy](https://serverless.com/). I think I missed this because so many people use the term "serverless" as a generic talking point, and this framework is named so generically. People have probably said to me something like: 

> Hey Tyler! You should really be checking out Serverless! 

And they meant the *framework*, but I thought they were just telling me to write Lambda (which I was already doing). 

And boy howdy have I been missing this. It's made my life so much easier. 

## Use the Serverless Framework to build a Twitter bot 

I won't go into detail about all the code here, but I thought it would be great to revisit my Twitter bot using the Serverless framework this time. 

## Install serverless
## Make permissions
## Copy code over
## Set configuration
## Test it local
## Deploy it up

## Remaining pain points

Permissioning 
Debugging chained functions 