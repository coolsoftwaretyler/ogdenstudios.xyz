---
layout: post
title: How do I convert a WordPress site to a static site? 
category: ["WordPress"]
date: 2019-02-05
---

I had a WordPress site I used to manage that I wanted to archive and host statically. I tried multiple WordPress plugins to accomplish this job, including [Simply Static](https://wordpress.org/plugins/simply-static/) and [WP2Static](https://wordpress.org/plugins/static-html-output-plugin/). Neither of which worked very well: Simply Static hadn't been tested with the latest WordPress version and didn't correctly scrape all the files. WP2Static took too long to analyze and scrape my site. 

There's a much simpler way to accomplish this goal using wget. Here's how:

1. Install [wget](https://www.gnu.org/software/wget/) on your computer 
2. Make a directory you'd like to hold your wget output (I like to make sure I have container directory, because if you accidentally pass the wrong arguments to wget, you'll end up downloading a LOT of website information, and that can get messy).
3. Run: 
```
wget --page-requisites --convert-links --adjust-extension --mirror --span-hosts --domains=your-wordpress-website.com your-wordpress-website.com
```

4. Check the output works with a local webserver: `python -m SimpleHTTPServer 8000` 
5. Upload your output to a static site host such as [GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/), or [Amazon S3](https://aws.amazon.com/getting-started/projects/host-static-website/).