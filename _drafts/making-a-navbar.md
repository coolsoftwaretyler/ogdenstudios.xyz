---
layout: post
title: 'Building a semantic, accessible, responsive, and extensible navigation element'
tags: ['navigation', 'ux', 'mega-menus', 'html5', 'css', 'vanilla javascript', 'semantic html', 'accessibility', 'responsive web design', 'ruby on rails']
description: 'Building website navigations can be difficult. This tutorial covers building a large site navigation that is semantic, accessible, responsive, and reusable.'
---
Navigation components present all sorts of challenges and complexities. A good navbar must be semantic, accessible, responsive, and reusable. In my opinion, the best site navigation is small and contains between three to five different links, each of which leads users to top-level content, or some more detailed content funnels. In my opinion, trying to fit more than five options in a site navigation is not usually worth the difficulty. 

Some websites successfully implement mega-menus, but the appropriate use cases for these kinds of navigation elements are places like Amazon. For most cases, I don't think they're the right decision. If you can, consider paring down your site navigation. 

Sometimes, though, we're handed non-negotiable specifications that call for massive site navigation. These requirements often intimidate me. I've spent a tremendous amount of time building navigation elements that don't meet the **semantic, accessible, responsive, and reusable** requirements. It hurts every time that happens. Recently I took a deep dive into how to make the best possible navbar so it would never happen again.

My solution uses HTML5, raw CSS, and vanilla JavaScript. Since I'm a Rails guy, the HTML is generated in a Rails application, but as long as the final markup stays the same, it can be written by hand or generated through any other framework you like. 

The HTML is semantic and accessible, according to [AChecker](https://achecker.ca).

I've linted the CSS with [CSSLint](http://csslint.net/), and the JavaScript with [ESLint](https://eslint.org/demo/). The CSS is X bytes minified and gzipped. The JavaScript is X bytes minimifed and gzipped. TODO: get min/gzipped sizes.

In order to arrive at my solution, I've read tutorial after tutorial. This final product the responsive hamburger navigation from [Tania Rascia's Responsive Dropdown Navigation Bar](https://www.taniarascia.com/responsive-dropdown-navigation-bar/). I used concepts and some markup from [Adobe's Accessible Mega Menu](https://adobe-accessibility.github.io/Accessible-Mega-Menu/). I used ideas from [Smashing Magazine's Building Accessible Menu Systems](https://www.smashingmagazine.com/2017/11/building-accessible-menu-systems/), and I'd like to give a special shout out to [Chris Ferdinandi grappling with this problem and why it's so hard](https://gomakethings.com/i-was-wrong-about-javascript-free-dropdowns/). His blog posts inspired me to write my own. I also relied on Chris pretty heavily when it came to [optimizing my JavaScript using event delegation](https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/). 

## Specifications 

Our navigation needs to use semantic HTML. It needs to be accessible. It needs to be responsive. It needs to accommodate top-level links, navigation items with limited options, and items with a larger body of content/more options. We need to be able to change the content of the navigation with ease.

## Stack 

I do the bulk of my work in Ruby on Rails, so I generated the markup using embedded Ruby. The markup of the navbar is generated with data returned by a Rails helper function. But at the end of the day, all that compiles down to semantic, valid HTML. That means you can ignore the Rails part if you need and just focus on creating the final HTML. I wrote this in Rails 5.2, but considering I'm not using any bleeding-edge Rails utilities, this should work with most Rails versions. 

## Markup 

The entry point into the navbar partial is the `_navbar.html.erb` file. The root element is a semantic `nav` component. The partial looks like this: 

```
# app/views/layouts/navbar/_navbar.html.erb
# Main navbar partial 
<% navbar_data = get_navbar_data %>
<nav>
  <div class="nav-mobile">
    <span id="nav-toggle" class="nav-toggle"><span></span></span>
  </div>
  <div id="navbar" class="navbar" tabindex="0">
    <ul class="navbar__categories" tabindex="0">
      <% navbar_data.each do |node| %>
        <li class="navbar__categories__list-item" data-slug="<%= node[:slug] %>" tabindex="0">
          <% if node[:type] == 'top-level' %>
            <a class="navbar__categories__header" data-slug="<%= node[:slug]%>" href="<%= node[:link] %>"><%= node[:label] %></a>
          <% elsif node[:type] == 'single'%>
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

The first line retrieves a hash with the data for the navbar. The specific implementation of this isn't important. In production, I do some fancy footwork: query routes, controllers, etc., and come up with a comprehensive and adaptable navigation structure. To start, you can just set up a helper method to return a static hash. It might look something like this: 

```
# app/helpers/navbar_helper.rb
# Navbar helper 
module NavbarHelper
  def get_navbar_data
    return data = [{
        label: 'Home',
        slug: 'home',
        type: 'top-level',
        link: '#!'
      },
      {
        label: 'Single',
        slug: 'single',
        type: 'single',
        nodes: [{
            label: 'About',
            link: '#!'
          },
          {
            label: 'Contact',
            link: '#!'
          },
          {
            label: 'Blog',
            link: '#!'
          }
        ]
      },
      {
        label: 'Multiple',
        slug: 'multiple',
        type: 'multi',
        nodes: [{
            label: 'Category 1',
            nodes: [{
                label: 'Item 1',
                link: '#!'
              },
              {
                label: 'Item 2',
                link: '#!'
              }
            ]
          },
          {
            label: 'Category 2',
            nodes: [{
                label: 'Item 1',
                link: '#!'
              },
              {
                label: 'Item 2',
                link: '#!'
              },
              {
                label: 'Item 3',
                link: '#!'
              },
              {
                label: 'Item 4',
                link: '#!'
              }
            ]
          },
          {
            label: 'Category 3',
            nodes: [{
                label: 'Item 1',
                link: '#!'
              },
              {
                label: 'Item 2',
                link: '#!'
              },
              {
                label: 'Item 3',
                link: '#!'
              }
            ]
          }
        ]
      }
    ] 
  end
end
```

This sample structure represents only a starting point of what you can do. I use a hash because I'm working in Ruby, but if you're doing most of your work in JavaScript, you could represent this as JSON or any other format - as long as it's predictable and allows you to generate your HTML correctly. You could add additional attributes to the markup and render them as necessary. 

This example data is not meant to be exhaustive, but it represents the three types of elements I usually expect to encounter in a navbar:

1. Top level links 
2. Single category lists of links
3. Multiple category lists of links

### Top level links

If the partial encounters a `top-level` type node, it renders an anchor element with the `.navbar__categories__header` class and an custom attribute, `data-slug`. The href points to the node's `link`, and its text is rendered from the node's `label`. 

That all happens here: 

```
<a class="navbar__categories__header" data-slug="<%= node[:slug]%>" href="<%= node[:link] %>"><%= node[:label] %></a>
```

### Single category list of links

If the navbar partial runs into a `single` type node, it will pass that to the `_navbar_single_col_panel.html.erb` partial, which looks like this: 

```
# app/views/layouts/navbar/_navbar_single_col_panel.html.erb
# Navbar single column 
<div class="navbar__single-col-panel" data-slug="<%= data[:slug]%>">
  <span class="navbar__categories__header" data-slug="<%= data[:slug]%>"><%= data[:label]%></span>
  <ul class="navbar__single-col navbar__category" data-slug="<%= data[:slug]%>">
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

This inserts a `.navbar__single-col-panel` `div` as a list item in the unordered list with classname of `.navbar__categories` (from the root `_navbar` partial) We give this `div` a `data-slug` attribute with the node's slug. The `div`'s first child is a `span`, which gets the `.navbar__categories__header` class. This span gets a custom attribute of the same name, with `data-slug="<%= data[:slug]%>"` as well. The span's inner content is the `data[:label]`, again pulled from the hash. 

Under the span is another unordered list, with the classes `.navbar__single-col` and `.navbar__category`. We wire this up with the corresponding `data-slug` attribute as well.

Then ruby iterates over the inner nodes and creates a list item of class `.navbar__category__item`. Each node becomes an anchor with a `data-slug` attribute that matches the slug of this category, and an href that points to the link. The link text is created from that node's `label` attribute. We'll use the `data-slug` attribute in our JavaScript to determine associations as we check for which elements ought to be treated together.

### Multiple category list of links

If the navbar partial runs into a multiple column category, it will pass it to the `_navbar_multi_col_panel.html.erb` file, which looks like this: 

```
# app/views/layouts/navbar/_navbar_multi_col_panel.html.erb
# Navbar multi column 
<div class="navbar__multi-col-panel" data-slug="<%= data[:slug]%>">
  <span class="navbar__categories__header" data-slug="<%= data[:slug]%>"><%= data[:label]%></span>
  <ul class="navbar__multi-col navbar__category" data-slug="<%= data[:slug]%>">
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

This inserts a `.navbar__mutli-col-panel` div as a list item in the unordered list with classname of `.navbar__categories`. The div starts with a span, which gets the `.navbar__categories__header` class. This span gets a custom data attribute of the same name, with `data-slug="<%= data[:slug]%>"`. The span's inner content is the `data[:label]`, again made available through the hash. 

Under the span is another unordered list, with the classes `.navbar__multi-col` abd `.navbar__category`.

Then ruby iterates over the inner nodes and creates a list item with a nested unordered list inside of it, with the class `.multi-col__category`. 

Ruby iterates one more time over the inner nodes of each node and each becomes an anchor with a `data-slug` attribute that matches the slug of this category, and an href with the link. The link text is created from that node's `label` attribute. 

### Bringing the markup together 

If you were to set up a Rails application and use these helpers and partials to render a page, you would see the following: 

![Markup only navbar in sample Rails app](/img/navbar-tutorial/navbar-markup.png)

The generated markup looks like this: 

```
<nav>
  <div class="nav-mobile">
    <span id="nav-toggle" class="nav-toggle"><span></span></span>
  </div>
  <div id="navbar" class="navbar" tabindex="0">
    <ul class="navbar__categories" tabindex="0">
      <li class="navbar__categories__list-item" data-slug="home" tabindex="0">
        <a class="navbar__categories__header" data-slug="home" href="#!">Home</a>
      <li class="navbar__categories__list-item" data-slug="single" tabindex="0">
        <div class="navbar__single-col-panel" data-slug="single">
          <span class="navbar__categories__header" data-slug="single">Single</span>
          <ul class="navbar__single-col navbar__category" data-slug="single">
            <li class="navbar__category__item">
              <a class="navbar__link" data-slug="single" href="#!">
              About
              </a>
            </li>
            <li class="navbar__category__item">
              <a class="navbar__link" data-slug="single" href="#!">
              Contact
              </a>
            </li>
            <li class="navbar__category__item">
              <a class="navbar__link" data-slug="single" href="#!">
              Blog
              </a>
            </li>
          </ul>
        </div>
      <li class="navbar__categories__list-item" data-slug="multiple" tabindex="0">
        <div class="navbar__multi-col-panel" data-slug="multiple">
          <span class="navbar__categories__header" data-slug="multiple">Multiple</span>
          <ul class="navbar__multi-col navbar__category" data-slug="multiple">
            <li>
              <span>Category 1</span>
              <ul class="multi-col__category">
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 1</a>
                </li>
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 2</a>
                </li>
              </ul>
            </li>
            <li>
              <span>Category 2</span>
              <ul class="multi-col__category">
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 1</a>
                </li>
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 2</a>
                </li>
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 3</a>
                </li>
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 4</a>
                </li>
              </ul>
            </li>
            <li>
              <span>Category 3</span>
              <ul class="multi-col__category">
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 1</a>
                </li>
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 2</a>
                </li>
                <li class="multi-col__category__item">
                  <a class="navbar__link" data-slug="multiple"href="#!" >Item 3</a>
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

I've deployed a sample app to Heroku. You can find it [here](https://navbar--rails.herokuapp.com). Keep in mind, Heroku free-tier servers have a spin up time, so it may be slow to load if it hasn't received traffic in the last 30 minutes. 

## Styles 

The goal of this navbar is to make something easily extensible, so I haven't designed comprehensive styles. These styles are everything you need for a basic layout to work, nothing more. It's raw CSS with no errors or warnings from CSSLint. 

```
# app/assets/stylesheets/navbar.css
# Base navbar styles
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
    position: absolute;
    left: -9999px;
}
.navbar__category--active {
    left: unset;
}
@media all and (max-width: 768px) {
    .nav-mobile {
        display: block;
        height: 50px;
        z-index: 1;
        width: 50px;
    }
    .nav-mobile .nav-toggle {
        cursor: pointer;
        padding: 10px 35px 16px 0;
    }
    .nav-mobile .nav-toggle span,
    .nav-mobile .nav-toggle span:before,
    .nav-mobile .nav-toggle span:after {
        background: #000000;
        cursor: pointer;
        border-radius: 1px;
        height: 5px;
        width: 35px;
        position: absolute;
        display: block;
        content: "";
    }
    .nav-mobile .nav-toggle span:before {
        top: -10px;
    }
    .nav-mobile .nav-toggle span:after {
        bottom: -10px;
    }
    .nav-mobile .nav-toggle--active span {
        background-color: transparent;
    }
    .nav-mobile .nav-toggle--active span:before,
    .nav-mobile .nav-toggle--active span:after {
        top: 0;
    }
    .nav-mobile .nav-toggle--active span:before {
        transform: rotate(45deg);
    }
    .nav-mobile .nav-toggle--active span:after {
        transform: rotate(-45deg);
    }
    .navbar {
        position: absolute;
        left: -9999px;
    }
    .navbar--active {
        left: unset;
    }
    .navbar__categories {
        display: block;
    }
    .navbar__categories__header {
        padding-left: 0;
    }
    .navbar__category--active {
        position: relative;
    }
    .multi-col__category {
        position: relative;
    }
}
```

### Default styles above "mobile" breakpoint

1. I don't want the standard `ul` padding, so I set every `ul` nested within the `nav` to have `padding: 0`. 
2. Similarly, I have no need for the dots and other list-item decoration, so I set `list-style: none`.
3. I truly don't want `nav-mobile` to be displayed above the breakpoint, so `display: none` is appropriate there. 
4. I use `display: flex` for an easily responsive `.navbar__categories` element. Flexbox is an excellent choice for one-dimensional responsive styles. 
5. Since `.navbar__categories__header` is going to be a focusable and clickable `span` element, I set `cursor: pointer` to indicate that.
6. The `.navbar__categories__header` is given `padding: 24px` to be an [accessible touch-target of 48px or larger](https://developers.google.com/web/fundamentals/accessibility/accessible-styles).
7. The actual navbar content, wrapped in the `.navbar__category` class, is hidden with absolute positioning and `left: -9999px`. When given the `.navbar__category--active` class, I `unset` the value instead of setting it to `0` - to keep it in line with its higher level element.
8. I chose `768px` as a mobile breakpoint, mostly out of habit from design frameworks I've used in the past. Your mileage may vary, and you'll want to follow good design habits around breakpoints: focusing on pixel values and testing, vs. trying to target specific devices. 

### Under the breakpoint 

1. We display the `.nav-mobile` element with `display: block`. 
2. I set `.nav-mobile` to be 50x50px because it's an appropriate size for a touch target, and a nice, round number. 
3. The `.nav-mobile` is given `z-index: 1` to sit on top of the navbar and remain clickable when the nav is dropped down. 
4. All of the `.nav-mobile #nav-toggle` styles and other nested attributes are taken directly from [Tania Rascia's Responsive Dropdown Navigation Bar](https://www.taniarascia.com/responsive-dropdown-navigation-bar/). It's a great hamburger menu, tried and true, and I had no reason to mess with it. Thanks, Tania! 
5. The `.navbar` is initially set to `position: absolute` and `left: -9999px` to hide it, and much like the `.navbar__category--active` class above the breakpoint, `.navbar__category--active` sets `left: unset`. 
 
### Bringing the styles together 

With this CSS added to our project, you can expect to see: 

![Markup and additional css on the navbar in sample Rails app](/img/navbar-tutorial/navbar-markup-css.png)

Again, you can view the live version at the [navbar--rails heroku app](http://navbar--rails.herokuapp.com/).

## JavaScript 

In order for our navbar to truly work, we need to use some JavaScript. I hope this common design pattern will someday be a native HTML5 element, and all we'll ever need is markup and CSS. Until that day comes, JavaScript must play a role in our final product. 

We need to give our navbar the ability to: 

1. Explicitly show a targeted navbar item.
2. Explicitly hide a targeted navbar item.
3. Toggle a targeted navbar item when we are unsure of its state. 

These will happen based on events in the browser: 

1. If a user focuses a navbar item, we want to show the navbar.
2. If a user removes focus from a navbar item, we want to hide the navbar.
3. If a user emits toggling behavior (`mousedown`, `keydown`), we want to toggle the navbar based on its current state. 

So we set up event listeners for `focus`, `blur`, `mousedown`, and `keydown`. `Focus` shows, `blur` hides, `mousedown` toggles, and `keydown` toggles. 
 
In an early iteration of this script, I set up event listeners in the DOM and registered them in the HTML generation. It's a common practice, totally valid, but might not scale in the case of a massive mega-menu. This navbar is meant to be the foundation of such an element, so I was concerned about the performance implications of registering so many event handlers. 

Fortunately, Chris Ferdinandi has a great article all about [understanding event delevation, bubbling, and capturing](https://gomakethings.com/whats-the-difference-between-javascript-event-delegation-bubbling-and-capturing/).

Event delegation sounds like the right way to go here. Instead of registering event listeners on all these DOM elements and their children, I just set up one listener to the document for `focus`, `blur`, `mousedown`, and `keydown` events. But there's a catch: `focus` and `blur` events don't bubble up the way I need them to. Again, Chris Ferdinandi saved my bacon and wrote a post about how we can get access to these events by setting up [event capturing](https://gomakethings.com/when-do-you-need-to-use-usecapture-with-addeventlistener/).

Setting up event listeners requires their targets to exist, and that requires the entire DOM content to be loaded in. Since this component is expected to Just Work, regardless of context,I wrapped it in a `DOMContentLoaded` event listener. It won't start until the DOM Content is loaded, meaning you can include the script in any way shape or form, independent of build process. 

The script then sets up event listeners on `focus`, `blur`, `mousedown`, and `keydown`. Each one has an `if` statement which only executes if the target of the event has a classList. This is because the first piece of real application logic happens when the callback functions attempt to match the event target with `.navbar__categories__header` or `.navbar__categories__list-item`. `.matches()` requires a classList to run appropriately. Without it, some browsers throw errors. This happens specifically if the event's target is the `HTMLDocument`. 

So if an event fires, and its target has a classList, the callback checks to see what that target was. If it was a `.navbar__link` or `.navbar__categories__list-item`, focus events will trigger the navbar to display and blur events will trigger the navbar to be hidden. 

If the event target was a `.navbar__categories__header` or `.navbar__categories__list-item` on `mousedown` or `keydown`, then we believe the user is attempting to toggle that item and run the navbar toggle logic. 

We use `mousedown` instead of `click` for the toggle, because `click` events trigger `focus`, and the toggle happens an extra time because of the `focus` event listener. `mousedown` happens before `focus` is set, and can be used to effectively signal a user's desire to toggle a button. 

In the `keydown` event listener, we set variables `KEY_ENTER` and `KEY_SPACE` so the callback only fires when a user presses enter or the spacebar. 

The show callback iterates over every `.navbar__category` and `.navbar__categories__header` and compares its `data-slug` attribute with the `data-slug` attribute of the target. If they match, it gets the `.navbar__category--active`. If they don't, the class is removed. 

In the hide callback, we iterate over every `.navbar__category` and `.navbar__categories__header` and remove the `.navbar__category--active` class. 

The toggle callback functions like the show callback, but uses `toggle` instead of `add`. 

The `#nav-toggle` element gets a similar treatment, although in this case, since it only ever needs to toggle, we can use `click` listeners and `keydown` listeners, and I add `nav-toggle--active` and `.navbar--active`. 

The final piece of exposition about this JavaScript is that the `.matches()` function does require a [polyfill for Internet Explorer](https://caniuse.com/#search=matches). It is also not supported by Opera Mini whatsoever. The [internet explorer polyfill is pretty simple](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches), so I add that at the top of my script. If you support Opera Mini, you might want to use something like [Document.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) and check for matching classes. 

Here's the full JavaScript for my navbar. 

```
# app/assets/javascripts/navbar.js
# Navbar js (linted with ESLint) 
document.addEventListener("DOMContentLoaded", function () {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }
  document.addEventListener("focus", function (event) {
    if (event.target.classList) {
      if (event.target.matches(".navbar__link") || event.target.matches(".navbar__categories__list-item")) {
        var list = document.getElementsByClassName("navbar__category");
        for (var i = 0;i < list.length;i++) {
          if (list[i].dataset.slug === event.target.dataset.slug) {
            list[i].classList.add("navbar__category--active");
          } else {
            list[i].classList.remove("navbar__category--active");
          }
        }
      }
    }
  }, true);
  document.addEventListener("blur", function (event) {
    if (event.target.classList) {
      if (event.target.matches(".navbar__link") || event.target.matches(".navbar__categories__list-item")) {
        var list = document.getElementsByClassName("navbar__category");
        for (var i = 0;i < list.length;i++) {
          list[i].classList.remove("navbar__category--active");
        }
      }
    }
  }, true);
  document.addEventListener("mousedown", function (event) {
    if (event.target.classList) {
      if (event.target.matches(".navbar__categories__header") || event.target.matches(".navbar__categories__list-item")) {
        var list = document.getElementsByClassName("navbar__category");
        for (var i = 0;i < list.length;i++) {
          if (list[i].dataset.slug === event.target.dataset.slug) {
            list[i].classList.toggle("navbar__category--active");
          } else {
            list[i].classList.remove("navbar__category--active");
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
            var list = document.getElementsByClassName("navbar__category");
            for (var i = 0;i < list.length;i++) {
              if (list[i].dataset.slug === event.target.dataset.slug) {
                list[i].classList.toggle("navbar__category--active");
              } else {
                list[i].classList.remove("navbar__category--active");
              }
            }
          }
        }
      }
    }
  }, false);
  document.getElementById("nav-toggle").addEventListener("click", function () {
    document.getElementById("nav-toggle").classList.toggle("nav-toggle--active");
    document.getElementById("navbar").classList.toggle("navbar--active");
  }, false);
  document.getElementById("nav-toggle").addEventListener("keydown", function (event) {
    var KEY_ENTER = 13;
    var KEY_SPACE = 32;
    switch (event.which) {
      case KEY_ENTER:
      case KEY_SPACE: {
        document.getElementById("nav-toggle").classList.toggle("nav-toggle--active");
        document.getElementById("navbar").classList.toggle("navbar--active");
      }
    }
  }, false);
});
```

### Bringing it all together 

Now that we've covered the markup, styles, and JavaScript for the navigation element, you can see the full demo on CodePen: 

<p class="codepen" data-height="500" data-theme-id="0" data-default-tab="html,result" data-user="ogdenstudios" data-slug-hash="oOvWZb" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="Semantic, accessible, responsive, and extensible navigation element">
  <span>See the Pen <a href="https://codepen.io/ogdenstudios/pen/oOvWZb/">
  Semantic, accessible, responsive, and extensible navigation element</a> by Tyler Scott Williams (<a href="https://codepen.io/ogdenstudios">@ogdenstudios</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Limitations 

This navbar is intended to be the best possible implementation of a reusable solution to a common problem I face: building accessible, responsive, and extensible navigations with a large number and variation of items. It still has some limitations in application. 

1. First, I can't guarantee that any changes you make to markup inside categories will automatically be valid. If you change, add, or remove elements in the markup, consider checking your final output for WCAG compliance. You could certainly find a valid, accessible, and semantic way to add custom content like paragraphs, inner `div`s, images, and other content. But it's imperative that accessibility is your primary concern when doing so. 

2. I don't think mega-menus are a great design pattern. You could probably tell by my website navigation. I think the best case scenario is limiting your site navigation scope so you don't need such a comprehensive solution to the problem. 

3. This solution requires JavaScript. It's a very minimal and backwards-compatible JavaScript requirement, and I've done everything to remove dependencies from this project, but it still requires JavaScript. If you're extending this solution, you should consider incorporating a `<noscript>` element that covers users who don't load JavaScript. 

4. Callback hell. I recognize that using vanilla JavaScript here means I summoned the Devil of Callback Hell. That was intentional, and difficult to avoid while reducing dependencies and making the script as universal as possible. The great thing about modern JavaScript is all the syntactic sugar out there. It would be a relatively small lift to port this script over to your favorite framework or JavaScript standard, I think. 

## Next steps

I'm hoping the internet at large agrees with me that I've found an optimal solution for site navigation here. If that's not the case, I'd love to know what I missed. I've invested quite a bit of time here and solving this problem appropriately: with an emphasis on accessibility, responsive design, and reusability is important to me. Please send me an email or even submit a pull request on [ogdenstudios.xyz] to edit this blog post with your suggestions, or a pull request against [the sample rails project]() to show me where I can improve. 

I think an [HTML template]() for this component is a great use case. I'd love to implement it that way for greater reusability and portability. 

Also considering the ubiquity and ease of use of [npm], I'd be interested in building this into a vanilla JavaScript or Vue component for others to quickly import into projects. A ruby gem is a great target here, too. 






