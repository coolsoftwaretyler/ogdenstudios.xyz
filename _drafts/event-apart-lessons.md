---
layout: post
title:  "Lessons from An Event Apart Denver"
tags: [An Event Apart, conference]
description: "A roundup of what I learned at An Event Apart Denver."
---

It's been a little longer than I intended, but I attended [An Event Apart Denver](https://aneventapart.com/event/denver-2019) this year and had a blast. Thanks to my company for sponsoring me to go! 

Here are some bullet points and thoughts it sparked for me. Overall, seeing these presentations and spending time with other web developers and designers inspired met o learn more, push myself harder, and be a better developer. I want to make my projects look better, run faster, and contribute responsibly to the internet overall. 

## Dynamic type

[Jason Pamental gave a talk about dynamic type](https://aneventapart.com/event/denver-2019#s17249). Some cool things I picked up here: 

* Using [variable fonts](https://v-fonts.com/) can be faster and trigger fewer network requests. Since one font file has all the typographic variation you need, there are fewer additional files to load in for variation. 
* There are some fonts out there that are being progressively shipped *as variable fonts* when loaded in from certain web font endpoints. I think that's really cool and a great way to provide progressive enhancement to customers. 
* Firefox has a [fonts tab in web inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Edit_fonts) that provides a ton of useful tools for working with variable fonts. 

## Third party software 

[Trent Walton gave a talk about third party software and the web](https://aneventapart.com/event/denver-2019#s17395).

* He showed us a really useful tool to [map your web requests](http://requestmap.webperf.tools/). 
* Tag managers are a huge culprit in ever-increasing requests and bundle size. This is something I've absolutely encountered in my day-to-day. It's nice to hear it brought up at a conference.
* If your website breaks without ad functionality, keep in mind the stats out there that say 20-40% of users are running ad blockers. What breaks for them? How can we deliver content that won't get blocked. 

## Generation style

[Eric Meyer's talk about generated content was one of my favorites](https://aneventapart.com/event/denver-2019#s16758). I use pseudo-elements every single day at work. They're one of my favorite CSS features. Even though I use them heavily, I learned a bunch during this talk:

* Pseudo-elements are treated as DOM children for flex/grid layout, but not always ::first-of-type and other CSS selectors.
* Generated content is useful because you have one surface on which you can do things: content, styling, asset management
* But generated content can be difficult to work with because *it's not always clear where content is coming from*. 
* Also turns out [the double colon is the correct syntax](https://www.w3schools.com/CSS/css_pseudo_elements.asp), which was news to me. Fortunately, browsers respect the single colon for backwards compatibility.

## Redefining the techncial possibilites of CSS 

[Rachel Andrew talked about redefining the possilities of CSS](https://aneventapart.com/event/denver-2019#s16765). And boy did it really blow me away. Her demos were really something else and made me think about: 

* Using scroll-snapping, view units, and grid to create screen experiences that behave like an app.
* Using multi-col layout that smartly regenerated itself like physical media might. 
* We can look to print media CSS standards for concepts like "I've got pages with fixed dimensions, so please just give me as many of those as I need". 
* What are the possibilities for revisiting [css regions](https://webplatform.github.io/docs/tutorials/css-regions/)? This spec failed before, but perhaps there is something new and better on the horizon now that we have grid we can use with it. 

## Intrinsic layouts

[Jen Simmons gave a talk about intrinsic layouts](https://aneventapart.com/event/denver-2019#s16751). I've listened to her on podcasts before and read many of her articles. But seeing her in person was truly inspiring. Here's what I picked up about intrinsic layout:


* Intrinsic layout is going to be the next hotness. The step *past* responsive web design. It's time to start learning and using it. 
* I hadn't really seen or used `min-content` or `max-content` before but they seem like really useful tools for better sizing in CSS.
 layouts are the next hotness, past responsive web design
* Overall, web devs need to use more grid. We can design a reasonable single column experience as a fallback that is enhanced progressively by grid. It's time to adopt and use it. 
* In a similar vein, we can do more with flexbox. Grid doesn't need to replace it, but can in fact empower flexbox to be more expressive.
* We can use grid placement algorithms to program layout in really cool and innovative ways. 
* I need to watch [Layout Land](https://www.layout.land/) and [Mozilla Developer](https://www.youtube.com/MozillaDeveloper). 

I started doing some of the [exercises, examples, and studies from Jen](https://labs.jensimmons.com/) on my own. You can see me trying to emulate and learn from her over at my own [layout practice site](https://ogden-studios-layout-practice.netlify.com). Built with [Eleventy](https://www.11ty.io/).

## Mobile planet 

[Luke Wroblewski gave a talk about the state of mobile devices](https://aneventapart.com/event/denver-2019#s16753)

* As a *rough* estimate, almost 90% of the world population 14 years old and up have mobile devices. That's a absolutely unfathomable. We can pretty much reach every single person in the world via smart phone. 
* Compare that to something like 23% of the population that owns desktop computers. 
* We have a responsibility to give people access to content over their phones. 
* People spend most of their mobile time in native apps, and very little in browses. This has driven a lot of investment in mobile apps
* **But!** People are downloading tons of apps and never using them. Almost 25% of apps are abaonded after first use.  
people spending 3hrs a day on the pone, most of their time in native mobile apps, very little in browsers. 
* The mobile web is great for *unique* visitors. Websites have better audients than new mobile apps. Sharing links is easier through the web. 
* Even though people spend most of their time in mobile *apps*, they usually spend it in one or two apps. The other apps get almost no time. But mobile *web* serves a discovery purpose that apps can't really compete with. 
* Web is good at reach, native apps are good at rich. 
* Things people hate about browsing the web on mobile: slow web pages and interstitials

There's a ton of opportunity in mobile web. Native apps don't have to supercede all of it, but we need to do better. 

## animation on the bleeding edge 

[link](https://aneventapart.com/event/denver-2019#s16731)

push the boundaries of what's possible on the web 

the goal of the web: first and foremost about communicating. 

the future of the web is animation 

improve existing site with page transitions 

- fundamentals 

- nuxt is really providing a great page transition api for us. we should use it more. 
    - i still think this might be a better option than fullscreen in a lot of ways 

- js hooks in nuxt page transitions

- javscript provides more granular and complex animation options for us. 

- native-like page transitions on the web
    - web is getting criticism for not feeling as fluid as mobile 
    - remapping page layout incurs cognitive load
    - visually grouping similar pieces of information reduces cognitive load 

- you get flip under the hood with transition-group

- animate css grid for vanilla js solutions/css animation solutions

- responsive web design 
    - what if responsive web design wasn't jsut 2d responsive, but also 3d responsive. 
    - level 1: works in VR
    - level 2: adjusts and knows it's in VR mode adn then works 
    - Nuxt has some possibilites
    - 3d responsive with nuxt 
    - VR media query? wouldn't that be super cool 
    - 3JS library 

- A-frame: 3D experiences with HTMl and CSS 

- AR as a teaching tool 

- we live in a 3D and in-motion world
    - static 2D is an abstraction. it's not how we live in the world. 
- use this for products, too. better and easier demos. 

- how do we make things complement reality. we are beind on the web platform. 

- hands-free experiences 
    - LUIS: language understanding 
    - plugs into Nuxt with Vuex store 

- charlie gerard - thinking shit. 

- take up space to break out of the design rut. 

- use the web to take up space. 

- it's time to expand our minds beyond the rectangles of the past. 

## making motion inclusive 

[link](https://aneventapart.com/event/denver-2019#s16733)

- misconception: inclusive design come at the cost of being creative, particularly for motion. 

- inclusive design definition: 'if you're designing something for the average pilot, you're designing it for nobody'
    - who is "the average user"? 
    - if there's no average pilot, perhaps there's no average user. 
    - this is the crux of inclusive design. 
    - pilot story is a powerful illustration of what inclusive design means. 

- there was a time where there was a web user. screen res, connection, office setting. 

- now we can't group users as quickly and easily. 

- inclusive design: not one thing for all people, a diversity of ways to participate so everyone has a sense of belonging. 

- use animation responsibly with an audience in mind. 

- animation helps with: visual continuity, reducing cog load, guiding tasks, connecting ideas. 

- wcag rarely comes up in animation talks 
    - wcag updated recently to 2.0 and 2.1
    - 2.0 is easier to read and make sense of things 
    - 3 guidelines for animation: 
        1. 2.2.2 (pause, stop, hide)
            - think carousels, videos, animated background videos or animations 
            - these all need pause, stop, hide options 
        2. 2.3.1 
            - three flashes or below threshold 
            - comes from broadcast research 
            - nothing that flashes more than 3 times in any second unless it's flashing is below the flash threshold red flash threshold 
            - glitchy brutalist look
            - having gated content is OK, it's better to warn people than not. but entirely hiding your content isn't really appropriate 
        3. 2.3.3
            - animation from interactions
            - motion triggered by interactions can be disabled unless it's essential 
            - avoid unnecessary animation 
            - control users to turn off non-essential nimations from user interaction 
            - take advantage of the reduce motion feature in the user-agent in operating system 

- examples of harmful animations, super useful to see. 

- we should revisit the animation on explore space because of our rotation effects. 

-  loo up "what parallax lacks'" nielson group article 

- constant animation near text 

- prefer-reduced-motion  is usable today, but isn't really progressive enhanvement, unfortunately. 

- reduce doesn't have to be remove. 
    - reduce where needed
    - identify triggering animation and provide reduced animations when asked 

- videos and GIFs are a huge culprit to watch out for. 