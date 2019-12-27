---
layout: post
title: PG::ConnectionBad - could not connect to server No such file or directory (Mac OSX)
tags: ["postgres", 'post', 'rails', 'tidbit']
description: "Sometimes my Rails server doesn't connect to PostgreSQL. This is usually the queick fix for my environment on OSX."
date: 2019-12-27
---

I get this error when I haven't correctly shut down my Rails server or PostgreSQL database. Your mileage may vary on the solution. I always find myself coming back to [this StackOverflow post](https://stackoverflow.com/questions/19828385/pgconnectionbad-could-not-connect-to-server-connection-refused) and all I really have to do is run: 

```
sudo rm /usr/local/var/postgres/postmaster.pid
brew services restart postgresql 
```

And that does the trick! Good luck out there. 