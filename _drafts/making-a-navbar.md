---
layout: post
title: 'Building a semantic, accessible, responsive, and extensible navigation element'
tags: []
description: ''
---

TODO: take out slug class names, set that as the data attribute? 
TODO: add single link capability  
TODO: take out brand entirely?
TODO: swap brand with single link capability?
TODO: take screenshots at same dimension
TODO: optimize screenshots

Navigation components are the bane of my existence. They present all sorts of challenges and complexities. A truly good navbar must be semantic, accessible, responsive, and reusable. In my opinion, the best site navigation is small and represents anywhere between three to five different links, each of which leads users to appropriate pages which are either top-level content, or some more detailed content funneling system. I think trying to fit more than five options in a site navigation is an exercise in futility, and a bad design pattern. 

I think some websites successfully implement *mega-menus*, but the appropriate use-cases for these kinds of navigation elements are places like Amazon. The majority of the time, mega-menus are bad for user experience, and represent an unwillingness to be critical about content, site architecture, and user stories. 

But when at my day job or working with clients, I am often handed non-negotiable specifications that call for some sort of massive site navigation. These requirements often scare me, and I've spent a tremendous amount of time building navigation elements that don't meet the **semantic, accessible, responsive, and reusable** requirements. It hurts every time that happens. Recently I took a deep dive into how to make the best possible navbar.

My navbar uses semantic HTML, raw CSS, and vanilla JavaScript. Since I'm a Rails guy, the HTML is generated in a Rails app, but as long as the final markup stays the same, it can be written by hand or through any other framework you like. 

The HTML is semantic and accessible, according to [AChecker](https://achecker.ca) **TODO: fix WCAG warning about onkeydown/onmousedown**

I've linted the CSS with [CSSLint](http://csslint.net/), and the JavaScript with [ESLint](https://eslint.org/demo/). The CSS is X bytes minified and gzipped. The JavaScript is X bytes minimifed and gzipped. 

In order to arrive at my solution, I've consumed tutorial after tutorial and synthesized the information relevant to my requirements. I took lessons learned (and the hamburger menu, to be specific) from [Tania Rascia's Responsive Dropdown Navigation Bar](https://www.taniarascia.com/responsive-dropdown-navigation-bar/). I used concepts and some markup structure from [Adobe's Accessible Mega Menu](https://adobe-accessibility.github.io/Accessible-Mega-Menu/). I incorporated some the ideas from [Smashing Magazine's Building Accessible Menu Systems](https://www.smashingmagazine.com/2017/11/building-accessible-menu-systems/), and I'd like to give a special shout out to [Chris Ferdinandi grappling with this problem and why it's so hard](https://gomakethings.com/i-was-wrong-about-javascript-free-dropdowns/) for inspiring me to write this article. I also relied on Chris pretty heavily when it came to [optimizing my JavaScript using event delegation](https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/). 

Here are the specifications: 

Our navigation needs to use semantic HTML. It needs to be accessible. It needs to be responsive. It needs to accommodate top-level links, navigation menus with limited options, and navigation menus with a larger body of content/more options. We need to be able to change the content of the navigation with ease and error-free.

## Stack 

I mostly develop Ruby on Rails applications in my day job. I generated the markup using `.erb` partials and some light logic. The markup of the navbar is created based on data returned by a Rails helper. But at the end of the day, all that just compiles down to semantic, valid HTML, so you can ignore the Rails part if you need, and just focus on creating the final HTML. I wrote my partials and helper methods in Rails 5.2, but that also shouldn't make a huge difference, there are very few dependencies or esoteric techniques there. 

## Markup 

Let's talk about the markup. The entry point into the navbar partial is my `_navbar.html.erb` file. It looks like this: 

```
# app/views/layouts/navbar/_navbar.html.erb
# Main navbar partial 
<% navbar_data = get_navbar_data %>
<nav>
  <%= render 'layouts/navbar/navbar_brand'%>
  <div class="nav-mobile">
    <span id="nav-toggle"><span></span></span>
  </div>
  <div id="navbar" class="navbar" tabindex="0">
    <ul class="navbar__categories" tabindex="0">
      <% navbar_data.each do |node| %>
        <li class="navbar__categories__list-item" onblur="hideNavbar()" onfocus="displayNavbar('<%= node[:slug] %>')" tabindex="0">
          <% if node[:type] == 'single'%>
            <%= render 'layouts/navbar/navbar_single_col_panel', data: node %>
          <% else %>
            <%= render 'layouts/navbar/navbar_multi_col_panel', data: node %>
          <% end %>
        <% end %>
      </li>
    </ul>
  </div>
</nav>
```

### The data 

The first line retrieves a hash with the actual data for the navbar. The specific implementation of this isn't very important. In production, I do some fancy footwork and query our routes, controllers, etc., and come up with a comprehensive and adaptable navigation structure. But to start, you can just set up a helper method to return a static hash. It might look something like this: 

```
# app/helpers/navbar_helper.rb
# Navbar helper 
module NavbarHelper
    def get_navbar_data
        return data = [
            {
                label: "Home",
                slug: "home",
                nodes: []
            },
          {
              label: "Single",
              slug: "single",
              type: 'single',
              nodes: [
                  {
                      label: 'About',
                      link: '/about'
                  },
                  {
                      label: 'Contact',
                      link: '/contact'
                  },
                  {
                      label: 'Blog',
                      link: '/blog'
                  }
              ]
          },
          {
              label: 'Multiple',
              slug: "multiple",
              type: 'multi',
              nodes: [
                  {
                      label: 'Category 1',
                      nodes: [
                          {
                              label: 'Item 1',
                              link: '/category-1/item-1'
                          },
                          {
                              label: 'Item 2',
                              link: '/category-1/item-2'
                          }
                      ]
                  },
                  {
                      label: 'Category 2',
                      nodes: [
                             {
                              label: 'Item 1',
                              link: '/category-2/item-1'
                          },
                          {
                              label: 'Item 2',
                              link: '/category-2/item-2'
                          }
                              {
                              label: 'Item 3',
                              link: '/category-2/item-3'
                          },
                          {
                              label: 'Item 4',
                              link: '/category-2/item-4'
                          }
                      ]
                  },
                  {
                      label: 'Category 3',
                      nodes: [
                         {
                              label: 'Item 1',
                              link: '/category-3/item-1'
                          },
                          {
                              label: 'Item 2',
                              link: '/category-3/item-2'
                          }
                              {
                              label: 'Item 3',
                              link: '/category-3/item-3'
                          }
                      ]
                  }
              ]
          }
      ]
    end
  end
```

This sample structure is supremely basic, and represents only a starting point of what you can do. I use a hash because I'm working in Rails, but if you're doing most of your backend work in JavaScript, you could represent this as JSON data, or really any other format as long as it's predictable and allows you to generate your HTML correctly. You could add additional attributes and render them as necessary. This example is not meant to be exhaustive of the possibilities. 

But for our purposes, it represents the three major use-cases I run into when making these kinds of components:

1. Top-level links 
2. Single-category lists of links
3. Multiple-category lists of links

### The components

The `_navbar` partial takes this data, iterates over it, and uses three additional partials to stitch together the final product: 

1. The brand element 
2. Single column items 
3. Multi column items 

### The navbar brand

The navbar brand is small. It's extensible, but typically is meant to be a single item with no logic required. I broke it out into a partial to keep the top level navbar partial neat and clean. 

```
# app/views/layouts/navbar/_navbar_brand.html.erb
# Navbar brand 
<%= link_to root_path do %>
  <div class="brand">
  Home
  </div>
<% end %>
```

### Single column categories

If the navbar partial runs into a single column category, it will pass that over the `_navbar_single_col_panel.html.erb` file, which looks like this: 

```
# app/views/layouts/navbar/_navbar_single_col_panel.html.erb
# Navbar single column 
<div class="navbar__single-col-panel">
  <span class="navbar__categories__header <%= data[:slug] %>" data-slug="<%= data[:slug]%>"><%= data[:label]%></span>
  <ul class="navbar__single-col navbar__category <%= data[:slug] %>">
    <% data[:nodes].each do |node|%>
      <li class="navbar__category__item">
        <a class="navbar__link" data-slug="<%= data[:slug]%>" href="<%= node[:link] %>">
          <%= node[:label] %>
        </a>
      </li>
    <% end %>
  </ul>
</div>
```

This inserts a `.navbar__single-col-panel` div as a list item in the unordered list with classname of `.navbar__categories`. The div starts with a span, which gets the `.navbar__categories__header` class, and ruby dynamically generates a class name based on the `data[:slug]` attribute, available through the hash. This span gets a custom data attribute of the same name, with `data-slug="<%= data[:slug]%>"`. The span's inner content is the `data[:label]`, again made available through the hash. 

Under the span is another unordered list, with the classes `.navbar__single-col`, `.navbar__category`, and the slug class name as well. 

Then ruby iterates over the inner nodes and creates a list item of class `.navbar__category__item`. Each node becomes an anchor with a `data-slug` attribute that matches the slug of this category, and an href with the link. The link text is created from that node's `label` attribute. 

### Multiple column categories 

If the navbar partial runs into a multiple column category, it will pass that over the `_navbar_multi_col_panel.html.erb` file, which looks like this: 

```
# app/views/layouts/navbar/_navbar_multi_col_panel.html.erb
# Navbar multi column 
<div class="navbar__multi-col-panel">
  <span class="navbar__categories__header <%= data[:slug] %>" data-slug="<%= data[:slug]%>"><%= data[:label]%></span>
  <ul class="navbar__multi-col navbar__category <%= data[:slug] %> ">
    <% data[:nodes].each do |node|%>
      <li>
        <span><%= node[:label] %></span>
        <ul class="multi-col__category">
          <% node[:nodes].each do |item| %>
            <li class="multi-col__category__item">
              <a class="navbar__link" data-slug="<%= data[:slug]%>"href="<%= item[:link] %>" ><%= item[:label] %></a>
            </li>
          <% end %>
        </ul>
      </li>
    <% end %>
  </ul>
</div>
```

This inserts a `.navbar__mutli-col-panel` div as a list item in the unordered list with classname of `.navbar__categories`. The div starts with a span, which gets the `.navbar__categories__header` class, and ruby dynamically generates a class name based on the `data[:slug]` attribute, available through the hash. This span gets a custom data attribute of the same name, with `data-slug="<%= data[:slug]%>"`. The span's inner content is the `data[:label]`, again made available through the hash. 

Under the span is another unordered list, with the classes `.navbar__multi-col`, `.navbar__category`, and the slug class name as well. 

Then ruby iterates over the inner nodes and creates a list item with a nested unordered list inside of it, with the class `.multi-col__category`. 

Ruby iterates one more time over the inner nodes of each node and each becomes an anchor with a `data-slug` attribute that matches the slug of this category, and an href with the link. The link text is created from that node's `label` attribute. 

### Bringing the markup together 

If you were to set up a Rails application, add these helper files and view partials, add controllers, routes, and views to the application, and then add `<%= render 'layouts/partials/navbar' %>` to your `app/views/layouts/application.html.erb` file, you would see the following: 

![Markup only navbar in sample Rails app](/img/navbar-tutorial/navbar-markup.png)

The generated markup looks like this: 

```
# Generated HTML from Rails 


<nav>
   <a href="/">
      <div class="brand">
         Home
      </div>
   </a>
   <div class="nav-mobile">
      <span id="nav-toggle"><span></span></span>
   </div>
   <div id="navbar" class="navbar" tabindex="0">
      <ul class="navbar__categories" tabindex="0">
         <li class="navbar__categories__list-item" onblur="hideNavbar()" onfocus="displayNavbar('home')" tabindex="0">
            <div class="navbar__multi-col-panel">
               <span class="navbar__categories__header home" data-slug="home">Home</span>
               <ul class="navbar__multi-col navbar__category home ">
               </ul>
            </div>
         <li class="navbar__categories__list-item" onblur="hideNavbar()" onfocus="displayNavbar('single')" tabindex="0">
            <div class="navbar__single-col-panel">
               <span class="navbar__categories__header single" data-slug="single">Single</span>
               <ul class="navbar__single-col navbar__category single">
                  <li class="navbar__category__item">
                     <a class="navbar__link" data-slug="single" href="/about">
                     About
                     </a>
                  </li>
                  <li class="navbar__category__item">
                     <a class="navbar__link" data-slug="single" href="/contact">
                     Contact
                     </a>
                  </li>
                  <li class="navbar__category__item">
                     <a class="navbar__link" data-slug="single" href="/blog">
                     Blog
                     </a>
                  </li>
               </ul>
            </div>
         <li class="navbar__categories__list-item" onblur="hideNavbar()" onfocus="displayNavbar('multiple')" tabindex="0">
            <div class="navbar__multi-col-panel">
               <span class="navbar__categories__header multiple" data-slug="multiple">Multiple</span>
               <ul class="navbar__multi-col navbar__category multiple ">
                  <li>
                     <span>Category 1</span>
                     <ul class="multi-col__category">
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-1/item-1" >Item 1</a>
                        </li>
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-1/item-2" >Item 2</a>
                        </li>
                     </ul>
                  </li>
                  <li>
                     <span>Category 2</span>
                     <ul class="multi-col__category">
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-2/item-1" >Item 1</a>
                        </li>
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-2/item-2" >Item 2</a>
                        </li>
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-2/item-3" >Item 3</a>
                        </li>
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-2/item-4" >Item 4</a>
                        </li>
                     </ul>
                  </li>
                  <li>
                     <span>Category 3</span>
                     <ul class="multi-col__category">
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-3/item-1" >Item 1</a>
                        </li>
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-3/item-2" >Item 2</a>
                        </li>
                        <li class="multi-col__category__item">
                           <a class="navbar__link" data-slug="multiple"href="/category-3/item-3" >Item 3</a>
                        </li>
                     </ul>
                  </li>
               </ul>
            </div>
         </li>
      </ul>
   </div>
</nav>
```

## Styles 

The goal of this navbar is to make something easily extensible, so I haven't written comprehensive styles. For the most part, these styles are everything you really need for a basic layout to work.

### Default, wide viewport styles 

1. I don't want the standard `ul` padding, so I set every `ul` nested within the `nav` to have `padding: 0`. 
2. Similarly, I have no need for the dots and other list-item decoration, so I set `list-style: none`.
3. We truly don't want `nav-mobile` to be displayed above our breakpoint, so `display: none` is appropriate there. 
4. I use `display: flex` for an easily responsive `.navbar__categories` element. Flexbox is an excellent choice for one-dimensional responsive styles. 
5. Since `.navbar__categories__header` is going to be a focusable and clickable `span` element TODO: should these be buttons? I don't think so, probably list semantics, maybe, we set `cursor: pointer` to indicate that
6. The `.navbar__categories__header` is given `padding: 24px` to be an accessible touch-target of 48px or larger. TODO: source 
7. The actual navbar content, wrapped in the `.navbar__category` class, is hidden with `opacity: 0` and `z-index: -9999`. 
8. We'll cover this more thoroughly in the JavaScript portion of the post, but I added a `.navbar__category.active` class that sets `opacity: 1` and `z-index: 0` when items ought to be displayed. 
9. I chose `768px` as a mobile breakpoint, mostly out of habit from my Bootstrap days. Your mileage may vary, and you'll want to follow good design habits around breakpoints: focusing on pixel values and testing, vs. trying to target specific devices. 

### Under the breakpoint 

1. We display the `.nav-mobile` element with `display: block`. 
2. I set `.nav-mobile` to be 50x50px because it's an appropriate size for a touch target, and a nice, round number. 
3. The `.nav-mobile` is given `z-index: 1` to sit on top of the navbar and remain clickable when the nav is dropped down. 
4. All of the `.nav-mobile #nav-toggle` styles and other nested attributes are taken directly from [Tania Rascia's Responsive Dropdown Navigation Bar](https://www.taniarascia.com/responsive-dropdown-navigation-bar/). It's a great hamburger menu, tried and true, and I had no reason to mess with it. Thanks, Tania! 
5. The `.navbar` is initially set to `opacity: 0` and `z-index: -1` to hide it, and much like the `.navbar__category` class above the breakpoint, gets set to `opacity: 1` and `z-index: 0` with an `.active` class. 
6. TODO: what changes the mobile navbar category heigh? The relative position? 

TODO: adjoining classes, ID selectors 

```
nav ul {
    padding: 0;
    list-style: none;
}

.nav-mobile {
    display: none;
}

.navbar__categories {
    display: flex;
}

.navbar__categories__header {
    cursor: pointer;
    display: block;
    padding: 24px;
}

.navbar__category {
    opacity: 0;
    position: absolute;
    z-index: -9999;
}

.navbar__category.active {
    opacity: 1;
    z-index: 0;
}

@media all and (max-width: 768px) {
    .nav-mobile {
        display: block;
        height: 50px;
        z-index: 1;
        width: 50px;
    }
    .nav-mobile #nav-toggle {
        cursor: pointer;
        padding: 10px 35px 16px 0;
    }
    .nav-mobile #nav-toggle span,
    .nav-mobile #nav-toggle span:before,
    .nav-mobile #nav-toggle span:after {
        background: #000000;
        cursor: pointer;
        border-radius: 1px;
        height: 5px;
        width: 35px;
        position: absolute;
        display: block;
        content: "";
        transition: all 300ms ease-in-out;
    }
    .nav-mobile #nav-toggle span:before {
        top: -10px;
    }
    .nav-mobile #nav-toggle span:after {
        bottom: -10px;
    }
    .nav-mobile #nav-toggle.active span {
        background-color: transparent;
    }
    .nav-mobile #nav-toggle.active span:before,
    .nav-mobile #nav-toggle.active span:after {
        top: 0;
    }
    .nav-mobile #nav-toggle.active span:before {
        transform: rotate(45deg);
    }
    .nav-mobile #nav-toggle.active span:after {
        transform: rotate(-45deg);
    }
    .navbar {
        opacity: 0;
        position: absolute;
        z-index: -9999;
    }
    .navbar.active {
        opacity: 1;
        z-index: 0;
    }
    .navbar__categories {
        display: block;
    }
    .navbar__categories__header {
        padding-left: 0;
    }
    .navbar__category.active {
        position: relative;
    }
    .multi-col__category {
        position: relative;
    }
}
```

### Bringing the styles together 

With this CSS added to our project, you can expect to see: 

![Markup and additional css on the navbar in sample Rails app](/img/navbar-tutorial/navbar-markup-css.png)

## JavaScript 

In order for our navbar to work and to meet our requirements, we need to use some JavaScript. There are tons of searches and resources out there about CSS-only navbars, and someday I wonder if this common design pattern will be built in to browser components, and all we'll ever need is markup and CSS. But until that day comes, JavaScript must play a role in our final product. 

I was hopeful when I saw Chris Ferdinandi had a blog post aiming towards a CSS-only solution. [He subsequently corrected himself](https://gomakethings.com/i-was-wrong-about-javascript-free-dropdowns/).

We need to give our navbar the ability to: 

1. Explicitly show a targeted navbar item.
2. Explicitly hide a targeted navbar item.
3. Toggle a targeted navbar item when we are unsure of its state. 

These will happen based on events in the browser: 

1. If a user focuses a navbar item, we want to show the navbar.
2. If a user removes focus from a navbar item, we want to hide the navbar.
3. If a user creates standard toggling behavior (mousedown, keydown), we want to toggle the navbar based on its current state. 

So we set up event listeners for focus, blur (when focus is taken away from an object), mousedown, and keydown. Focus shows, blur hides, mousedown toggles, and keydown toggles. 
 
In an early iteration of this script, I set up event listeners in the DOM and registered them independently. It's a common practice, totally valid, but might not scale in the case of a massive mega-menu. This navbar is meant to be the foundation of such an element, so I was concerned about the performance implications of registering so many event handlers. 

Fortunately, Chris Ferdinandi has a great article all about [understanding event delevation, bubbling, and capturing](https://gomakethings.com/whats-the-difference-between-javascript-event-delegation-bubbling-and-capturing/).

Event delegation sounds like the right way to go here. Instead of registering event listeners on all these DOM elements and their children, I just set up one listener to the document for focus, blur, mousedown, and keydown events. But there's a catch: focus and blur events don't bubble up the way we'd hope they do. Again, Chris Ferdinandi saved my bacon and wrote a post about how we can get access to these events by setting up [event capturing](https://gomakethings.com/when-do-you-need-to-use-usecapture-with-addeventlistener/).

The final piece of exposition about this JavaScript is that the `.matches()` function does require a [polyfill for IE11](https://caniuse.com/#search=matches). It is also not supported by Opera Mini whatsoever.

```
# app/assets/javascripts/navbar.js
# Navbar js (linted with ESLint) 
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("focus", function (event) {
    if (event.target.classList) {
      if (event.target.matches(".navbar__link") || event.target.matches(".navbar__categories__list-item")) {
        var list = document.querySelectorAll(".navbar__category, .navbar__categories__header");
        for (var i = 0;i < list.length;i++) {
          if (list[i].classList.contains(event.target.dataset.slug)) {
            list[i].classList.add("active");
          } else {
            list[i].classList.remove("active");
          }
        }
      }
    }
  }, true);
  document.addEventListener("blur", function (event) {
    if (event.target.classList) {
      if (event.target.matches(".navbar__link") || event.target.matches(".navbar__categories__list-item")) {
        var list = document.querySelectorAll(".navbar__category, .navbar__categories__header");
        for (var i = 0;i < list.length;i++) {
          list[i].classList.remove("active");
        }
      }
    }
  }, true);
  document.addEventListener("mousedown", function (event) {
    if (event.target.classList) {
      if (event.target.matches(".navbar__categories__header") || event.target.matches(".navbar__categories__list-item")) {
        var list = document.querySelectorAll(".navbar__category, .navbar__categories__header");
        for (var i = 0;i < list.length;i++) {
          if (list[i].classList.contains(event.target.dataset.slug)) {
            list[i].classList.toggle("active");
          } else {
            list[i].classList.remove("active");
          }
        }
      }
    }
  }, false);
  document.addEventListener("keydown", function (event) {
    var KEY_ENTER = 13;
    var KEY_SPACE = 32;
    switch (event.which) {
      case KEY_ENTER:
      case KEY_SPACE: {
        if (event.target.classList) {
          if (event.target.matches(".navbar__categories__header") || event.target.matches(".navbar__categories__list-item")) {
            var list = document.querySelectorAll(".navbar__category, .navbar__categories__header");
            for (var i = 0;i < list.length;i++) {
              if (list[i].classList.contains(event.target.dataset.slug)) {
                list[i].classList.toggle("active");
              } else {
                list[i].classList.remove("active");
              }
            }
          }
        }
      }
    }
  }, false);
  document.getElementById("nav-toggle").addEventListener("click", function () {
    document.getElementById("nav-toggle").classList.toggle("active");
    document.getElementById("navbar").classList.toggle("active");
  });
  document.getElementById("nav-toggle").addEventListener("keydown", function (event) {
    var KEY_ENTER = 13;
    var KEY_SPACE = 32;
    switch (event.which) {
      case KEY_ENTER:
      case KEY_SPACE: {
        document.getElementById("nav-toggle").classList.toggle("active");
        document.getElementById("navbar").classList.toggle("active");
      }
    }
  });
});
```

## Demo 
Codepen 

## Limitations 

- Super custom content (paragraphs, divs, images, etc) 
- Screen real estate 
- I don't think massive mega navigation is a good design pattern (as evidenced by this website) 
- JavaScript fails to load: noscript? 

## Extensions 

- HTML Templates? 
- Vanilla JS package? 
- Vue component? 
- Ruby gem? 






