---
layout: post
title:  "How do I add an Amazon Database to my Rails app?"
tags: [blog, tutorial, rails, aws, postgres, RDS]
description: "A step-by-step tutorial for adding Amazon RDS services to your existing rails app running on Amazon EC2"
---

This is a follow up post to my blog titled: [How do I deploy a Rails 6 App to Amazon EC2?](https://ogdenstudios.xyz/2019/01/30/how-do-i-deploy-a-rails-6-app-to-amazon-ec-2.html).  

I'll be continuing to work on the example Trackerr app, and my next step is to add a production-ready database to the application.

To summarize part one, we've got a blank Rails 6 Beta app with a placeholder route, controller, and view. It's set up with [Capistrano](https://capistranorb.com/) for easy deploys. It uses SQLite3 as a database, which is fine for development purposes, but won't scale well if the application takes off in popularity. 

The Trackerr app lives on an Amazon EC2 instance, which makes the Amazon RDS Database instance a natural choice for adding a production database. 

This blog post will follow as I:

1) Set up an Amazon RDS database instance with postgresql
2) Configure Trackerr to connect to the database 
3) Test the database configuration and implementing a user authentication system with [Devise](https://github.com/plataformatec/devise).

## Step 1: Set up an Amazon RDS database running Postgresql 

I chose postgres as a database system because it's a common choice amongst Rails devs. Additionally, it's the database Heroku uses for their applications, and my intention is to use these blogposts as a guide for migrating away from Heroku as a web host. Using a similar stack to Heroku should help things go smoothly. 

First, [sign in or sign up with Amazon AWS](https://console.aws.amazon.com). 

In the navbar, choose **Services** and then **RDS**. 

On the next page, click on your **DB Instances** link. 

In the RDS instance console, choose **Create Database**. 

At the bottom of the page, you can select an option to **Only enable options eligible for RDS Free Usage Tier**. If you select this option, you'll see PostgreSQL is still available. Select that box. 

You'll be taken to a page titled **Specify DB details**. I kept all the settings default, except the required values at the bottom: 

1. **DB Instance Identifier:** I chose "trackerr-db-0" for this 
2. **Master username:** I chose a logical username here, but won't list it for security reasons. 
3. **Master Password:** I used a secure password generator here and stored it in my password manager. 

Take note of these values somewhere secure and convenient (such as a password manager). You'll need them shortly. 

Click **Next** and you'll be taken to the **Configure advanced settings** page. I kept most of these settings default, although you'll want to make sure that **Public accessibility** is set to true, so our EC2 instance can access the database. If we were doing all of our development inside Elastic Beanstalk or a VPC, we could set this to false, but that's not quite how we've set up the project, so this needs to be true to work. 

Click **Create Database** and then **View DB Instance Details**. It can take 20-30 minutes for the database to fully spin up, so keep that in mind as we move on to the next steps, you may need to wait before the necessary information is available. 

## Step 2: Configure our rails app to connect to the database 

I'll be following along the instructions [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Ruby.rds.html).

First we'll need to set up our Gemfile. We want the production application to use postgres, and our development application to keep using SQLite. 

Let's add a production block to the Gemfile. It should look like this: 

```
# ~/dev/trackerr/Gemfile 

group :production do 
  gem 'pg'
end
```

You can just stick that at the end of the file. 

In that same file, find the line which reads `gem 'sqlite3'`. It's likely towards the top of the Gemfile Rails generated. 

Move it into the block which starts `group :development, :test do`. 

So you should now have a development and test block which reads: 

```
# ~/dev/trackerr/Gemfile

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3'
end
```

Run a `bundle install` and `rails s` to make sure the local environment is still working correctly. 

```
# ~
local$ bundle install 
local$ rails s
```

If everything looks in order, here's a great place for a git commit. 

```
# ~ 
local$ git add .
local$ git commit -m "add pg gem and move sqlite3 gem to dev/test"
local$ git push 
```

Now we'll update the database configuration YAML file according to [these specs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Ruby.rds.html)

```
# ~/dev/trackerr/config/database.yml
production:
  adapter: postgresql
  encoding: utf8
  database: <%= Rails.application.credentials[:RDS_DB_NAME] %>
  username: <%= Rails.application.credentials[:RDS_USERNAME] %>
  password: <%= Rails.application.credentials[:RDS_PASSWORD] %>
  host: <%= Rails.application.credentials[:RDS_HOSTNAME] %>
  port: <%= Rails.application.credentials[:RDS_PORT] %>
```

You might already have some configuration in your production block, so make sure to overwrite that. You wont RDS_DB_NAME to be postgres, wich tripped me up at first. 

I'm using the Master.key syntax for the secret variables here. Using Master.key is out of the scope of this article, but you can figure out how to set that [here](https://www.engineyard.com/blog/rails-encrypted-credentials-on-rails-5.2). 

In your values, paste in the name of the database we set up, the username we chose, the password we created. Then 

You won't be able to run capistrano quite yet. You'll need to make sure your EC2 instance has the pre-reqs, first. SSH into your instance (link to the place where we set up the alias). Get the prereqs: 

```
# ~
ubuntu$ sudo apt-get install postgresql-client libpq5 libpq-dev
```

Let's run a capistrano deploy: 

```
# ~/dev/trackerr

cap production deploy 
```

## Step 3: Test our database configuration 

We're going to create Users for our app, and we're going to use [Devise](https://github.com/plataformatec/devise) to do it. I love Devise, although if you've never rolled your own authentication and authorizatio system, you might want to get some experience with that before reaching for this tool. The [Michael Hartl Ruby on Rails tutorial](https://www.railstutorial.org/book/modeling_users) has a great section on just this. 

In your gemfile: 

```
# ~/dev/trackerr/Gemfile 
gem 'devise'
```

Run bundle install and run the generator:

```
# ~/dev/trackerr
local$ bundle install 
local$ rails generate devise:install
```

Follow instructions to set up the mailer config 

{write here]}

Generate the devise model for users and migrate: 
Need to adjust to inherit from active record [6.0] in migrate files
```
# ~/dev/trackerr
local$ rails generate devise User 
local$ rake db:migrate
```

Add seed files 

Deploy and you're good to go. 