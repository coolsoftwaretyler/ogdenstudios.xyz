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

And I'm in. 

Excellent, most of the pre-reqs are out of the way now. 

Let's start get our server ready to serve up a rails app. 

I'm going to sandbox our rails app under a specific user account. I'll need the user to have sudo privileges, so I'll create a new sudo user by following [these instructions](https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart). You can follow along there or with this blog post.

```
# local ~
local$ ssh_trackerr 

# EC2 ~
ubuntu$ sudo adduser trackerr-user
```

You'll be given some prompts. First is for a new UNIX password. This will be the user's password. Make it good, and I'd recommend using a password manager (Like [KeePass2](https://keepass.info/help/base/firststeps.html)) to generate and store it for you.

Confirm the password. You can leave the next prompts blank if you like, or fill in the information asked of you. I'm leaving them blank. 

Next we'll need to use `usermod` command to add them to the sudo group 

```
# EC2 ~
ubuntu$ sudo usermod -aG sudo trackerr-user
```

Test it out to make sure this works as expected. Use `su` to switch to the new user. 

```
# EC2 ~
ubuntu$ su - trackerr-user 
```

Now test that you can run sudo commands by running an `apt-get update`.

``` 
# EC2 ~
trackerr-user$ sudo apt-get update 
```

You'll be prompted for that password again, enter it, and you should be good to go. 

Now that we've sandboxed our rails user, given them sudo access, and updated our apt-get sources, we'll want to install Ruby on Rails so we can run our app. 

I'll be following the instructions [here](https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-18-04) - which you can follow, or you can follow along with me.

Update the package list 

```
# EC2 ~
trackerr-user$ sudo apt update
```

Run the upgrades you can (not in DigitalOcean guide, but not a bad idea)

``` 
# EC2 ~
trackerr-user$ sudo apt upgrade 
```

Then install the dependencies required to install Ruby: 

```
# EC2 ~
trackerr-user$ sudo apt install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev
```

Once those dependencies install, install rbenv. Clone the rbenv repo: 

```
# EC2 ~
trackerr-user$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
```

then, add ~/.rbenv/bin to your $PATH so you can use its CLI. 

```
# EC2 ~
trackerr-user$ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
```

Add this command to your bash profile so you can load rbenv automatically. 

```
# EC2 ~
trackerr-user$ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
```

Restart bash to get those changes to apply. 

```
# EC2 ~
trackerr-user$ source ~/.bashrc 
```

Then we'll install the ruby-build plugin to add `rbenv install` which simplifies the install process for new Ruby versions (which we will surely need for Rails 6)

``` 
# EC2 ~
trackerr-user$ git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Now you'll be able to see all the available ruby versions with this command: 

``` 
# EC2 ~
trackerr-user$ rbenv install -l
``` 

For Rails 6, we need Ruby 2.5.0 or newer. At the time of writing, Rails 6 sets it at 2.5.1

```
# EC2 ~
trackerr-user$ rbenv install 2.5.1
```

The installation may take some time. This is a good spot to make some coffee. 

Up next, set your global default ruby version using 

```
# EC2 ~
trackerr-user$ rbenv global 2.5.1
```

You can check with 

```
# EC2 ~
trackerr-user$ ruby -v
```

Now we need to configure our ability to work with gems. First, let's turn off local documentation generation by setting our ~/.gemrc to turn off that feature. 

```
# EC2 ~
trackerr-user$ echo "gem: --no-document" > ~/.gemrc
```

Install bundler, which we'll use often. 

```
# EC2 ~
trackerr-user$ gem install bundler 
```

Alright, this next part will feel somewhat familiar. We're going to go ahead and install Rails 6, *but this time, on the EC2 server*. 

So again: 

```
# EC2 ~
trackerr-user$ gem install rails --pre 
```

Since we installed a gem (Rails) which provides commands (which Rails does, and many other gems), we need to `rehash` our rbenv. Do this every time you install a **gem that installs commands**. You do not need to do this for gems without command line interfaces. 

```
# EC2 ~
trackerr-user$ rbenv rehash
```

## Install a Javascript Runtime on EC2

The Rails Asset Pipeline requires JavaScript runtime, so let's get Node.js

```
# EC2 ~
trackerr-user$ sudo add-apt-repository ppa:chris-lea/node.js
```

Then update apt-get and install the Node.js package:

```
# EC2 ~
trackerr-user$ sudo apt-get update
trackerr-user$ sudo apt-get install nodejs
```

## Install a Node package manager 

With Node installed, we'll want to download the [yarn](https://yarnpkg.com/en/) package manager, since Rails 6 uses it by default. 

```
# EC2 ~
trackerr-user$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
trackerr-user$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
trackerr-user$ sudo apt-get update
trackerr-user$ sudo apt-get install yarn
```

For the purposes of this test, we're going to use SQLite3 as a database, to avoid having to deal with postgres in our sandbox. This is a free tier EC2 instance and the Rails 6 beta, so I can't imagine your target here is to set up a production-level app which requires a serious database. When we beef up the application in future blog posts, we'll include information about setting up production-ready databases. **Do not use SQLite as a production database**. Later posts in this series will cover upgrading to a production ready database.

## Install your Rails App on EC2

Now let's get our project! 

If you're using SSH keys to access your GitHub account, you'll need to set up those credentials on your server. You can do this by following the guide at [here](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/), or you can follow along with me. 

Basically, you'll run: 

```
# EC2 ~
trackerr-user$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

You'll be prompted for a file to save the key in, choose **Enter** to select the default location. 

You'll be given an option to type a secure passphrase, but it's optional, and I usually don't. 

Now you can go to `~/.ssh` and run `vim id_rsa.pub`

Copy that file, go to GitHub, click on **Settings**, then click **SSH and GPG keys**. Click **New SSH key** or **Add SSH Key**. 

Select a title, then paste you rkey into the key field. 

Click **Add SSH Key** and confirm your password at the prompt. 

On your EC2 instance, from the folder above where you want your rails app to live, run: 

```
# EC2 ~
trackerr-user$ git clone git@github.com:<YOUR REPO HERE> trackerr
```

Now you can change into the project directory and do some set up. 

You'll have to set up master.key. Master.key is a nifty credentials setup from Rails 5.2+ 

[Here's a bit more about it](https://medium.com/cedarcode/rails-5-2-credentials-9b3324851336)

Since we control this server, we can manually add the file ourselves. 

```
# EC2 ~
trackerr-user$ cd ~/trackerr/config
trackerr-user$ vim master.key
```

On your local machine (where you have a copy of master.key), grab that key, copy it, and put it in the `master.key` file on the server. This will give you access to the secrets file as detailed in the article on master.key

```
# EC2 ~
trackerr-user$ cd ~/trackerr
trackerr-user$ bundle install 
trackerr-user$ yarn
trackerr-user$ RAILS_ENV=production bundle exec rake db:create 
trackerr-user$ RAILS_ENV production rake db:migrate 
```

**Note:** I hit a snag here on `bundle install`. When I changed into the directory and ran `bundle install`, I got an error that looked like 

```
can't find gem bundler (>= 0.a) with executable bundle (Gem::GemNotFoundException)
```

Your exact output may vary, but if you see something similar, this is because the bundler version on EC2 is different than that of the bundler version on your local machine. 

You can check the Gemfile.lock file for what version of Bundler created the lock file. It's at the bottom. 

In my case, I had Bundler 2.0.0 installed on EC2, but the Gemfile.lock file had been created with 1.17.1. 

I ran `gem install bundler -v 1.17.1` then `rbenv rehash` (remember? Since bundler adds commands, we need to rehash our rbenv). I tried `bundle install` again and it worked. 

Or rather, it almost worked. I had forgotten to install sqlite3 on the server as well, so I ran into an error during bundler install. Ruby was very generous and gave me the command to run: `apt-get install libsqlite3-dev`. 

So in the same directory, I ran: 

```
# EC2 ~
trackerr-user$ sudo apt-get install libsqlite3-dev
```

I ran `bundle install` once more, and everything came together. 

I could have re-written this guide, but I wanted to include a common error (I have made this bundler mistake... multiple times) and demonstrate that even people who write guides about web development are not infallible, despite what some folks seem to say. 

If you've had to troubleshoot like I did, here's a re-cap of the commands you should run now htat you've fixed your errors. Don't worry if you did successfully run these before and are running them again, all of them are fine to duplicate. May as well just give it a go.

```
# EC2 ~
trackerr-user$ cd ~/trackerr
trackerr-user$ bundle install 
trackerr-user$ yarn
trackerr-user$ RAILS_ENV=production bundle exec rake db:create 
trackerr-user$ RAILS_ENV=production rake db:migrate 
```

You'll notice we set RAILS_ENV to production there twice. We don't want to have to do that every time (or worse - forget we have to do that everytime). So let's add it to our bash profile. 

```
# EC2 ~
trackerr-user$ vim ~/.bashrc
```

And add `export RAILS_ENV="production"` to the bottom of your file. 

Go ahead and restart bash by running `bash`. Now check your env variables with `printenv` and make sure `RAILS_ENV="production"` appears somewhere there.

Now we need to configure Unicorn and Nginx, we'll be following the [Digital Ocean guide](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-rails-app-with-unicorn-and-nginx-on-ubuntu-14-04) from the **Install Unicorn** section down. We don't need the beginning of that article, since we've done much of that already. Here's a fun note: **I chose Unicorn because it was part of the first tutorial I found about using Nginx on EC2**. When I was going through my revision process, I realized it might make more sense to run Puma on the app. Instead of re-writing the blog post, I'll be adding future articles to convert from Unicorn to Puma on this app. I chose this route because everyone makes mistakes like this, and I want to normalize the idea that even people who write tutorials don't always make logical or optimal decisions, and understanding how to go back and refactor and fix decisions like that is an important skillset for any developer. So let's move forward with Unicorn for now (it's also not a huge deal either way, especially for our blank Rails app), and get back to deciding on an app server later on. 

This will be our first exercise in making changes to our app on a local machine and having them take effect on the server. You'll see the process is somewhat involved, and may wonder to yourself if there is a better way. Part 2 will cover the solution to this annoying procedure. 

We need to add the unicorn gem to our gemfile, so on your local machine, add a gemfile group for production. I like to put it under the block that reads something like: 

```
# local ~/dev/trackerr/Gemfile
group :test do
...
end
```

I then add: 

```
# local ~/dev/trackerr/Gemfile
group :production do
    gem 'unicorn'
end
```

And since we're loading unicorn specifically in production, it pays to be explicit about when to load puma (the default server set up in rails 6). 

I move the `gem 'puma', '~> 3.11'` line to the block which looks like: 

```
# local ~/dev/trackerr/Gemfile
group: development, :test do
    ...
end
```

Now check that there aren't any errors in development, and run 

```
# local ~/dev/trackerr
local$ bundle install
local$ rails s
```

Make sure your new gemfile didn't throw any errors, and that Puma still boots up on your development machine. 

If that's in order, let's configure Unicorn in anticipation of running it on the server. 

On your development machine, add a file to the rails app at `~/dev/trackerr/config/unicorn.rb`

For now, let's just use the standard config DigitalOcean lists: 

```
# local ~/dev/trackerr/config/unicorn.rb
# set path to application
app_dir = File.expand_path("../..", __FILE__)
shared_dir = "#{app_dir}/shared"
working_directory app_dir

# Set unicorn options
worker_processes 2
preload_app true
timeout 30

# Set up socket location
listen "#{shared_dir}/sockets/unicorn.sock", :backlog => 64

# Logging
stderr_path "#{shared_dir}/log/unicorn.stderr.log"
stdout_path "#{shared_dir}/log/unicorn.stdout.log"

# Set master PID location
pid "#{shared_dir}/pids/unicorn.pid"
```

Save the file. Commit it to git: 

```
# local ~/dev/trackerr
local$ git add .
local$ git commit -m "add unicorn configuration"
local$ git push 
```

Now I've got the gemfile and required folders set up for Unicorn to run, and it's in my repository. 

You'll notice the second command created some placeholder tx files in our `shared/` folders - this is because 


To get these changes on the server, run: 
```
# local ~/trackerr
trackerr-user$ cd ~/trackerr
trackerr-user$ git pull
```

When we created the Unicorn config, we set up the file to point to some folders which don't exist yet, so let's make those. 

Make three new folders in the root of your app. So for me, I'm going to create 

`trackerr/shared/pids`

`trackerr/shared/sockets`

`trackerr/shared/log`

By running: 

```
# EC2 ~/trackerr
trackerr-user$ mkdir -p shared/
```

Now run a `bundle install` on EC2 (this may take a bit, Unicorn is somewhat big).

Next, we'll need to create a Unicorn Init Script **on the EC2 server** - it allows us to start and stop Unicorn, and ensure that it starts on boot. 

```
# EC2 ~ 
trackerr-user$ sudo vim /etc/init.d/unicorn_trackerr
```

You'll want to copy this verbatim, but change the lines 

`USER="trackerr-user"`

and 

`APP_NAME="trackerr"`

To your user and app name, if you aren't using `trackerr-user` and `trackerr`, respectively. 

```
#!/bin/sh

### BEGIN INIT INFO
# Provides:          unicorn
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the unicorn app server
# Description:       starts unicorn using start-stop-daemon
### END INIT INFO

set -e

USAGE="Usage: $0 <start|stop|restart|upgrade|rotate|force-stop>"

# app settings
USER="trackerr-user"
APP_NAME="trackerr"
APP_ROOT="/home/$USER/$APP_NAME"
ENV="production"

# environment settings
PATH="/home/$USER/.rbenv/shims:/home/$USER/.rbenv/bin:$PATH"
CMD="cd $APP_ROOT && /home/$USER/.rbenv/shims/bundle exec unicorn -c config/unicorn.rb -E production -D"
PID="$APP_ROOT/shared/pids/unicorn.pid"
OLD_PID="$PID.oldbin"

# make sure the app exists
cd $APP_ROOT || exit 1

sig () {
  test -s "$PID" && kill -$1 `cat $PID`
}

oldsig () {
  test -s $OLD_PID && kill -$1 `cat $OLD_PID`
}

case $1 in
  start)
    sig 0 && echo >&2 "Already running" && exit 0
    echo "Starting $APP_NAME"
    su - $USER -c "$CMD"
    ;;
  stop)
    echo "Stopping $APP_NAME"
    sig QUIT && exit 0
    echo >&2 "Not running"
    ;;
  force-stop)
    echo "Force stopping $APP_NAME"
    sig TERM && exit 0
    echo >&2 "Not running"
    ;;
  restart|reload|upgrade)
    sig USR2 && echo "reloaded $APP_NAME" && exit 0
    echo >&2 "Couldn't reload, starting '$CMD' instead"
    $CMD
    ;;
  rotate)
    sig USR1 && echo rotated logs OK && exit 0
    echo >&2 "Couldn't rotate logs" && exit 1
    ;;
  *)
    echo >&2 $USAGE
    exit 1
    ;;
esac
```

Update the script's permissions and enable Unicorn to start on boot:

```
# EC2 ~
trackerr-user$ sudo chmod 755 /etc/init.d/unicorn_trackerr
trackerr-user$ sudo update-rc.d unicorn_trackerr defaults
```

We can finally start unicorn by running: 

```
# EC2 ~
trackerr-user$ sudo service unicorn_trackerr start
```

Now Unicorn is running, but we can't access it from the internet at large until we configure Nginx

Set up NGINX 

We're going to install and configure Nginx on our server now. 

Head back to your home directory and install nginx. 

```
# EC2 ~
trackerr-user$ sudo apt-get install nginx
```

Next, let's configure the default server block: 

```
# EC2 ~
trackerr-user$ sudo vim /etc/nginx/sites-available/default
```

Add the following, but replace the username and application name with yours.

```
upstream app {
    # Path to Unicorn SOCK file, as defined previously
    server unix:/home/trackerr-user/trackerr/shared/sockets/unicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name localhost;

    root /home/trackerr-user/trackerr/public;

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
trackerr-user$ sudo service nginx restart 
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