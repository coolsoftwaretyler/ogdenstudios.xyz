I'm primarily a web developer, not a designer. But I respect the craft of design and believe web sites ought to look good. To fill in the gaps of my design knowledge, I often rely on Erik Kennedy's 7 Rules for Creating Gorgeous UI ([part 1](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-1-559d4e805cda) [part 2](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-2-430de537ba96)). 

I think Erik lays out the rules in a logical progression for people working through the concepts, but when I apply his rules, I tend to implement his rules in a different order. Here's my checklist for following Erik Kennedy's 7 Rules for Creating Gorgeous UI. 

# Select fonts 

Erik recommends five free fonts. I rarely stray from this guidance. Choose one: 

[Work Sans](https://fonts.google.com/specimen/Work+Sans)

[Roboto](https://fonts.google.com/specimen/Roboto)

[Montserrat](https://fonts.google.com/specimen/Montserrat)

[Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro)

[IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans)

# Set typography styles 

Select font sizes and consider using [fluid typography](https://css-tricks.com/snippets/css/fluid-typography/) as appropriate. This allows us to set minimum and maximum font sizes that respond to viewport width. [Erik has more advice about font sizes here](https://learnui.design/blog/mobile-desktop-website-font-size-guidelines.html). 

Consider using [type scale](https://type-scale.com/?size=) to select font proportions. 

Don't forget to start with plenty of line-height and adjust down as needed. 

# Create layouts 

With fonts, typography, and content in place - it's time to lay out the pages. 

Identify possible page templates. Some pages like home pages or contact pages will likely require bespoke designs, while standard content pages may have a more general layout.

Start styling each layout at mobile widths. When the entire layout is complete, adjust viewport sizes to identify breaking points and make corrections as necessary. Do all this work in black and white first, as per [Rule 2](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-1-559d4e805cda). Do not use color yet. 

If you're stuck on where to begin with layout, consider [Rule 7](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-2-430de537ba96) to "Steal like an artist" and use find new inspiration. 

# Resize and test images

With the layouts in place, adjust images as necessary. The [Responsive Image Breakpoints Generator](https://www.responsivebreakpoints.com/) is a great tool for this task. 

Some images may be used as backgrounds. These images may be better adjusted with CSS `background` rulesets. Follow Erik's [Rule 4](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-2-430de537ba96). There are many ways to create text overlays. Select the best one for the context. 

# Make sure light is coming from the sky

[Rule 1](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-1-559d4e805cda) explains that light comes from above. Practically, here's what that means: 

## Inset these elements: 

* Text input
* Pressed buttons 
* Slider tracks
* Unselected radio buttons 
* Checkboxes

## Outset these elements: 

* Unpressed buttons 
* Slider buttons
* Dropdown controls
* The button part of a selected radio button 
* Popups

Check any other elements with design implications to ensure consistency. 

# Select a color palette with HSB

Use [HSB](https://learnui.design/blog/the-hsb-color-system-practicioners-primer.html) to choose a color palette. HSB doesnt translate directly to CSS, so with a color palette in HSB, generate hex codes for use. 

# Identify key content for emphasis 

Use your color and [Rule 5](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-2-430de537ba96) to un-pop and up-pop important content for emphasis.

# Add interactivity 

Find opportunity for swizzle: hover effects, motion, passive effects, animations, etc. 

