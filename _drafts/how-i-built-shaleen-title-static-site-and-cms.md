---
layout: post
title: 'How I built shaleentitle.com'
tags: []
description: ''
---
*Last updated May 6, 2019*

## Summary 

If Shaleen Title wanted to replace Ogden Studios or if Ogden Studios becomes unavailable to continue working on shaleentitle.com, a replacement developer would need the following skillsets: 

### Mandatory 

1. Understanding how websites work: DNS configuration, hosting solutions, HTML, CSS, JavaScript
2. Understanding how git repositories and GitHub work 

### Highly recommended (can get by without, but shouldn't)

1. Able to use the command line and command line interfaces
2. Understand how static site generators and site build processes work 
3. Familiarity with some web development framework and the ability to create a full website themselves 

### Nice to have

1. A background working with Jekyll and/or Ruby 
2. An understanding of continuous deployment, build tools, and CDNs 
3. Experience working with Netlify and Forestry

## Built with Jekyll 
[Shaleen Title's website](https://www.shaleentitle.com/) is built in [Jekyll](https://jekyllrb.com). Jekyll is a [static site generator](https://www.staticgen.com/). Static site generators take settings, markup, and content in a file directory and generate a website directory containing only HTML, CSS, JavaScript, and static assets. 

Overall, Static site generators allow us tremendous power for: 

### Version control 

Since static site generators wrap all their settings, markup, and content in one directory, we can turn that directory into a [git repository](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F). A git repository allows us to have snapshots of the project throughout time, and even create experimental branches where we can test out new ideas without worrying about breaking production code or losing old work. 

If we wanted to, we could revert the git repository (and therefore the entire site) to any snapshot throughout its history. And a git repository is just a file directory with metadata, so that repo can be stored and backed up anywhere. For the time being, the shaleentitle.com repository lives at the [Ogden Studios GitHub](https://github.com/ogdenstudios/shaleen-title). 

### Backups 

Another advantage of the source code being a git repository is that it can easily be **forked** (copied to another GitHub or other git service), **cloned** (programmatically duplicated on someone else's machine), or just plain downloaded for backup. 

No matter what, any of those actions will retain the data needed to back up, restore, and deploy the website. 

### Maintenance

Keeping the site in a git repository allows other people to safely and easily collaborate. People can fork, clone, or otherwise work on the site on their own **branches** without modifying the production code. They can run it on their local computer to double-check changes and make sure everything looks as intended. Right now, Ogden Studios has the keys to the deployment pipeline. That's all managed through the Ogden Studios GitHub and Netlify accounts, but can be transferred with the click of a button if needed.

## Deployed on Netlify 

When changes to the git repository are accepted to the **master branch**, they are automatically sent to [Netlify](https://www.netlify.com/) for deployment. Netlify reads all the files from the GitHub repository, runs the **Jekyll** build command on them, and compiles the production code for the site. Then, Netlify takes that code and deploys it to their own [content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network). Since everything the site needs to work lives inside a file directory, that directory can live entirely on the CDN. CDNs push static assets to localized servers. When people visit [https://www.shaleentitle.com](), the data is sent back to them from the nearest server. This reduces time needed for website requests and tremendously improves speed. 

**Netlify is entirely free to use**. The limitation being that the free tier service only allows one person to interact with it. Since Shaleen Title's website is small enough to only require one developer, this works out fine. If it was large and had a team of developers, there are [professional paid plans](https://www.netlify.com/pricing/) that allow for multiple collaborators and some advanced features. For the foreseeable future, there's no need to upgrade to these advanced features. 

Netlify has specific instructions for DNS configuration. Shaleen Title owns the shaleentitle.com domain name and points it to Netlify for resolution.

## Content management

Jekyll stores all of its content in [Markdown](https://en.wikipedia.org/wiki/Markdown) and [YAML](https://en.wikipedia.org/wiki/YAML) files. These files can be edited directly by a developer who understands how to use git commands and write Markdown and YAML. Blog posts live in the `_posts` directory. News posts live in the `_news` directory. Award information is stored in `_data/awards.yml` and media hits are stored at `_data/media.yml`. 

Page can be created, edited, or deleted by adding Markdown files in the root of the directory and providing at the very minimum a `layout` option. Page markdown files can contain other metadata and even content to be rendered based on the template selected. 

This is all very developer-friendly, and is exactly how the [Ogden Studios website](https://ogdenstudios.xyz) maintains its content. But for people less comfortable in command lines, git, and code, we've set up an account with [Forestry](https://forestry.io/) to provide an end-user friendly content management system. 

Forestry uses GitHub authentication to get access to the origin git repository of the site. It then writes configuration in a hidden directory called `.forestry` in the repository. Like every other piece of this static site, that directory lives in the file system and github repository and can be version-controlled, backed up, and edited with ease. 

Once Forestry has a connection to the git repository, an administrator (in this case, Ogden Studios), can configure it to define the types of content the site has. This is mostly a process of telling Forestry "Here is where we keep posts, and here is the type of metadata a post can have. Here is where news, awards, media hits, and pages live. Here are the possible options and configuration they all have". Those settings are stored in the `.forestry` directory. The Forestry site reads this data and then allows users to manage content according to the defined guidelines. 

Forestry is also [free for small projects](https://forestry.io/pricing/). There are plans that increase functionality for more money, but as with Netlify's pricing scheme: there is really no need for shaleentitle.com to upgrade to the paid service. 

## RSS Feeds 

Users can subscribe to updates using the RSS feeds for posts and news updates. These live at [www.shaleentitle.com/feed/posts.xml] and [www.shaleentitle.com/feed/news.xml], respectively. The feeds are generated using the [Jekyll Feed plugin](https://github.com/jekyll/jekyll-feed). 

## Limitations and solutions 

### Migrating from Jekyll 

**Limitation:** The entire site is built on Jekyll, so there are some dependencies there. Site configuring lives in `_config.yml` along with the `_redirects` and `_headers` files. These files work specifically with Jekyll, and setting sitewide configuration, headers, and redirects have to be done from the ground up if moving to another framework. 

**Solution:** If Shaleen or another developer decided they didn't want to use Jekyll anymore, most of the content lives as [Markdown](https://en.wikipedia.org/wiki/Markdown) and [YAML](https://en.wikipedia.org/wiki/YAML) files. The markup of the site is almost entirely HTML, with only a few pieces of Jekyll-specific markup included. Ogden Studios has avoided using platform specific syntax wherever possible, to make the site portable and maintainable across different site generators or frameworks. 

### Storing sensitive information 

**Limitation: Everything in the git repository is public to view, and is compiled and deployed publicly**. There are no credentials, logins, etc. required to build, deploy, and run the site. As such, this is not a major concern at the moment. But generally, the git repo and website is not a secure place to store sensitive information. **Sensitive information must never be checked into version control under any circumnstances**. 

**Solution:** If a developer needed to store sensitive information or use secure credentials, they can use [environment variables](https://www.netlify.com/docs/continuous-deployment/#environment-variables) with Netlify.  And finally, if Shaleen needs secure long-term storage, she should consider something like [Dropbox](https://www.dropbox.com).  

### Moving the git repository 

**Limitation:** Ogden Studios controls the master GitHub repository for shaleentitle.com from the @ogdenstudios account, to which Shaleen Title does not have access to. 

**Solution:** Shaleen Title legally owns the license to the website. At her request, Ogden Studios must transfer the repository over to any other party she sees fit, and relinquish credentials. That process is [relatively simple](https://help.github.com/en/articles/transferring-a-repository) and doesn't present many technical challenges. 

### Moving the deployment pipeline and CMS 

**Limitation:** As with the git repository itself, the Netlify and Forestry accounts are connected to the Ogden Studios GitHub account. Shaleen Title has a "guest" account in Forestry, and no login to Netlify. 

**Solution:** As with the git repository - these assets are property of Shaleen Title. [Transferring a Netlify site](https://www.netlify.com/docs/teams/) is a bit more involved than the GitHub transfer, although Shaleen Title could just point shaleentitle.com to a new Netlify deploy administered by a different developer and the current Netlify site would no longer live at shaleentitle.com. Transferring a Forestry site is less straightforward. Fortunately, the configuration files are version controlled and stored in the git repository. As such, setting up a new Forestry site would be an easy solution, and something that Ogden Studios doesn't have exclusive control over. 

### Adding robust server-side capabilities 

**Limitation:** Executing scheduled tasks, running server-side scripts, and other more powerful features aren't really available through a Jekyll site. 

**Solution:** There are a lot of clever solutions that allow developers to create [AWS Lambda functions](https://aws.amazon.com/lambda/) and temporarily run server-side code in the cloud from an AWS account. Again, Netlify provides a [very useful API for this kind of thing](https://www.netlify.com/docs/functions/).