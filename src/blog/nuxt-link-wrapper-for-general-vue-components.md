---
layout: post
title: Wrap nuxt-link for general use in components agnostic of Vue.js frameworks.
tags: ['post']
description: The nuxt-link component is a core feature of Nuxt.js. But if you're building a general Vue.js framework for use in Nuxt, you may want some more flexibility.
date: 2020-03-23
---

At work we've got a component library built in [Vue.js](https://vuejs.org/). It's great because we can take the work our designers do, build it once, and then ship it to any project that needs those components. 

Most, but not all of our projects end up using the [Nuxt.js](https://nuxtjs.org/) framework. We like it because it gives us the ability to build sites with server-side rendering, static site generation, or even single-page applications.

## Building the components for Nuxt 

We have a few navigational components in our library, like a `Navbar` component and a `Footer` component. Since these components typically direct users around internal pages on our Nuxt projects, we should use the `nuxt-link` component to get the most out of the framework. 

The [nuxt-link](https://nuxtjs.org/api/components-nuxt-link/) allows users to navigate the application like they might expect with a `router-link`. It is itself an extension of [router-link](https://router.vuejs.org/api/#router-link). 

But to use `nuxt-link`, the component needs to be used *inside a Nuxt project*. Usually that's fine, but sometimes we don't use Nuxt, so we don't have it available as a component, and things break. In those cases, we want to be using a regular HTML `a` tag. 

## Wrapping nuxt-link

So we built a utility component to wrap our links. It's aptly named `AnchorLinkOrNuxtLink`. Here's what that looks like: 

```vue
<template>
    <nuxt-link v-if="nuxt" :to="to">
        <slot></slot>
    </nuxt-link>
    <a v-else :href="to">
        <slot></slot>
    </a>
</template>

<script>
export default {
    props: ['nuxt', 'to']
}
</script>
```

We pass two props to the `AnchorLinkOrNuxtLink` component: 

* `nuxt`: a boolean value which makes the component act as a `nuxt-link` or an `a` tag. 
* `to`: some string that acts as the `to` prop on a `nuxt-link`, or the `href` attribute on an `a` tag. 

We use [conditional rendering](https://vuejs.org/v2/guide/conditional.html) to check if `nuxt` is `true`. If so, we use `nuxt-link`. Otherwise, the component renders as an `a` tag. If the `nuxt` prop isn't passed in, the expression will evaluate to `false` and we default to the safe fallback of an `a` tag, which will work in either a Nuxt project or something else. 

Finally, since both `nuxt-link`s and `a` tags are able to wrap things, we provide a [slot component](https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots) inside either to contain any wrapped content. 

## Putting it together 

We want to be able to create a flexible component that can take links and render out either `nuxt-link`s or `a` tags. Let's look at a quick example. Say we want a `Navbar` component with three links: 

1. The brand element that navigates to `/`
2. A secondary `About` page 
3. Some link to an external resource like `Partner site`. 

We can build that like this: 

```vue
<template>
    <nav>
        <ul>
            <li>    
                <AnchorLinkOrNuxtLink to="/" :nuxt="brandIsNuxtLink">
                    <img src="some-logo.jpg" />
                </AnchorLinkOrNuxtLink>
            </li>
            <li v-for="item in navbar.links" :key="item.link">
                <AnchorLinkOrNuxtLink :to="item.link" :nuxt="item.nuxt">
                    {{ item.title }}
                </AnchorLinkOrNuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script>
import AnchorLinkOrNuxtLink from './AnchorLinkOrNuxtLink.vue';

export default {
    components: {
        AnchorLinkOrNuxtLink
    },
    props: ["brandIsNuxtLink", "navbar"]
}
</script>
```

This component takes two props: 

* `brandIsNuxtLink`: since the **brand** element is a bit different than the rest of the links in the nav, we call this out separately. We can pass a boolean to determine `nuxt-link` vs `a` tag behavior. 
* `navbar`: we can pass an object as this prop to set up the links. It might look something like this: 

```js
navbar: {
    links: [
        {
            link: '/about',
            nuxt: true,
            title: 'About'
        },
        {
            link: 'https://www.partner.com',
            nuxt: false,
            title: 'Partner site'
        }
    ]
}
```

The `/about` link will act as a Nuxt link, and the `https://www.partner.com` link will act like a normal anchor link. 

Hope that's helpful to someone out there!