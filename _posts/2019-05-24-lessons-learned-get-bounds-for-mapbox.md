---
layout: post
title: 'Lessons learned: quick and dirty hacks to get Mapbox bounds'
tags: ['JavaScript', 'Mapbox', 'GIS']
description: 'This week I learned about content templates, server backups with S3, and Internet Explorer testing on Macs.'
---
*Last updated May 24, 2019*

## Mapbox bounds

This week we had a request with a quick turnaround for our marketing team. We needed to stand up a static site with a specific [Mapbox](https://www.mapbox.com/). The data layers were all set up, we just needed to host it somewhere (to eventually be embedded in an iframe elsewhere). 

### The problem 

We only had a small segment of layers to use, so outside those bounds was just darkness. We weren't provided with any bounding information, so we had to figure it out on our own. 

### The solution 

Adding bounds to a Mapbox instance is mostly a matter of configuration. You provide the bounding coordinates as an array, with the Southwest coordinates in the `0` position, and the Northeast coordinates in the `1` position. Then you pass it to the `maxBounds` property on the `mapboxgl.Map()` object. 

```
var bounds = [
    [xx.xx, xx.xx], // Southwest
    [xx.xx, xx.xx]  // Northeast
];

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/yourstylehere',
    center: [xx.xx, xx.xx],
    zoom: 16.0,
    maxBounds: bounds
});
```

But if you don't have those bounding coordinates available at the outset, you'll need to find them yourself. We wrote a quick function to `alert()` us with the coordinates of any clicked point. It looks like this: 

```
map.on('click', function (e) {
    alert(JSON.stringify(e.lngLat));
})
```

With this function added to the Mapbox JavaScript, we were able to eyeball the points we wanted to use as bounds, click the map, and copy-paste the values. Problem solved. 

### Limitations

#### Don't leave it in your production code! 

You probably don't want to leave your `click` handler in production code (unless you'd like end-users to be able to grab coordinates as well). So I think it'd be a little more satisfying to set up the function behind some environment variable, and maybe even a hidden trigger. 

In my mind, it would be cool to add something like: `enableCoordinateGrabber()` to the code. If you were to enter that in console, JavaScript would register the `click` handler, and you could dismiss it with `disableCoordinateGrabber()` or something. 


#### Eyeballing the coordinates 

Because of the time frame and use case, we didn't select very precise bounds. We just eyeballed what we thought would be good, and that required a bit of guess-and-check. I'm sure there's a more optimal way to calculate appropriate bounds for a given area of interest. 
