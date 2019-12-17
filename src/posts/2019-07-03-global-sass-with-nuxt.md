---
layout: post
title: How do I add Global Sass to a Nuxt project? 
tags: ["Vue", 'post']
description: "A quick tidbit about adding global Sass files to Nuxt"
---

My team is currently working on a [Nuxt](https://nuxtjs.org/) project. We like to use Vue and Nuxt when appropriate, but are primarily a Rails shop. Like many other Rails devs, we often rely on [Sass](https://sass-lang.com/) for our styles. We sometimes want to use a global `_variables.scss` or other application-wide stylesheets like we might with the Rails asset pipeline. 

In order to get the same sort of global styles available throughout our Nuxt app, we can use the [Nuxt Style Resources](https://www.npmjs.com/package/@nuxtjs/style-resources) package. 

Assuming you have already added Sass to your project with `npm i -D sass-loader node-sass`

Run `npm i -D @nuxtjs/style-resources`

And you'll have access to the Style Resources module. 

In `nuxt.config.js` update the configuration: 

```
module.exports = {
    // Other nuxt.config.js
    
    modules: ['@nuxtjs/style-resources'],

    // Global styles to be imported
    styleResources: {
        scss: [
            'assets/scss/file/path.scss',
        ]
    }
}
```

You can add multiple sass files in the `scss` array. I find it easier to add something like `base.scss` and then use Sass imports to pull in partials to the one base file so I don't need to continue to update `nuxt.config.js`.

I found this information on a google search which turned up [this Hackernoon article](https://hackernoon.com/how-i-use-scss-variables-mixins-functions-globally-in-nuxt-js-projects-while-compiling-css-utilit-58bb6ff30438).