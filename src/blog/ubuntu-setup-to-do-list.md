---
layout: post
title: 'My Ubuntu Setup To-Do List'
tags: ['ubuntu', 'tools', 'post']
description: 'Whenever I find myself with a new Ubuntu install, this is what I do to set it up.'
date: 2020-02-04
---

Recently I realized my life would be easier if I dual-booted Windows 10 and Ubuntu. I tried out [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and it just wasn't quite for me. My biggest pain points were: 

* It's slow
* It's sometimes confusing to figure out where I am in the working directory
* The rules about what can and can't write where are confusing 
* Writing automated browser tests for my applications is __not__ easy

That last one is critical. 

So I grabbed my Ubuntu 18.04 livedisk, partitioned off a chunk of my hard drive, and started the installation. 

The process wasn't painless by any means. My first live disk got corrupted and silently failed for hours. When I finally remade the live disk and completed the installation, I goofed up a few settings borked my graphics driver because of secure boot and UEFI settings. On my third installation, I got it right. 

Between my second and third installations, I lost a lot of configuration work. I don't want to lose that information again, so here's just a list of everything I need to make my development machine inhabitable. It's not comprehensive: I usually find the best way to install stuff is to wait until I need it and figure it out then. But this is a solid baseline for my Ubuntu installs

* [Vim](https://www.vim.org/download.php)
* [git](https://git-scm.com/downloads)
* [Create an SSH key and link it to GitHub](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) 
* [KeePassX](https://www.keepassx.org/)
* [VSCode](https://code.visualstudio.com/)
* [Slack](https://slack.com/)s
* [Zsh](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH)
* [Oh-My-Zsh](https://github.com/ohmyzsh/ohmyzsh)
* [An Oh-My-Zsh theme](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)
* [rbenv](https://github.com/rbenv/rbenv#how-rbenv-hooks-into-your-shell)
* [ruby-build](https://github.com/rbenv/ruby-build#installation)
* [NVM](https://github.com/nvm-sh/nvm)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
* [A fun Gnome theme](https://www.gnome-look.org/p/1238825/#files-panel)

That's it! Each of these steps usually comes with its own little config steps and options, but I find my preferences change over time. This list is pretty static and includes everything I need to get up and running. 