---
layout: post
title:  "What is an Event Bus in Vue? How do I use it in Nuxt?"
tags: [vue, nuxt, javascript, eventbus, components]
description: "In a Vue application, you can use an event bus for sibling components to communicate. Here's how to set one up in Nuxt."
---

Let's say we're building a [Nuxt](https://nuxtjs.org/) application and we have two major components: 

* `Content`
* `Map` 

The `Map` component **only cares about map functionality**, and the `Content` component **only cares about displaying content**. We want a strong separation of concerns between the two. 

Practically speaking, it's likely the two components will occupy the same screen at once. Perhaps we have something like this: 

![An image of a map on the left and content on the right](/img/event-bus-blog/event-bus-side-by-side.png)

And while they manage state and individual functionality in isolation - if we were to toggle our `Content` component between being displayed and being hidden, we may need to tell your `Map` component to resize itself. This is the case if you're using [VueMapbox](https://soal.github.io/vue-mapbox/). 

So how can we pass a message from a sibling component to another sibling component? Usually Vue wants us to either [pass data to child components](https://vuejs.org/v2/guide/components.html#Passing-Data-to-Child-Components-with-Props) or [listen to child component events](https://vuejs.org/v2/guide/components.html#Listening-to-Child-Components-Events). It may be difficult to figure out **how to send events, messages, or other data between two sibling components in Vue**. 

## Enter the Event Bus 

Fortunately, there is a solution for this dilemma. We can use an [event bus](https://css-tricks.com/using-event-bus-to-share-props-between-vue-components/). 

The event bus is essentially another Vue instance that our current Vue instance can own, manipulate, and listen to. The CSS Tricks article linked above goes over setting up an event bus in a standard Vue app, but there are a handful of extra steps you need to take to configure one in a Nuxt app. 

## Create an event bus in Nuxt

We can set up the event bus in `plugins/eventBus.js`. It looks like this:

```
import Vue from 'vue';

const eventBus = {};

eventBus.install = function (Vue) {
  Vue.prototype.$bus = new Vue();
}

Vue.use(eventBus);
```

## Register the event bus in Nuxt

Inside `nuxt.config.js` we need to update the `plugins` object like so: 

```
plugins: [
    '~/plugins/eventbus.js'
]
```

Now any component can emit or listen to events on the event bus, regardless of where it sits in the component tree. 

## Emit an event from the content component 

If the `Content` component has a [transition](https://vuejs.org/v2/guide/transitions.html) on the hide/show functionality, we can set up [Vue transition hooks](https://vuejs.org/v2/guide/transitions.html#JavaScript-Hooks) to trigger some method. Let's call ours `resize`. 

On the `transition` markup, we write: 

```
<transition name="toggle" v-on:after-enter="resize" v-on:after-leave="resize">
. . .
</transition>
```

And in our `script` block for the `Content` component, we write: 

```
export default {
    . . .
    methods: {
        resize: function() {
            this.$bus.$emit("resize-map");
    },
    . . .
}
```

Whenever the transition hits the `after-enter` or `after-leave` transition hooks, it will tell the event bus to emit an event called `resize-map`. 

## Listen to the event bus in the sibling component 

Inside our `Map` component, we can set up an event listener on the event bus. We set this during the [mounted() lifecycle hook](https://vuejs.org/v2/api/#Options-Lifecycle-Hooks).

In our `script` block in `Map.vue`: 

```
export default {
    . . . 
    mounted() {
        this.$bus.$on("resize-map", this.resizeTheMap);
    },
    . . .
}
```

Now our `Map` component can define a method called `resizeTheMap()`, which will fire every time the `Content` component hits the `after-enter` or `after-leave` transition hooks. 