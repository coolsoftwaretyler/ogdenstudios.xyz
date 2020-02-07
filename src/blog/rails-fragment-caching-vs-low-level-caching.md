---
layout: post
title: "Fragment Caching vs. Low Level Caching in Ruby on Rails"
tags: ['post']
description: "Sometimes it's unclear which caching technique you should use in Ruby on Rails. Read up on fragment caching vs. low level caching."
date: 2020-02-06
---

Let's say we've got some view in a Ruby on Rails app that takes some `SampleObject` instance variable and renders out partials based on `external_components`, which is a method we define on `SampleObject` that performs some long-running task to return the data for the partials. 

We might write our view like this:

```
<% @sample_object.external_components.each do |component| %>
    <%= render component %>
<% end %>
```

## Fragment caching 

Our first intuition might be to use [fragment caching](https://guides.rubyonrails.org/caching_with_rails.html#fragment-caching) to speed up the partials a little. You can use fragment caching on the partial like so: 

```
<% @sample_object.external_components.each do |component| %>
  <% cache component do %>
    <%= render component %>
  <% end %>
<% end %>
```

This will yield some benefits because it caches the render output of the `component` partial. 

But if `@sample_object.external_components` takes some non-trivial amount of time to run its operations, we haven't quite solved all our caching problems. The call to that method happens outside of the cache. Every time we render this view, we'll invoke `external_components` and slow things down, even with the cached partials. 

## Low-level caching

The `SampleObject` class defines the `external_components` method like this: 

```
class SampleObject < ApplicationRecord
    def external_components 
        # Some long running task that returns `components`
    end
end
```

This is a great candidate for [low-level caching](https://guides.rubyonrails.org/caching_with_rails.html#low-level-caching). 

We can refactor `external_components` like this: 

```
class SampleObject < ApplicationRecord
   def external_components 
     Rails.cache.fetch("#{cache_key_with_version}/components", expires_in: 12.hours) do
     # Some long running task that fetches "components"
    end
  end
end
```

Now any call to `external_components` will be cached for twelve hours, which is great because we can reuse it elsewhere across our application and also rest assured that the result will be cached as desired. 

## Caching in Development

When I was putting this together in my own application at work, I was having difficulty benchmarking the difference between my cached and non-cached responses. 

I had forgotten that the Rails cache is off by default in development. So my caching wasn't doing anything. 

If you want to see the difference in a development environment, you can [turn on the Rails dev cache](https://guides.rubyonrails.org/caching_with_rails.html#caching-in-development) like so:

```
rails dev:cache
```