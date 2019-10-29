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

