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

First I'm going to modify my Gemfile. I want Trackerr to use PostgreSQL in Production, and SQLite3 in development.

Let's add a [production block](https://depfu.com/blog/2017/01/18/bundler-and-gemfile-best-practices) to the Gemfile. It should look like this: 

```
# ~/dev/trackerr/Gemfile 
group :production do 
  gem 'pg'
end
```

You can just stick that at the end of the file. It tells the Gemfile to use the 'pg' (postgres) gem only when running in a production environment. Up next, we'll tell our application to use the sqlite3 gem in development.

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

Now we'll update the database configuration YAML file according to [these specs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Ruby.rds.html). You'll notice there is already some configuration for the `production:` block part of your `database.yml` file, so make sure to replace it all with the code below.

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

Since Rails 5.2, we've had access to the `master.key` file, which encrypts configuration variables and allows you to check them directly into source control, avoiding the need for complex environment variable setups. [Part 1](https://ogdenstudios.xyz/2019/01/30/how-do-i-deploy-a-rails-6-app-to-amazon-ec-2.html) of this series covers how to configure the master key correctly. If you've done so, you can add these values using [this guide](https://www.engineyard.com/blog/rails-encrypted-credentials-on-rails-5.2), or by following along with me. 

In your application directory, open up the encrypted credentials file: 

```
# ~/dev/trackerr
local$ EDITOR=vim rails credentials:edit 
```

In the editor, add the following values: 

```
RDS_DB_NAME: postgres
RDS_USERNAME: **YOUR_USERNAME_HERE**
RDS_PASSWORD: **YOUR_PASSWORD_HERE**
RDS_HOSTNAME: **YOUR_ENDPOINT_HERE**
RDS_PORT: **YOUR_PORT_HERE**
```

In your values, paste in the name of the database we set up, the username we chose, the password we created. If you recall in step one, we chose a master username and master password. Use those for the fields labeled `YOUR_USERNAME_HERE` and  `YOUR_PASSWORD_HERE`. Your RDS_HOSTNAME will be provided on the RDS console. Visit the Amazon AWS Console, select **RDS**, choose your database, and then find the "Endpoint" value under **Connectivity**. The port value will be listed underneath, as well.

## Step 3: Configure your EC2 instance to work with postgres

You won't be able to run capistrano quite yet. You'll need to make sure your EC2 instance has access to the software packages the pg gem requires. SSH into your EC2 instance and run:

```
# ~
ubuntu$ sudo apt-get install postgresql-client libpq5 libpq-dev
```

With these pre-reqs in place, we can deploy to production from our local machine, running:

```
# ~/dev/trackerr

cap production deploy 
```

## Step 4: Test the database configuration with Devise

I'm not going to dive too deep into the design of Trackerr quite yet. Blog posts detailing the actual development will come later in this series. But I do know we'll want to have a user authentication system. 

One of the most battle-tested solutions for this is the [Devise gem](https://github.com/plataformatec/devise).

If you've never built your own authentication and authorization system, you might want to get some experience with that before reaching for the devise gem. The [Michael Hartl Ruby on Rails tutorial](https://www.railstutorial.org/book/modeling_users) has a great section on building user authentication from scratch. But in order to get things up and running quickly, I'm going to start with Devise. 

Including the Devise setup is a great way to test our database configuration worked, because it requires a functioning database to work correctly, so if we can set up this initial user system, we'll know we were successful. 

Add the Devise gem to your gemfile: 

```
# ~/dev/trackerr/Gemfile 
gem 'devise'
```

Run a bundle install and then run the Devise generator:

```
# ~/dev/trackerr
local$ bundle install 
local$ rails generate devise:install
```

Devise will prompt you for some initial configuration. 

In a later part of this series, we'll dive deeper into a production configuration for Devise, but for a quickstart, here's what you need to know: 

1. We need to have our root routed to some controller method, which we do from part 1. 
2. We need to set up the defaults for the Devise mailer. You can do this quickly by adding `config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }` to `config/environments/development.rb`.
3. Devise expects a way to display [flash](https://api.rubyonrails.org/classes/ActionDispatch/Flash.html) notices to your views. In `trackerr/app/views/layouts/application.html.erb`, make sure you have the following markup, preferably towards the top of your document:

```
# trackerr/app/views/layouts/application.html.erb
<% flash.each do |key, value| %>
  <div class="alert alert-<%= key %>"><%= value %></div>
<% end %>
```

With that quick (and incomplete, for now) configuration, it's time to generate a devise model for the users. 

Generate the devise model for users and migrate: 
Need to adjust to inherit from active record [6.0] in migrate files

Run: 

```
# ~/dev/trackerr
local$ rails generate devise User 
local$ rails db:migrate
```

I found that when I tried to run `rails db:migrate`, I ran into an ActiveRecord error. It seems Devise didn't specify the correct ActiveRecord class for inheritance. If you get errors when migrating, open up the migration file which ends in `_devise_create_users.rb`. You'll find it in the `db/migrate` directory. 

Find the line which reads `class DeviseCreateUsers < ActiveRecord::Migration` (it should be right at the top of the file) and change it to: `class DeviseCreateUsers < ActiveRecord::Migration[6.0]`. This sets the ActiveRecord class to the updated version (in sync with the Rails 6.0.0 beta we're using).

Finally, let's seed the initial user. In your `db/seeds.rb` file,

```
# ~/dev/trackerr/db/seeds.rb
User.create!(
    email: "yourname@yourdomain.com",
    password: Rails.application.credentials[:ADMIN_PASSWORD]
)
```

Again, notice we're using the encrypted credentials file. I've added an `ADMIN_PASSWORD` field to the credentials by running `EDITOR=vim rails credentials:edit` again. 

In order for Capistrano to take advantage of your seeds, we need to add an additional gem. 

In your Gemfile, add the capistrano rails db gem: 

```
# ~/dev/trackerr/Gemfile
...
gem 'capistrano-rails-db'
```

And in your Capfile, add it as a requirement: 

```
# ~/dev/trackerr/Capfile
...
require 'capistrano/rails/db'
```

Finally, let's commit to git and deploy: 

```
# ~/dev/trackerr
local$ git add .
local$ git commit -m "add devise gem and initial user seed"
local$ git push 
local$ cap production deploy 
local$ cap production deploy:db:seed
```

You can visit your sign in page at yourdomain.com/users/sign_in and confirm that it worked. Enter your information and make sure you get a flash message saying you've successfully signed in!
