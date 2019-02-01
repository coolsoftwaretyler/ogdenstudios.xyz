---
layout: post
title: How do I add Capistrano to an Existing Rails Application?
---
So I've got the [Trackerr](https://github.com/ogdenstudios/trackerr) app up and running on an Amazon EC2 instance. But making changes is a real pain. I have to make changes in my development machine, push to GitHub, SSH into the server, pull from GitHub, and run a bunch of commands to rebuild and restart everything. 

There must be an easier way. 

Enter: [Capistrano](https://github.com/capistrano/capistrano).

Some information about Capistrano here. 

This is step 2 instead of being included in step 1 because the honest truth of it is I have often built applications or gotten started on a project before realizing I needed a certain tool, and so often, tutorails have you start right from the beginning. It's annoying and can be unrealistic. This tutorial assumes you **have** an existing Rails Application, and it lives on an Amazon EC2 instance, and you've just realized you should use something like Capistrano, because updating your app is such a pain. 

I needed to figure out how to add Capistrano to an existing Rails App. One of my first google searches led me to [this article](https://medium.com/@jamesarobbo/deploying-a-rails-app-to-aws-with-passenger-nginx-and-capistrano-for-the-first-time-e8a0aac7da07) which walks through the inital setup of the rails app as well, so it's somewhat useful, but not quite. 

I'm going to synthesize some of that information with the work we did in [part 1 of this series](/2019/01/30/how-do-i-deploy-a-rails-6-app-to-amazon-ec-2.html) - so you can certainly follow along with the article above, but if you came here from part 1 of my tutorial, following along with this blog post will be slightly more cohesive. 

## Setup Capistrano

First, we'll need to add Capistrano to the application. 

```
# ~/dev/trackerr/Gemfile
gem 'capistrano'
gem 'capistrano-rails'
gem 'capistrano-bundler'
```

Run bundle install to check that this worked. 

```
# ~/dev/trackerr
local$ bundle install
```

If everything worked, go ahead and commit this change (I like to make very small commits, especially when I'm working solo - so I can always see where I messed up when things eventually break)

```
# ~/dev/trackerr
local$ git add .
local$ git commit -m "add capistrano to gemfile"
local$ git push
```

With Capistrano securely in your Gemfile and repository, it's time to begin configuring it. Generate the Capistrano config files by running: 

```
# ~/dev/trackerr
cap install STAGES=production
```

This creates three files: **Capfile, config/deploy.rb and config/deploy/production.rb**.

In the Capfile, uncomment the following lines: 

```
# ~/dev/trackerr/Capfile
require "capistrano/bundler"
require "capistrano/rails/assets"
require "capistrano/rails/migrations"
```

I'll set up my `config/deploy.rb` to look like: 

```
# ~/dev/trackerr/config/deploy.rb
set :application, 'trackerr' 
set :repo_url, 'git@github.com:ogdenstudios/trackerr.git'
set :deploy_to, '/home/trackerr-user/trackerr'
set :use_sudo, true
set :branch, 'master'
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
```

I also need to add settings to the production environment config for Capistrano 

```
server 'ec2-3-88-162-177.compute-1.amazonaws.com', user: 'ubuntu', roles: %w{web app db}
set :ssh_options, { 
    forward_agent: true,
    auth_methods: ["publickey"],
    keys: ["/Users/tylerwilliams/server-keys/trackerr-key-pair.pem"]
}
```

Sweet, had to give ubuntu an ssh key on github before cap would work 

Had to give ubuntu user chown access to /home/trackerr-user/trackerr https://askubuntu.com/questions/402980/give-user-write-access-to-folder

no sunc hfile or directory bundle capistrano 

maybe had to add rbenv? gem 'capistrano-rbenv', '~> 2.1'

maybe instead of all that i'll ust log in as trackerr-user
 