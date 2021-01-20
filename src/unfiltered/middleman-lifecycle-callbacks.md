---
title: "How to Read Open Source: Finding Middleman Callbacks"
author: Tyler Williams
author_gitlab: tywilliams
author_twitter: gitlab
categories: unfiltered
image_title: '/images/blogimages/gitlab-values-cover.png'
description: "Open source empowers you to learn beyond existing documentation. Getting started can be confusing. This is a demonstration finding unlisted Middleman callbacks."
tags: open source, tutorial, workflow
---        

## Why read open source? 

When folks write about open source, I think there is a strong emphasis on contributing to open source projects, which makes sense. Many software professionals are excited to give back to the community. 

But beyond adding to your favorite project, open source philosophies have a number of other benefits in our daily lives. In particular, I love open source because it allows me to learn more about my tools when the documentation is out of date, incomplete, or leaves me with additional questions from my own curiosity. 

This happened to me recently when I was working on [https://about.gitlab.com](https://about.gitlab.com), a static site built with [Middleman](https://middlemanapp.com/). I needed to find a more comprehensive list of available [callbacks](https://middlemanapp.com/advanced/custom-extensions/#callbacks) in the Middleman lifecycle.

I hope this blog post is helpful if you're looking for existing Middleman callbacks, or if you're getting started reading through the source code of your favorite open source tools. 

## The task at hand

If you're getting started reading open source, I find it helps to have a specific task. Any unfamiliar codebase can be challenging to navigate. Having a goal in mind narrows your focus. Here was my task for Middleman:

I recently created a merge request to [add Webpack devServer to the local development environment](https://gitlab.com/gitlab-com/www-gitlab-com/-/merge_requests/71845). I had to modify some existing behavior of our Middleman preview server and wanted to use one of the lifecycle callbacks to modify the preview server's log output. 

However, the Middleman documentation does not currently list all available callbacks, nor where they happen in the lifecycle. The [extension docs](https://middlemanapp.com/advanced/custom-extensions/) say: 

> Middleman extensions are Ruby classes which can hook into various points of the Middleman system, add new features and manipulate content. This guide explains some of what's available, but you should read the Middleman source and the source of plugins like middleman-blog to discover all the hooks and extension points.

I took them up on their advice and read through the [Middleman source code](https://github.com/middleman/middleman) to find the available callbacks. Here's what I found, and how I found them.

## Callbacks available in Middleman Core

1. `initialized`: called before config is parsed, and before extensions are registered
1. `configure`: called to run any `configure` blocks (once for current environment, again for the current mode)
1. `before_extensions`: called before the `ExtensionManager` is instantiated
1. `before_instance_block`: called before any blocks are passed to the configuration context
1. `before_sitemap`: called before the `SiteMap::Store` is instantiated, which initializes the sitemap
1. `before_configuration`: called before configuration is parsed, mostly used for extensions
1. `after_configuration`: called after extensions have worked
1. `after_configuration_eval`: called after the configuration is parsed, before the pre-extension callback
1. `ready`: called when everything is stable
1. `before_build`: called before the site build process runs
1. `after_build`: called after the builder is complete
1. `before_shutdown`: called in the `shutdown!` method, which lets users know the application is shutting down
1. `before`: called before Rack requests
1. `before_server`: called before the `PreviewServer` is created
1. `reload`: called before the new application is initialized on a reload event

## How to find Middleman Callbacks

1. [Clone](https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html) the [Middleman repository](https://github.com/middleman/middleman) to your local machine. 
1. Open the Middleman directory in a text editor, IDE, or any tool that allows you to easily search through a folder's files for specific strings. 
1. Start with the [existing documentation](https://middlemanapp.com/advanced/custom-extensions/#callbacks) if it exists. Middleman lists the names of a few callbacks. You can search the directory for the string `after_configuration`.
1. In this instance, you should be able to find that string used like so: `execute_callbacks(:after_configuration)`.
1. You may also find it listed with other similar symbols in `middleman-core/lib/middleman-core/application.rb`. 
1. Read through the related blocks of code around these search results, you'll get some additional context for how they work, and you may find additional search terms that will be helpful.
1. In the case of Middleman callbacks, you can continue to search for combinations of the `execute_callbacks` method with any callback listed in `middleman-core/lib/middleman-core/application.rb` to find where and when specific callbacks are used.

## Contribute!

With this in-depth knowledge of your tool, you can be more productive at your day-to-day work, and you can contribute back to open source more easily. 

In my case, I was able to identify the best callback for my usecase, and I now plan to check in with the Middleman team and ask if they would accept a contribution to their documentation with this information so it's easier for other folks to find in the future. 