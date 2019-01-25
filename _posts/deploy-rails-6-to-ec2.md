Sources: 
https://medium.com/@manishyadavv/how-to-deploy-ruby-on-rails-apps-on-aws-ec2-7ce55bb955fa

https://groups.google.com/forum/#!msg/rubyonrails-talk/IsOAQIB5Dkw/8BnbFbKBCwAJ

First you need to get rails 6 

I'm going to use my actual commands and project names, so you may have to do some swapping based on your platform and use cases. 

Get the latest rails gem(s).

```
# Any terminal 
gem install rails --pre 
```

Then you need to make a new project with the Rails 6 beta 

```
# In a terminal, in a directory you want above your project folder 
rails _6.0.0beta1_ new trackerr
```

Change into your project directory 

```
# In a directory above project folder
cd tracker 
```

An initial `bundle install` never hurts

``` 
# trackerr/
bundle install 
```

Check that it works 

```
# trackerr/
rails s
```

Nice, it works (include screenshot 1)

This is my favorite place for an init commit in git. It's fresh, it's new, it works. I haven't broken anything yet. Let's make the initial commit. 

```
# trackerr/
git add . 
git commit -m "init commit"
```

I use GitHub for my repositories, so YMMV, but I like to get this checked into GitHub ASAP. 

[Link to how to make a github repo]

GitHub.com 
Plus button
New Repository 
Name it `trackerr`
Add a description `Full Suite State Legislation Tracker`
I'll keep it public, because I love open source. 
Don't initialize the repo, you've already got one on your machine. 
Follow their instructions for pushing an existing repo from command line 

I use SSH keys for my GitHub access, here's a good guide on how
[Insert GitHub SSH guide]

```
git remote add origin git@github.com:<YOUR ADDRESS HERE>
git push -u origin master 
```

Voila, you've got a Rails 6 project installed on your machine and checked in to your GitHub. Up next, we'll set up an EC2 instance, configure it a bit, and then launch this barebones app to it. 

Go to Amazon AWS Console 

`https://console.aws.amazon.com/console/home?region=us-east-1`

Sign in, or sign up. 

Once you're logged in and have an account ready to go, click **Services**. 

In the dropdown menu, select **EC2** under the **Compute** menu. 

On this new page, click **Launch Instance**. 

Since we're all about bleeding edge tech, let's choose the **Ubuntu Server 18.04 LTS (HVM), SSD Volume Type**. 

Click the **Select** button. 

Since this is a starter project, I"m going to choose the t2.micro instance, eligible for the free tier. 

Click **Next: Configure Instance** - nothing to change here, unless you want to. 

Click **Next: Add Storage** - I'm going to keep the defaults here, as well, since this is really just a proof of concept kind of thing. 

Click **Next: Add Tags** - again, nothing to go here. 

Click **Next: Configure Security Group** 

1. Select the **Create a new security group** radio button 
2. There's already an SSH open on port 22 to 0.0.0.0/0
    - Amazon will tell you this is insecure, and they're right. This allows people to connect via SSH from anywhere on the internet. If you have the ability to lock down your own IP address, you should choose a restricted SSH set, and limit it to your IP. I won't go into that, and for now we aren't setting up anything sensitive enough to really go wrong here. 
3. Next, add a new rule. Here's what I chose: 
    - Image of port selection. 
    - Keeping this open to the world is desired behavior - you want anyone to be able to access your site, once it's up. 

Click **Review and Launch** 

Confirm everything looks the way you want, and finally click **Launch**. 

Amazon will ask you to select an existin gkey pari or create a new key pair. I'm assuming you either haven't done this before (and therefore have no key pair), or, like me, are trying to set up a fully sandboxed Rails App. So let's select *Create a new key pair*. 

Name it. I'm naming mine *trackerr-key-pair*

Click **Download Key Pair**. 

    - Image of key pair dialogue. 

Save the file. 

Click **Launch Instances**. 

Once the instances launch, amazon will give you an option to view it (along with a lot of other helpful information you should check out). 

I like to name my EC2 instances. If you click on the link provided by Amazon pointing to your instance, you can view your EC2 console. 

Under the **Name** column, you can click the pencil icon to edit its name. I chose *Trackerr*. Here's what my Resource Groups look like after that. 

    - Image of resource groups. 

Great! Now you've got a Rails App on your machine and in GitHub, and you have a plain EC2 instance running on AWS. It's almost time to marry them together. 

Before we get to that, though, let's set up access to the server to make it convenient to check in on. 

First, find that `.pem` key file you downloaded from Amazon. I'm on a Mac + FireFox, so mine ended up in ~/Downloads 

I personally like to keep these kinds of files in ~/server-keys - which may or may not be great SecOps. I guess one day I'll find out. 

So go ahead and make a folder called `server-keys` (or whatever you like) and drop it in your home directory (or wherever you like). 

You'll need to make your key not publicly viewable. To make sure that's the case, run 

```
# ~/server-keys/
chmod 400 trackerr-key-pair.pem
```

Then you'll want to connect to your instance using its Public DNS. 

The command looks like `ssh -i "tracker-key-pair.pem" ubuntu@some-dns.computer.amazon.aws` (not the actual address). 

If you need a more specific command for your keypair name and DNS address, click the **Connect** button in the Amazon Resource Groups panel. Seen here. 

    - Connect panel button. 

Make sure that all works. If so, you're in good shape. At this point you: 

1. Have a Rails 6 app on your computer/in GitHub. 
2. Have an Amazon EC2 instance running
3. Have SSH access to your Amazon EC2 instance. 

Let's make that SSH access even more convenient by setting up an alias. I use [zsh](link here), so I'm going to open up my .zshrc file. 

In command line: 

`vim ~/.zshrc`

I'm not great with VIM, but I'm learning, and I love it. You can edit this file using any text editor you like. 

Everyone's zsh config is going to be different. Towards the bottom of my file, I'm going to add: 

`alias ssh_trackerr="ssh -i ~/server-keys/trackerr-key-pair.pem ubuntu@my-server-dns.something.com";`

With the correct address in it. 

If you want to know how to do that VIM, check out [link], and if you want to know what's up with different shell configurations, check out [link]. 

Once you write and save to the zsh (or whatever shell) config, restart your shell. For me, it's just: 

```
# Any directory 
zsh 
```

Then I can run 

```
# Any directory 
ssh_trackerr
``` 

And I'm in. 

Excellent, most of the pre-reqs are out of the way now. 

Let's start getting our server ready to serve up a rails app. 

I'm going to sandbox our rails app under a specific user account. I'll need the user to have sudo privileges, so I'll create a new sudo user 

[https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart]

Run 

```
# Local machine 
ssh_trackerr 
# EC2 Instance 
sudo adduser trackerr-user
```

You'll be given some prompts. First is for a new UNIX password. This will be the user's password. Make it good, and I'd recommend using a password manager (Like KeePass2) to store it (or even generate it for you)

Confirm the password, and I leave the info prompts blank. 

Next we'll need to use `usermod` command to add them to the sudo group 

```
# EC2
sudo usermod -aG sudo trackerr-user
```

Test it out to make sure this works as expected. Use `su` to switch to the new user. 

```
# EC2 
su - trackerr-user 
```

Now test that you can run sudo commands with something innocuous like 

``` 
# EC2 - as trackerr-user 
sudo apt-get update 
```

You'll be prompted for that password again, enter it, and you should be good to go. 

Now that we've sandboxed our rails user, given them sudo access, and updated our apt-get sources, we'll want to install Ruby on Rails so we can run our app. 

I'll be following the instructions at https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-18-04

Update the package list 

```
# EC2 - as trackerr-user
sudo apt update
```

Run the upgrades you can (not in DigitalOcean guide, but not a bad idea)

``` 
# EC2- as trackerr-user
sudo apt upgrade 
```

Then install the dependencies required to install Ruby: 

```
# EC2 - as trackerr-user 
sudo apt install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev
```

Once those dependencies install, install rbenv. Clone the rbenv repo: 

```
# EC2- as trackerr-user 
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
```

then, add ~/.rbenv/bin to your $PATH so you can use its CLI. 

```
# EC2 - as trackerr-user 
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
```

Add this command to your bash profile so you can load rbenv automatically, as well. 

```
# EC2 - as trackerr-user 
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
```

Restart bash to get those changes to apply. 

```
# EC2- as trackerr-user 
source ~/.bashrc 
```

Then we'll install the ruby-build plugin to add `rbenv install` which simplifies the install process for new Ruby versions (which we will surely need for Rails 6)

``` 
# EC2 - as trackerr-user 
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Now you'll be able to see all the available ruby versions with this command: 

``` 
# EC2 - as trackerr-user 
rbenv install -l
``` 

For Rails 6, we need Ruby 2.5.0 or newer. At the time of writing, Rails 6 sets it at 2.5.1

```
# EC2 - as trackerr-user 
rbenv install 2.5.1
```

The installation may take some time. This is a good spot to make some coffee. 

Up next, set your global default ruby version using 

```
# EC2 - as trackerr-user 
rbenv global 2.5.1
```

You can check with 

```
# EC2 - as trackerr-user 
ruby -v
```

Now we need to configure our ability to work with gems. First, let's turn off local documentation generation by setting our ~/.gemrc to turn off that feature. 

```
# EC2 - as trackerr-user 
echo "gem: --no-document" > ~/.gemrc
```

Install bundler, which we'll use often. 

```
# EC2 - as trackerr-user 
gem install bundler 
```

Alright, this next part will feel somewhat familiar. We're going to go ahead and install Rails 6, *but this time, on the EC2 server*. 

So again: 

```
# EC2 - as trackerr-user 
gem install rails --pre 
```

Since we installed a gem (Rails) which provides commands (which Rails does, and many other gems), we need to `rehash` our rbenv. Do this every time you install a **gem that installs commands**. You do not need to do this for gems without command line interfaces. 

```
# EC2 - as trackerr-user 
rbenv rehash
```

Install a Javascript Runtime

The Rails Asset Pipeline requires JavaScript runtime, so let's get Node.js

```
# EC2 - as trackerr-user 
sudo add-apt-repository ppa:chris-lea/node.js
```

Then update apt-get and install the Node.js package:

```
# EC2 - as trackerr-user 
sudo apt-get update
sudo apt-get install nodejs
```

With Node installed, we'll want to download the [yarn] package manager, as it's what Rails 6 default to. 

```
#EC2 - as trackerr-user 
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn
```

For the purposes of this test, we're going to use SQLite3 as a database, to avoid having to deal with postgres in our sandbox. This is a free tier EC2 instance and the Rails 6 beta, so I can't imagine your target here is to set up a production-level app which requires a serious database. If it is, you're probably more qualified than I am to write about setting up the database. 

Now let's get our project! 

If you're using SSH keys to access your GitHub account, you'll need to set up those credentials on your server. You can do this by following the guide at [https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/]

Basically, you'll run: 

```
# EC2 - as trackerr-user 
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

You'll be prompted for a file to save the key in, choose **Enter** to select the default location. 

You'll be given an option to type a secure passphrase, but it's optional, and I usually don't. 

Now you can go to `~/.ssh` and run `vim id_rsa.pub`

Copy that file, go to GitHub, click on **Settings**, then click **SSH and GPG keys**. Click **New SSH key** or **Add SSH Key**. 

Select a title, then paste you rkey into the key field. 

Click **Add SSH Key** and confirm your password at the prompt. 

On your EC2 instance, from the folder above where you want your rails app to live, run: 

```
# EC2 - as trackerr-user, in home directory 
git clone git@github.com:<YOUR REPO HERE> trackerr
```

Now you can change into the project directory and do some set up. 

You'll have to set up master.key. Master.key is a nifty credentials setup from Rails 5.2+ 

[Here's a bit more about it](https://medium.com/cedarcode/rails-5-2-credentials-9b3324851336)

Since we control this server, we can manually add the file ourselves. 

```
# EC2 - as trackerr-user
cd ~/trackerr/config
vim master.key
```

On your local machine (where you have a copy of master.key), grab that key, copy it, and put it in the `master.key` file on the server. This will give you access to the secrets file as detailed in the article on master.key


```
# EC2 - as trackerr-user 
cd ~/trackerr
bundle install 
yarn
RAILS_ENV=production bundle exec rake db:create 
rake db:migrate RAILS_ENV production
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
# EC2 - as trackerr-user 
sudo apt-get install libsqlite3-dev
```

I ran `bundle install` once more, and everything came together. 

I could have re-written this guide, but I wanted to include a common error (I have done this... multiple times) and demonstrate that even people who write guides about web development are not infallible, despite what some folks seem to say. 

If you've had to troubleshoot like I did, here's what we need to run, now that everything is in the right place: 

```
# EC2 - as trackerr-user 
cd ~/trackerr
bundle install 
yarn
RAILS_ENV=production bundle exec rake db:create 
rake db:migrate RAILS_ENV production
```