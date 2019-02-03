---
layout: post
title:  "How do I add an Amazon Database to my Rails app?"
tags: [blog, tutorial, rails, aws, postgres, RDS]
description: "A step-by-step tutorial for adding Amazon RDS services to your existing rails app running on Amazon EC2"
---

This is a follow up post to my first blog, [How do I deploy a Rails 6 App to Amazon EC2?](https:ogdenstudios.xyz/2019/01/30/how-do-i-deploy-a-rails-6-app-to-amazon-ec-2.html) to add production-ready database capabiities to my Trackerr app. 

At the beginning of this tutorial, [Trackerr](https://github.com/ogdenstudios/trackerr) is at `3f100519c9b68d5b625ce3004ec45f46e4a7fe49`, if you're curious to see the code I'm starting from. 

To summarize, we've got a blank Rails 6 Beta app with a placeholder route, controller, and view. It's set up with [Capistrano](https://capistranorb.com/) for easy server deploys. It defaults to using SQLite3 as a database, which is fine for development purposes (and I even prefer it over other solutions), but won't stand up to scaling server loads. 

This Rails 6 app lives on an Amazon EC2 instance, which makes the Amazon RDS Database instance a natural choice for adding a production database. 

Here's what we're going to do: 

1) Set up an Amazon RDS database running postgresql
2) Configure our Rails App to connect to the database 
3) Test our database configuration by creating Users with the [Devise](https://github.com/plataformatec/devise) gem

## Step 1: Set up an Amazon RDS database running Postgresql 

I decided to choose postgres as a database because it's a common choice amongst Rails devs. Additionally, it's waht Heroku uses, and this blog series is loosely a series about migrating rails apps from Heroku to Amazon AWS. I imagine some people may have found this article while trying to do just that, and I want to tailor our choices to make it as informational as possible for that use case. 

## Step 2: Configure our rails app to connect to the database 

## Step 3: Test our database configuration 

We're going to create Users for our app, and we're going to use [Devise](https://github.com/plataformatec/devise) to do it. I love Devise, although if you've never rolled your own authentication and authorizatio system, you might want to get some experience with that before reaching for this tool. The [Michael Hartl Ruby on Rails tutorial](https://www.railstutorial.org/book/modeling_users) has a great section on just this. 