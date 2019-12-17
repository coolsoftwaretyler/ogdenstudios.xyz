---
layout: post
title:  "How to fix Ruby 'Library not loaded' error with Readline on Mac OSX"
tags: [ruby, rails, error, fix, 'post']
description: "Sometimes Ruby installations break when Homebrew updates. Reinstalling Ruby should fix the problem."
---

At this point, I've had this error happen to me twice. Each time I've fixed it, and each time I have forgotten how I fixed it the previous time. This post is mostly for posterity for my own sake. 

[This stackoverflow clinched it](https://stackoverflow.com/questions/54261455/library-not-loaded-usr-local-opt-readline-lib-libreadline-7-dylib). 

When Ruby gets installed, it compiles with system binaries at time of installation. When homebrew updates and changes those paths, some things get out of whack. Reinstalling Ruby with current dependencies fixes it. 

Run 

```
ruby -v
```

Grab the ruby version and then reinstall. 

With rbenv: 

```
rbenv install 2.x.x
```

With rvm: 

```
rvm reinstall 2.x.x
```

This fixed the `Libary not loaded . . . Reason: image not found` error when running `rails c` and `rails s`. 