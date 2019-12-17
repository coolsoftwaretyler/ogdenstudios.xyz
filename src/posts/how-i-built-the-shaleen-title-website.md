---
layout: post
title: 'How I built shaleentitle.com'
description: 'A write up on how I built the Shaleen Title website with Jekyll, Netlify and Forestry.'
tags: ['static site generators', 'jekyll', 'forestry', 'netlify', 'forestry', 'post']
date: 2019-06-04
---
*Last updated June 4, 2019*

One of my favorite things about static site generators is how easily extensible they are. You can start a project with just what you need (data, markup, styles), and slowly add functionality as the scope expands. 

[Shaleen Title's website](https://www.shaleentitle.com) is a great example of that. My first project with her was standing up a Jekyll site with a clean and simple design. She periodically asked for small content updates, but as she began to ask for an increasing number of updates over time, it became clear that a content management system would improve our productivity. Adding a CMS to the site proved to be a quick job. 

Overall, this kind of work flow is my go-to for most clients. Here's what my process looked like:

## Built with Jekyll 

The website is built with [Jekyll](https://jekyllrb.com). Jekyll is a [static site generator](https://www.staticgen.com/). Static site generators allow developers to define settings, markup, and content and create HTML, CSS, and JavaScript. The output from a static site generator is everything a website needs to render to end users. 

Overall, Static site generators allow a tremendous amount of power for:

### Version control 

Since static site generators wrap all their settings, markup, and content in one directory, we can turn that directory into a [git repository](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F). A git repository (repo) allows us to have snapshots of the project throughout time. It also allows us to create experimental branches where we can test out new ideas without worrying about breaking production code or losing old work. 

If we wanted to, we could revert the git repository (and therefore the entire site) to any snapshot throughout its history. Since a git repository is just a file directory with metadata, that repo can be stored and backed up anywhere. For the time being, the shaleentitle.com repository lives on the [Ogden Studios GitHub](https://github.com/ogdenstudios/shaleen-title). 

### Backups 

Another advantage of the source code being a git repository is that it can be **forked** (copied to another GitHub or other git service), **cloned** (duplicated on someone else's machine), or just plain **downloaded** for backup. 

No matter what, any of those actions will retain the data needed to back up, restore, and deploy the website. 

### Maintenance

Keeping the site in a git repository allows other people to safely and easily collaborate. People can fork, clone, or otherwise work on the site on their own **branches** without modifying the production code. They can run it on their local computer to double-check changes and make sure everything looks as intended. That's all managed through the Ogden Studios GitHub and Netlify accounts, but can be transferred with the click of a button if Shaleen ever decides to work with another web developer or take full autonomy of her website herself.

## Deployed on Netlify 

When changes to the git repository are accepted to the **master branch**, they are automatically sent to [Netlify](https://www.netlify.com/) for deployment. Netlify reads all the files from the GitHub repository and runs the `jekyll` build command. Then, Netlify takes that code and deploys it to their own [content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network). Since everything the site needs to work lives inside a file directory, that directory can live entirely on the CDN. CDNs push assets to localized servers. When people visit [https://www.shaleentitle.com](https://www.shaleentitle.com), the website is sent to them from the nearest server. This tremendously improves the speed of the website. 

**Netlify is free**. The limitation being that the free tier service only allows one person to manage the website. Since Shaleen's website is small enough to only require one developer, this works out fine. If it was larger and had a team of developers, there are [professional paid plans](https://www.netlify.com/pricing/) that allow for multiple collaborators and some advanced features. 

We point `shaleentitle.com` to the Netlify servers to use the custom domain, [as documented on Netlify](https://www.netlify.com/docs/custom-domains/). 

## Content management

Jekyll stores all of its content in [Markdown](https://en.wikipedia.org/wiki/Markdown) and [YAML](https://en.wikipedia.org/wiki/YAML) files. These files can be edited directly by a developer who understands how to use git and write Markdown/YAML. Blog posts live in the `_posts` directory. News posts live in the `_news` directory. Award information is stored in `_data/awards.yml` and media hits are stored at `_data/media_hits.yml`. 

Page can be created, edited, or deleted by adding Markdown files in the root of the directory and providing a `layout` option. Page markdown files can contain other metadata and even content to be rendered based on the template selected. 

This is all very developer-friendly and a joy to work with as a web dev. But for people less comfortable in command lines, git, and code, we've set up an account with [Forestry](https://forestry.io/) to provide an end-user friendly content management system. 

Forestry uses GitHub authentication to get access to the origin repo. It then writes configuration in a hidden directory called `.forestry` inside the repo. Like every other piece of this static site, that directory can be version-controlled, backed up, and edited with ease. 

Once Forestry has a connection to the git repository, an administrator (in this case, Ogden Studios), can configure it to define the types of content the site has. This is mostly a process of telling Forestry *"Here is where we keep posts, and here is the type of metadata a post can have. Here is where news, awards, media hits, and pages live. Here are the possible options and configuration they all have"*. Those settings are stored in the `.forestry` directory. The Forestry site reads this data and then allows users to manage content according to the defined guidelines. 

Forestry is also [free for small projects](https://forestry.io/pricing/). And of course, as the project needs grow, there are more advanced plans we could purchase.

## RSS Feeds 

Users can subscribe to updates using the RSS feeds for posts and news updates. These live at [www.shaleentitle.com/feed/posts.xml](www.shaleentitle.com/feed/posts.xml) and [www.shaleentitle.com/feed/news.xml](www.shaleentitle.com/feed/news.xml), respectively. The feeds are generated using the [Jekyll Feed plugin](https://github.com/jekyll/jekyll-feed). 

## Limitations and solutions 

### Migrating from Jekyll 

**Limitation:** The entire site is built with Jekyll, so there are some dependencies there. Site configuration lives in `_config.yml` along with the `_redirects` and `_headers` files. These files work specifically with Jekyll, and setting sitewide configuration, headers, and redirects would have to be done from the ground up if moving to another framework.

**Solution:** If Shaleen or another developer decided they didn't want to use Jekyll anymore, most of the content lives as [Markdown](https://en.wikipedia.org/wiki/Markdown) and [YAML](https://en.wikipedia.org/wiki/YAML) files. The markup of the site is almost entirely HTML, with only a few pieces of Jekyll-specific markup included. I've avoided using platform specific syntax wherever possible, to make the site portable and maintainable across different site generators or frameworks. 

### Storing sensitive information 

**Limitation: Everything in the git repository is public to view, and is compiled and deployed publicly**. There are no credentials, logins, etc. required to build, deploy, and run the site. Shaleen doesn't have any sensitive content stored here, so it's not an issue at the moment. But generally, the git repo is not a secure place to store sensitive information. **Sensitive information must never be checked into version control under any circumnstances**. 

**Solution:** If a developer needs to store sensitive information or credentials, they can use [environment variables](https://www.netlify.com/docs/continuous-deployment/#environment-variables) with Netlify.

### Moving the git repository 

**Limitation:** Ogden Studios controls the master GitHub repository for shaleentitle.com from the @ogdenstudios account. Shaleen Title doesn't have direct access to the source code.

**Solution:** At Shaleen's request, Ogden Studios can transfer the repository over to any other party she sees fit, and relinquish credentials for it. That process is [relatively simple](https://help.github.com/en/articles/transferring-a-repository) and doesn't present many technical challenges. 

### Moving the deployment pipeline and CMS 

**Limitation:** As with the git repository itself, the Netlify and Forestry accounts are connected to the Ogden Studios GitHub. Shaleen Title has a "guest" account in Forestry, and no login to Netlify. 

**Solution:** As with the git repository, Ogden Studios can transfer these assets at Shaleen's request. [Transferring a Netlify site](https://www.netlify.com/docs/teams/) is a bit more involved than the GitHub transfer, although Shaleen Title could just point shaleentitle.com to a new Netlify deploy administered by a different developer and the current Netlify site would no longer live at shaleentitle.com. Transferring a Forestry site is less straightforward. Fortunately, the configuration files are version controlled and stored in the git repository. As such, setting up a new Forestry site would be an easy solution. 

### Adding server-side capabilities 

**Limitation:** Executing scheduled tasks, running server-side scripts, and other more powerful features aren't really available through a Jekyll site. 

**Solution:** There are a lot of clever solutions that allow developers to create [AWS Lambda functions](https://aws.amazon.com/lambda/) and temporarily run server-side code in the cloud from an AWS account. Again, Netlify provides a [very useful API for this kind of thing](https://www.netlify.com/docs/functions/). Lambda functions could be a good solution for storing secure credentials if needed. 

## Conclusion 

Shaleen's website started small and grew. I was able to build in parallel with that growth process without tearing my hair out. At no point did I have to embark on a costly and time-consuming site rebuild to add functionality. Overall, I had a great developer experience and produced a site the client loves. The static site ecosystem is truly the way of the future for web development.