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

You might already have some configuration in your production block, so make sure to overwrite that. 

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