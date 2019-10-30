[link](https://aneventapart.com/event/denver-2019)

## dynamic type
[link](https://aneventapart.com/event/denver-2019#s17249)

Variable fonts can be faster, trigger fewer requests

Some fonts are getting shipped with it by default 

We could set up a design that really focuses on specifc variables

firefox font inspector 

## third party software 
[link](https://aneventapart.com/event/denver-2019#s17395)

http://requestmap.webperf.tools/

tag managers are a huge culprit

check out slide deck for the number of requests/size of requests of major websites

consider 24-40% of people are running ad blockers. what breaks for those people? How do we deliver content that won't get blocked

## generation style
[link](https://aneventapart.com/event/denver-2019#s16758)

pseudo elements are treated as dom children for flex/grid layout, but perhaps not :first-of-type and other types of selectors

useful because you have one surface on which you can do things

difficult because it's not always clear where content is coming from 

double colon is the correct standard now, but single color is backwards compatible and just fine 


## redefining the techncial possibilites of css 

[link](https://aneventapart.com/event/denver-2019#s16765)

screen experiences that behave like an app

what if we had multi-col layout that smartly regenerated itself and was like a page

look to print media for this concept of 'i have pages with fixed dimensions, give me as many as i need'

we should use more scroll snapping 

[css regions would be sweet](https://webplatform.github.io/docs/tutorials/css-regions/) and they failed before, but perhaps there is something new and better on the horizon now that we have grid 

## intrinsic layouts

intrinsic layouts are the next hotness, past responsive web design

look into min-content, max-content for better sizing

we need to use more grid. let's design a reasonable single column experience for a fallback that is enhanced progressively by grid. 

let's do more with flexbox as well

grid placement algorithms can allow us to do really cool stuff

i'm going to watch layout land and mozilla developer 

## mobile planet 

[link](https://aneventapart.com/event/denver-2019#s16753)

world pop: 5B people have mobile subscriptions, out of 5.6billion people 14 years old and up. that's w i l d

4B have smartphones. 

So we can pretty much reach every single person on their phones. 

only 1.3B active PCs 

a large responsibility to give people access to things across their phones. 

people spending 3hrs a day on the pone, most of their time in native mobile apps, very little in browsers. 

so there's a lot of investment in native mobile apps 

but lots of people are downloading and not using it. almost 25% are abandoned after the first use.

drop people directly into the core value - but again, grab the requirements before dropping people in there, but unobtrusively. 

people treat overlays as things to avoid. people are task focused. the more different a UI looks, the more quick they are to dismiss it. even when there's helpful stuff. 

product onboarding: get to product value asap, but not faster. ruthlessly edit distractions fro product value, teach in the moment with integrated UI

mobile web is great for unique visitors. website have better audiences than new mobile apps. links and sharing is easier through that medium. Sure, people only use web browsers 11m out of 169, but that's because the first two apps take up th emost time. 

unique actions happen on the web. 

it's not necessary navitve vs the web. 

web is good at reach, native apps are rich. 

what do people dislike the most when browsing the web: 

waiting for slow web pages 

interstitials 

mobile delays: more stressful than watching a horror movie. 

## the design of meaning 

[link](https://aneventapart.com/event/denver-2019#s17248)

we crave meaning, we thrive on it 

let's not write off augmented reality yet, dependent on how we can add meaning to it. 

meaning is about what matters. 

to prepare humanity for a tech-driven future, we have to think about innovation about what is *going* to matter 

meaning is waht matters, innovation is what is *going* to matter. 

experience at scale changes culture, because experience at scale **is** culture

We have to be thoughtful about the things we build at scale. 

automation applied to a meaningful experience will magnify the meaning, and automation applied to an absurd experiences will magnify the absurdity

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