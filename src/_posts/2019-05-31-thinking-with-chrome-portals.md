---
layout: post
title: 'Thinking with portals'
tags: ['Portals', 'Chrome']
description: 'This week I played around with the new portal element in chrome.'
---
*Last updated May 31, 2019*

[This week's Shop Talk Show](https://shoptalkshow.com/episodes/362/) featured a ton of browser news, and I was immediately captivated by Chrome's new [portal element](https://web.dev/hands-on-portals). I decided to try it out. In order to view any of these portal demos, you'll need to use [Chrome Canary](https://www.google.com/chrome/canary/) and set the Portals flag to true. 

First, I tried to set up the picture-in-picture kind of demo featured from the Chrome team. My goal was to set up navigation between [the blue page](/blue) and [the orange page](/orange) with portal windows. However, there's a big issue for me: since these pages render one another inside the picture-in-picture portal in the lower left-hand site, and because a portal makes a server request to its `src`, I got the pages locked in an infinite loop. If you view it in Canary, you'll see the page never finishes loading - because it's continuously loading the nested portals. 

I think the fix for this live somewhere in [the portalhost interface](https://wicg.github.io/portals/#the-portalhost-interface). You can check if a window is being hosted as a portal, and you might be able to toggle its nested portal based on that information. 

But before I read about the portalhost interface, I wanted a different solution. So I set up [Thinking with Portals](https://thinkingwithportals.netlify.com/). In Canary, all of the links are hijacked and use portals instead of the default browser behavior. It allows me to set up page transitions between links. My big challenge right now is that the standard `activate()` function on portals **doesn't add to the browser history** - so you can't use the browser's navigational buttons. 

Still, this is a pretty neat spec. I'm excited to see what happens, and I think there's a ton of potential to bring SPA-like transitions to SSR websites.