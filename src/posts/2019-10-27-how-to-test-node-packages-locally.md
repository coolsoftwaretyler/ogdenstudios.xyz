---
layout: post
title:  "How to Use a Local Version of a Node Package"
tags: [nodejs, npm, open source, 'post']
description: "Here's how to make changes to a node package and try it out on your local machine."
---

Recently I wanted to contribute to one of my favorite projects: [Eleventy static site generator](https://www.11ty.io/).

I've never made changes to a node package before. So my biggest blocker was figuring out how to clone and use someone else's node package locally, as opposed to using it directly with `npm install`. 

In order to use a node package locally, you have to tell your `package.json` file to read from a local file. You can do that via `npm install` with this command: 

```
npm install /absolute/path/to/project
```

So for my case, I cloned the [Eleventy git repo](https://github.com/11ty/eleventy) to `/path/to/local/eleventy`. I made my changes and tried them out with a local Eleventy project, located at `path/to/test/site`. 

In order to use my local Eleventy changes in the Eleventy project, I navigated to the `path/to/test/site` directory and ran: 

```
npm install /path/to/local/eleventy
```

Which configured the test site to use my local version of Eleventy, including my changes. 