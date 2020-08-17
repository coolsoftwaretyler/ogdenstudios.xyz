---
layout: post
title: A Nifty Use Case for Rails Virtual Attributes
tags: ['post']
description: Rails Virtual Attributes can be super useful as a templating helper.
date: 2020-08-17
---

I work on a Rails project uses models to represent some front end components, which gives us access to clever tricks, including using [virtual attributes](http://railscasts.com/episodes/16-virtual-attributes-revised) for custom styling. 

## The base component class

All of these components inherit from a `Component` model that looks like this: 

```rb
class Component < ApplicationRecord
  def css_class_list
    class_string = "#{self.class}"
    self.style_list.each { |style| class_string << (" " + style.to_s) if self.send(style) }
    class_string
  end
end
```

The `css_class_list` method spits out a class list for use in our ERB templates, like so: 

```erb
<div class="<%= component.css_class_list %>"></div>
```

If we want to build out some `EventComponent` that inherits from the `Component` class, its rendered template would come out like this: 

```html
<div class="EventComponent"></div>
```

## Customize the event component styles

Let's say we want to add some different flavors to the `EventComponent`. We can add additional CSS classes using the `style_list` method:

```rb
class EventComponent < Component
  belongs_to :page

  def style_list
    [
      :description_enabled
    ]
  end
end
```

The parent class, `Component`, grabs `style_list` and sends each symbol to the instance of the `EventComponent`. If it returns true, it adds the symbol to the final class list. 

In this case, if we have an `EventComponent` with `description_enabled`, the rendered template would be: 

```html
<div class="EventComponent description_enabled"></div>
```

## Generate CSS classes with virtual attributes

This works well for model attributes that are boolean values, but what if we want to style based on a non-boolean attribute? This is where virtual attributes really shine. 

Here's a version of `EventComponent` that we can style based on the number of attendees: 

```rb
class EventComponent < Component
  belongs_to :page

  def over_capacity # This is the virtual attribute
    rsvp_count > 1000
  end

  def style_list
    [
      :description_enabled
      :over_capacity
    ]
  end
end
```

Now if we render out an `EventComponent` with more than 1000 RSVPs, the output will look like: 

```html
<div class="EventComponent description_enabled over_capacity"></div>
```

And we can go on to target `.EventComponent`, `.description_enabled`, and `.over_capacity` with our CSS! 