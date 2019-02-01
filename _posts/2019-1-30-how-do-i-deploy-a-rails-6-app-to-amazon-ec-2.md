---
layout: post
title:  "How do I Deploy a Rails 6 app to Amazon EC2?"
tags: [blog, tutorial, rails, aws]
description: "A step-by-step tutorial for creating a blank Rails 6 app and deploying it to an Amazon AWS EC2 instance."
---

## Why I wrote this blog post 

I've been building Rails apps for some time now. I've been mostly relying on [Heroku](https://heroku.com) to for my deploys. 

I love Heroku. They make an excellent product, and it's great for quick prototypes and small hobby servers. But for more involved projects, the cost and lack of control don't work for me. I figured it was time to start managing my own infrastructure. 

Additionally, the [Ruby on Rails 6 beta](https://edgeguides.rubyonrails.org/6_0_release_notes.html) just came out, and I wanted to spin up a demo project and check it out.

Writing the blog post helped me to learn and solidify my understanding of what all goes into taking a Rails 6 beta project from 0 to AWS, and I hope you find it helpful as well.

## Who should read this blog post 

This blog posts assumes some prior knowledge of Ruby on Rails. I learned what I know from: 
- [The Michael Hartl Tutorial](https://www.railstutorial.org/book)
- [12 Rails Apps in 12 Weeks by Mackenzie Childs](https://www.youtube.com/watch?v=7-1HCWbu7iU&list=PL23ZvcdS3XPLNdRYB_QyomQsShx59tpc-) 

It also assumes knowledge of command line interfaces, SSH, and git. Here are some good places to start for that:
- [Getting around the Command Line](https://www.davidbaumgold.com/tutorials/command-line/)
- [What is SSH?](http://blog.robertelder.org/what-is-ssh/)
- [Try Git](http://try.github.io/) 

This blog should help you if: 

- You also want to start moving your projects off Heroku. 
- You have told someone you could move their project off Heroku and on to AWS and you have never done that before.
- You've never done server configuration before, but you've got to learn very quickly. 
- You'd like to correct my personal mistakes via blog post. 

## How this blog post works

I'll be writing out each step of my process in creating a blank Rails 6 application and deploying it to a barebones EC2 instance. I will focus special attention on the steps that tripped me up as I performed them.

I'm going to use my actual commands, filepaths, and project names. That means you'll likely need to do some substitution as you follow along, depending on your specific use case. 

So let's get started! 

## Get Rails 6

I'm going to assume you already have ruby, bundler, and rails installed on your local dev machine, because you have some Ruby on Rails experience. If that's the case, all you need to do is get the latest rails gem.

```
# local ~
local$ gem install rails --pre 
```

## Create a Rails 6 project 

Then you need to make a new project with the Rails 6 beta 

```
# local ~/dev
local$ rails _6.0.0beta1_ new trackerr
local$ cd trackerr
```

An initial `bundle install` never hurts

``` 
# local ~/dev/trackerr
local$ bundle install 
```

Check that it works 

```
# local ~/dev/trackerr
local$ rails s
```

You should see something like: 

![Rails 6 Default Index Screenshot](/img/rails-6-ec2-tutorial-1/rails-6-success.png)
 
Nice, it works. 

This is my favorite place for an init commit in git: It's fresh, it's new, it works. I haven't broken anything yet.

```
# local ~/dev/trackerr
local$ git add . 
local$ git commit -m "init commit"
```

## Push to GitHub (or other similar platform).

I use GitHub for my repositories, so YMMV, but I'm going to get this fresh Rails project checked into GitHub ASAP. 

[Here's the GitHub doc for creating a new repository](https://help.github.com/articles/create-a-repo/), or you can follow along below: 

1. Go to <a href="https://github.com" target="_blank" rel="noopener noreffer">https://github.com</a> 
2. Sign in or sign up. 
3. Click the plus sign button
4. Click **New Repository**
5. Name it **trackerr** (or whatever you'd like to name your project).
6. Add a description. For my project, that description is: **Full Suite State Legislation Tracker**
7. [GitHub allows unlimited private repos now](https://techcrunch.com/2019/01/07/github-free-users-now-get-unlimited-private-repositories/), but I'll keep it public, because I love open source. 
8. Don't initialize the repo, you've already got one on your machine. 
9. Follow the on-page instructions for pushing an existing repo from command line 

I use SSH keys for my GitHub access, and setting that up is beyond the scope of this blog post, but [here is a good guide on how to do that](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).

```
# local ~/dev/trackerr
local$ git remote add origin git@github.com:<YOUR ADDRESS HERE>
local$ git push -u origin master 
```

Voila, you've got a Rails 6 project installed on your machine and checked in to your GitHub. 

## Get the sample page ready

In order for your Rails app to actually work on the EC2 instance, you'll need to set up a root path in your configuration, and a corresponding controller and view. 

You can use the [rails controller generator, if you like](https://guides.rubyonrails.org/command_line.html), or you can add it yourself. Since this blog post doesn't cover testing or assets or any of the other nice rails magic created in the controller generators, I'm going to just manually add the bare minimum here.

In your `config/routes`

```
# local ~/dev/trackerr/config/routes.rb 
root "pages#index"
```

In your `app/controllers`

```
# local ~/dev/trackerr/app/controllers/pages_controller.rb
class PagesController < ApplicationController
    def index
    end
end 
```

And a corresponding view 

```
# local ~/dev/trackerr/app/views/pages/index.html.erb
<h1>You did it! Great job!</h1>
```

Add your changes and push them up to git 

```
# local ~/dev/trackerr
local$ git add .
local$ git commit -m "add home page"
local$ git push 
```

Now your barebones Rails 6 app is just about ready to live on a server. 

## Setup Capistrano 

We're going to be using [Capistrano](https://github.com/capistrano/capistrano) to manage our deploy tasks. I'll be using information found in [this article](https://medium.com/@jamesarobbo/deploying-a-rails-app-to-aws-with-passenger-nginx-and-capistrano-for-the-first-time-e8a0aac7da07) to describe these steps, so feel free to read along with the original article or with this tutorial. 

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

This creates three files: `Capfile`, `config/deploy.rb` and `config/deploy/production.rb`.

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
set :deploy_to, '/home/ubuntu/trackerr'
set :use_sudo, true
set :branch, 'master'
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
```

We'll configure `config/deploy/production.rb` later, since it requires some EC2 specific information, which we won't have until we set up the instance. So let's get to it!

## Set up your Amazon EC2 Instance

Go to Amazon AWS Console 

<a href="https://console.aws.amazon.com/" target="_blank" rel="noopener norefferer">https://console.aws.amazon.com/</a>

Sign in, or sign up. 

Once you're logged in and have an account ready to go, click **Services**. 

In the dropdown menu, select **EC2** under the **Compute** menu. 

On this new page, click **Launch Instance**. 

Choose the **Ubuntu Server 18.04 LTS (HVM), SSD Volume Type**. 

Click the **Select** button. 

Since this is a starter project, I'm going to choose the t2.micro instance, eligible for the free tier. 

Click **Next: Configure Instance Details** - nothing to change here, unless you want to. 

Click **Next: Add Storage** - I'm going to keep the defaults here, as well, since this is really just a proof of concept kind of thing. 

Click **Next: Add Tags** - again, nothing to go here. 

Click **Next: Configure Security Group** 

1. Select the **Create a new security group** radio button 
2. There's already an SSH open on port 22 to 0.0.0.0/0
    - Amazon will tell you this is insecure, and they're right. This allows people to connect via SSH from anywhere on the internet. If you have the ability to lock down your own IP address, you should choose a restricted SSH set, and limit it to your IP. I won't go into that, and for now we aren't setting up anything sensitive enough to really go wrong here. 
3. Next, add a new rule. Here's what I created: 

![Image depicting Amazon EC2 sample security group](/img/rails-6-ec2-tutorial-1/ec2-security-group.png) 
    
Security rule settings: 
- Type: `Custom TCP`
- Protocol: `TCP`
- Port Range: `80`
- Source: `Custom: 0.0.0.0/0`

Keeping port 80 open to the world is desired behavior - you want anyone to be able to access your site once it's live. 

Click **Review and Launch** 

Confirm everything looks the way you want, and finally click **Launch**. 

Amazon will ask you to select an existing key pari or create a new key pair. I'm assuming you either haven't done this before (and therefore have no key pair), or, like me, are trying to set up a fully sandboxed Rails App. So let's select **Create a new key pair**. 

Name it. I'm naming mine *trackerr-key-pair*

Click **Download Key Pair**. 

![Image depicting Amazon EC2 Key Pair Dialogue](/img/rails-6-ec2-tutorial-1/key-pair-dialogue.png) 

Save the file. 

Click **Launch Instances**. 

Once the instances launch, amazon will give you an option to view it (along with a lot of other helpful information you should check out). 

I like to name my EC2 instances. If you click on the link provided by Amazon pointing to your instance, you can view your EC2 console. 

Under the **Name** column, you can click the pencil icon to edit its name. I chose *Trackerr*. Here's what my Resource Groups look like after that. 

![Image depicting Amazon EC2 Resource Groups](/img/rails-6-ec2-tutorial-1/resource-groups.png) 

Great! Now you've got a Rails App on your machine and in GitHub, and you have a plain EC2 instance running on AWS. It's almost time to marry them together. 

Before we get to that, though, let's set up convenient access to the server. 

First, find that `.pem` key file you downloaded from Amazon. I'm on a Mac + FireFox, so mine ended up in `~/Downloads` 

I personally like to keep these kinds of files in `~/server-keys` - which may or may not be great SecOps. I guess one day I'll find out. 

So go ahead and make a folder called `server-keys` (or whatever you like) and drop it in your home directory (or wherever you like). 

You'll need to make your key not publicly viewable. To make sure that's the case, run 

```
# local ~/server-keys/
local$ chmod 400 trackerr-key-pair.pem
```

Then you'll want to connect to your instance using its Public DNS. 

The command looks like `ssh -i "tracker-key-pair.pem" ubuntu@some-dns.computer.amazon.aws`. 

If you need a more specific command for your keypair name and DNS address, click the **Connect** button in the Amazon Resource Groups panel.  

Make sure that all works. If so, you're in good shape. At this point you: 

1. Have a Rails 6 app on your computer/in GitHub. 
2. Have an Amazon EC2 instance running
3. Have SSH access to your Amazon EC2 instance. 

Let's make that SSH access even more convenient by setting up an alias. I use [zsh and oh-my-zsh](https://medium.com/swlh/power-up-your-terminal-using-oh-my-zsh-iterm2-c5a03f73a9fb), so I'm going to open up my .zshrc file. 

In command line: 

```
# local ~
local$ vim .zshrc
```

I'm not great with [VIM](https://www.openvim.com/), but I'm learning, and I love it. You can edit this file using any text editor you like. 

Everyone's config is going to be different. Towards the bottom of my file, I'm going to add: 

`alias ssh_trackerr="ssh -i ~/server-keys/trackerr-key-pair.pem ubuntu@my-server-dns.something.com";`

With the correct address in it. 

Once you write and save to the zsh (or whatever shell) config, restart your shell. For me, it's just: 

```
# local ~ 
local$ zsh 
```

Then I can run 

```
# local ~ 
local$ ssh_trackerr
``` 

And I'm in. You should see a new shell prompt which looks like `ubuntu@ip-xxx-xx-xx-xxx:~$`. 

Now let's give Capistrano the ability to grab our app from GitHub and deploy. We've got all the information we need to configure `trackerr/config/deploy/production.rb` (thanks to [this helpful StackOveflow question](https://stackoverflow.com/questions/12967918/deploy-with-capistrano-using-a-pem-file))

```
# ~/dev/trackerr/config/deploy/production.rb 

server '3.88.0.162', user: 'ubuntu', roles: %w{web app db}
set :ssh_options, { 
  forward_agent: true, 
  auth_methods: %w[publickey],
  keys: %w[/Users/tylerwilliams/server-keys/trackerr-key-pair.pem]
}
```
## Preparing the server

Before this completely works, we need to prep the server to run the Capistrano tasks. 

Use your shiny new alias to hop in to the EC2 instance: 

```
local$ ssh_trackerr
```

Create the directory that the app will live in:

```
ubuntu$ sudo mkdir -p /var/www
```

Update all existing packages on the server:

```
ubuntu$ sudo apt-get update && sudo apt-get -y upgrade
```

Then install the dependencies required to install Ruby: 

```
# EC2 ~
ubuntu$ sudo apt install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev
```

Once those dependencies install, install rbenv. Clone the rbenv repo: 

```
# EC2 ~
ubuntu$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
```

then, add ~/.rbenv/bin to your $PATH so you can use its CLI. 

```
# EC2 ~
ubuntu$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
```

Add this command to your bash profile so you can load rbenv automatically. 

```
# EC2 ~
ubuntu$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
```

Restart bash to get those changes to apply. 

```
# EC2 ~
ubuntu$ source ~/.bashrc 
```

Then we'll install the ruby-build plugin to add `rbenv install` which simplifies the install process for new Ruby versions (which we will surely need for Rails 6)

``` 
# EC2 ~
ubuntu$ git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Now you'll be able to see all the available ruby versions with this command: 

``` 
# EC2 ~
ubuntu$ rbenv install -l
``` 

For Rails 6, we need Ruby 2.5.0 or newer. At the time of writing, Rails 6 sets it at 2.5.1

```
# EC2 ~
ubuntu$ rbenv install 2.5.1
```

The installation may take some time. This is a good spot to make some coffee. 

Up next, set your global default ruby version using 

```
# EC2 ~
ubuntu$ rbenv global 2.5.1
```

You can check with 

```
# EC2 ~
ubuntu$ ruby -v
```

Now we need to configure our ability to work with gems. First, let's turn off local documentation generation by setting our ~/.gemrc to turn off that feature. 

```
# EC2 ~
ubuntu$ echo "gem: --no-document" > ~/.gemrc
```

## Install a Javascript Runtime on EC2

The Rails Asset Pipeline requires JavaScript runtime, so let's get Node.js

```
# EC2 ~
ubuntu$ sudo add-apt-repository ppa:chris-lea/node.js
```

Then update apt-get and install the Node.js package:

```
# EC2 ~
ubuntu$ sudo apt-get update
ubuntu$ sudo apt-get install nodejs
```

## Install a Node package manager 

With Node installed, we'll want to download the [yarn](https://yarnpkg.com/en/) package manager, since Rails 6 uses it by default. 

```
# EC2 ~
ubuntu$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
ubuntu$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
ubuntu$ sudo apt-get update
ubuntu$ sudo apt-get install yarn
```

## Set up your EC2 server with your git credentials

If you're using SSH keys to access your GitHub account, you'll need to set up those credentials on your server. You can do this by following the guide at [here](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/), or you can follow along with me. 

Basically, you'll run: 

```
# EC2 ~
ubuntu$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

You'll be prompted for a file to save the key in, choose **Enter** to select the default location. 

You'll be given an option to type a secure passphrase, but it's optional, and I usually don't. 

Now you can go to `~/.ssh` and run `vim id_rsa.pub`

Copy that file, go to GitHub, click on **Settings**, then click **SSH and GPG keys**. Click **New SSH key** or **Add SSH Key**. 

Select a title, then paste you rkey into the key field. 

Click **Add SSH Key** and confirm your password at the prompt. 

## Set up NGINX 

We're going to install and configure Nginx on our server now. 

Head back to your home directory and install nginx. 

```
# EC2 ~
ubuntu$ sudo apt-get install nginx
```

Next, let's configure the default server block: 

```
# EC2 ~
ubuntu$ sudo vim /etc/nginx/sites-available/default
```

Add the following, but replace the username and application name with yours.

```
upstream app {
    # Path to Unicorn SOCK file, as defined previously
    server unix:/home/ubuntu/trackerr/shared/sockets/unicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name localhost;

    root /home/ubuntu/trackerr/public;

    try_files $uri/index.html $uri @app;

    location @app {
        proxy_pass http://app;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
    }

    error_page 500 502 503 504 /500.html;
    client_max_body_size 4G;
    keepalive_timeout 10;
}
```

Save and exit. This configures Nginx as a reverse proxy, so HTTP requests get forwarded to the Unicorn application server via a Unix socket. Feel free to make any changes as you see fit. **Make sure you overwrite the default config. The first time I did this, I just appended to the file, and I coudln't figure out what was going wrong.**

Restart Nginx: 

```
# EC2 ~
ubuntu$ sudo service nginx restart 
```

Awesome, now check it out at your Amazon IP address. 

Head back to your EC2 Resource console, and find the value listed under Public DNS (IPv4) - then paste that into your browser. 

You should be good to go! Congrats! You did it!

This post has been pretty long, but I hope you found it helpful. Again, this was a pretty limited scope and just covered how to get a new Rails 6 application up and running on a plain Amazon EC2 instance - no more. 

I'll be documenting the development of the Trackerr app on my blog here, and up next I plan to: 

1. Set up an easier way to deploy changes to the app on the server. 
2. Set up a production-level database for the application. 
3. Configure the DNS settings for the application. 
4. Actually build the application. 

*Questions? Comments? Approval? Disapproval? Send it all along to tyler@ogdenstudios.xyz*

Did you like this post? [Buy me a coffee](https://ko-fi.com/ogdenstudios)