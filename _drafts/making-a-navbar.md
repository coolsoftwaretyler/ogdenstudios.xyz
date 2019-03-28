---
layout: post
title: 'Building a semantic, accessible, responsive, and extensible navigation element'
tags: []
description: ''
---
Navigation components are the bane of my existence. They present all sorts of challenges and complexities. A truly good navbar must be semantic, accessible, responsive, and reusable. In my opinion, the best site navigation is small and represents anywhere between three to five different links, each of which leads users to appropriate pages which are either top-level content, or some more detailed content funneling system. I think trying to fit more than five options in a site navigation is an exercise in futility, and a bad design pattern. 

I think some websites successfully implement *mega-menus*, but the appropriate use-cases for these kinds of navigation elements are places like Amazon. The majority of the time, mega-menus are bad for user experience, and represent an unwillingness to be critical about content, site architecture, and user stories. 

But when at my day job or working with clients, I am often handed non-negotiable specifications that call for some sort of massive site navigation. These requirements often scare me, and I've spent a tremendous amount of time building navigation elements that don't meet the **semantic, accessible, responsive, and reusable** requirements. It hurts every time that happens. Recently I took a deep dive into how to make the best possible navbar.

My navbar uses semantic HTML, raw CSS, and vanilla JavaScript. Since I'm a Rails guy, the HTML is generated in a Rails app, but as long as the final markup stays the same, it can be written by hand or through any other framework you like. 

The HTML is semantic and accessible, according to [AChecker](https://achecker.ca) **TODO: fix WCAG warning about onkeydown/onmousedown**

I've linted the CSS with [CSSLint](http://csslint.net/), and the JavaScript with [ESLint](https://eslint.org/demo/). The CSS is X bytes minified and gzipped. The JavaScript is X bytes minimifed and gzipped. 

In order to arrive at my solution, I've consumed tutorial after tutorial and synthesized the information relevant to my requirements. I took lessons learned (and the hamburger menu, to be specific) from [Tania Rascia's Responsive Dropdown Navigation Bar](https://www.taniarascia.com/responsive-dropdown-navigation-bar/). I used concepts and some markup structure from [Adobe's Accessible Mega Menu](https://adobe-accessibility.github.io/Accessible-Mega-Menu/). I incorporated some the ideas from [Smashing Magazine's Building Accessible Menu Systems](https://www.smashingmagazine.com/2017/11/building-accessible-menu-systems/), and I'd like to give a special shout out to [Chris Ferdinandi grappling with this problem and why it's so hard](https://gomakethings.com/i-was-wrong-about-javascript-free-dropdowns/) for inspiring me to write this article. I also relied on Chris pretty heavily when it came to [optimizing my JavaScript using event delegation](https://gomakethings.com/why-event-delegation-is-a-better-way-to-listen-for-events-in-vanilla-js/). 

[understand event delevation, bubbling, and capturing](https://gomakethings.com/whats-the-difference-between-javascript-event-delegation-bubbling-and-capturing/)
[I had to use event capturing for the focus and blur events](https://gomakethings.com/when-do-you-need-to-use-usecapture-with-addeventlistener/)
[depending on your support requirements, you may need some polyfills](https://caniuse.com/#search=matches)

Here are the specifications: 

Our navigation needs to use semantic HTML. It needs to be accessible. It needs to be responsive. It needs to accommodate top-level links, navigation menus with limited options, and navigation menus with a larger body of content/more options. We need to be able to change the content of the navigation with ease and error-free.

## Stack 

I mostly develop Ruby on Rails applications in my day job. 

## Markup 

Let's start with the markup. 

## Styles 

## JavaScript 

## Demo 

## Limitations 

- Super custom content (paragraphs, divs, images, etc) 
- Screen real estate 
- I don't think massive mega navigation is a good design pattern (as evidenced by this website) 

## Extensions 

- HTML Templates? 
- Vanilla JS package? 
- Vue component? 
- Ruby gem? 

Navbar helper 

```
# app/helpers/navbar_helper.rb
module NavbarHelper
    def get_navbar_data
        return data = [
            {
                label: "Home",
                slug: "home",
                nodes: []
            },
          {
              label: "Company",
              slug: "company",
              type: 'single',
              nodes: [
                  {
                      label: 'About us',
                      link: ''
                  },
                  {
                      label: 'Leadership',
                      link: ''
                  },
                  {
                      label: 'News & events',
                      link: ''
                  },
                  {
                      label: 'Information Partners',
                      link: ''
                  },
                  {
                      label: 'Resellers',
                      link: ''
                  },
                  {
                      label: 'Open Data Program',
                      link: ''
                  },
                  {
                      label: 'Maxar family',
                      link: ''
                  }
              ]
          },
          {
              label: 'Products',
              slug: "products",
              type: 'multi',
              nodes: [
                  {
                      label: 'Products',
                      nodes: [
                          {
                              label: 'Overview',
                              link: ''
                          },
                          {
                              label: 'Use cases',
                              link: ''
                          }
                      ]
                  },
                  {
                      label: 'Satellite imagery',
                      nodes: [
                          {
                              label: 'Satellite imagery',
                              link: ''
                          },
                          {
                              label: 'Imagery mosaics',
                              link: ''
                          },
                          {
                              label: 'Short-wave infrared imagery',
                              link: ''
                          },
                          {
                              label: 'Radar imagery',
                              link: ''
                          },
                      ]
                  },
                  {
                      label: 'Subscriptions',
                      nodes: [
                          {
                              label: 'EarthWatch',
                              link: ''
                          },
                          {
                              label: 'FirstLook',
                              link: ''
                          },
                          {
                              label: 'Spatial on Demand',
                              link: ''
                          }
                      ]
                  },
                  {
                      label: 'Information products',
                      nodes: [
                          {
                              label: 'Advanced Elevation Suite',
                              link: ''
                          },
                          {
                              label: 'Building Footprints',
                              link: ''
                          },
                          {
                              label: 'Telco geodata',
                              link: ''
                          }
                      ]
                  },
                  {
                      label: 'Analytics',
                      nodes: [
                          {
                              label: 'GBDX',
                              link: ''
                          }
                      ]
                  },
                  {
                      label: 'Defense & Intelligence',
                      nodes: [
                          {
                              label: 'SecureWatch',
                              link: ''
                          },
                          {
                              label: 'Rapid Access Program',
                              link: ''
                          },
                          {
                              label: 'Direct Access Program',
                              link: ''
                          }
                      ]
                  },
                  {
                      label: 'US Government',
                      nodes: [
                          {
                              label: 'EnhancedView Web-Hosting Services',
                              link: ''
                          }
                      ]
                  },
              ]
          },
          {
              label: "Markets we serve",
              slug: "markets-we-serve",
              type: 'single',
              nodes: [
                  {
                      label: 'Automotive',
                      link: ''
                  },
                  {
                      label: 'Global Development',
                      link: ''
                  },
                  {
                      label: 'International Defense & Intelligence',
                      link: ''
                  },
                  {
                      label: 'Telecommunications',
                      link: ''
                  },
                  {
                      label: 'U.S. Government',
                      link: ''
                  }
              ]
          },
          {
              label: 'Careers',
              slug: "careers",
              type: 'single',
              nodes: [
                  {
                      label: 'Why join us',
                      link: ''
                  },
                  {
                      label: 'View opportunities',
                      link: ''
                  }
              ]
          },
          {
              label: 'Contact',
              slug: "contact",
              type: 'single',
              nodes: [
                  {
                      label: 'Customer service',
                      link: ''
                  },
                  {
                      label: 'Locations',
                      link: ''
                  },
                  {
                      label: 'Media requests',
                      link: ''
                  },
                  {
                      label: 'Sales inquiries',
                      link: ''
                  }
              ]
          },
          {
              label: 'Get started',
              slug: "get-started",
              type: 'single',
              nodes: [
                  {
                      label: 'Explore products',
                      link: ''
                  },
                  {
                      label: 'Search for imagery',
                      link: ''
                  },
                  {
                      label: 'Resources',
                      link: ''
                  },
                  {
                      label: 'Product samples',
                      link: ''
                  }
              ]
          },
          {
              label: 'Log in',
              slug: "log-in",
              type: 'single',
              nodes: [
                  {
                      label: 'EarthWatch',
                      link: ''
                  },
                  {
                      label: 'EnhancedView Web-Hosting Services',
                      link: ''
                  },
                  {
                      label: 'GBDX',
                      link: ''
                  },
                  {
                      label: 'PartnerView',
                      link: ''
                  },
                  {
                      label: 'SecureWatch',
                      link: ''
                  },
                  {
                      label: 'Tomnod',
                      link: ''
                  }
              ]
          }
      ]
          end
    def get_admin_navbar
        return data = [
            {
                label: "Admin",
                slug: "admin",
                type: 'single',
                nodes: [
                    {
                        label: 'Dashboard',
                        link: ''
                    },
                    {
                        label: 'Documents',
                        link: ''
                    },
                    {
                        label: 'Leadership',
                        link: ''
                    },
                    {
                        label: 'Open Data',
                        link: ''
                    },
                    {
                        label: 'Pages',
                        link: ''
                    },
                    {
                        label: 'Partners',
                        link: ''
                    },
                    {
                        label: 'Product Samples',
                        link: ''
                    },
                    {
                        label: 'Sales Territories',
                        link: ''
                    },
                    {
                        label: 'Webinars',
                        link: ''
                    },
                ]
            },
        ]
    end
  end
```

Main navbar partial 

```
# app/views/layouts/navbar/_navbar.html.erb
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

Navbar brand 

```
# app/views/layouts/navbar/_navbar_brand.html.erb
<%= link_to root_path do %>
  <div class="brand">
  Home
  </div>
<% end %>
```

Navbar single column 

```
# app/views/layouts/navbar/_navbar_single_col_panel.html.erb
<div class="navbar__single-col-panel">
  <span class="navbar__categories__header <%= data[:slug] %>" onmousedown="toggleNavbar('<%= data[:slug]%>')" ><%= data[:label]%></span>
  <ul class="navbar__single-col navbar__category <%= data[:slug] %>">
    <% data[:nodes].each do |node|%>
      <li class="navbar__category__item">
        <% if node[:link] %>
          <a class="navbar__link" 
            href="<%= node[:link] %>" 
            onblur="hideNavbar()" 
            onfocus="displayNavbar('<%= data[:slug]%>')"
            <%= node[:newtab] ? 'target="_blank"' : ''%>
          ><%= node[:label] %></a>
        <% else %>
          <span><%= node[:label] %></span>
        <% end %>
      </li>
    <% end %>
  </ul>
</div>
```

Navbar multi column 

```
# app/views/layouts/navbar/_navbar_multi_col_panel.html.erb
<div class="navbar__multi-col-panel">
  <span class="navbar__categories__header <%= data[:slug] %>" onmousedown="toggleNavbar('<%= data[:slug]%>')"><%= data[:label]%></span>
  <ul class="navbar__multi-col navbar__category <%= data[:slug] %> ">
    <% data[:nodes].each do |node|%>
      <li>
        <span><%= node[:label] %></span>
        <ul class="multi-col__category">
          <% node[:nodes].each do |item| %>
            <li class="multi-col__category__item">
              <% if item[:link] %>
                <a class="navbar__link" 
                   href="<%= item[:link] %>" 
                   onblur="hideNavbar()" 
                   onfocus="displayNavbar('<%= data[:slug]%>')"
                   <%= item[:newtab] ? 'target="_blank"' : ''%>
                ><%= item[:label] %></a>
              <% else %>
                <span><%= item[:label] %></span>
              <% end %>
            </li>
          <% end %>
        </ul>
      </li>
    <% end %>
  </ul>
</div>
```

Navbar js (linted with ESLint) 

```
# app/assets/javascripts/navbar.js
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
  document.addEventListener("mousdown", function (event) {
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

Navbar css (linted with CSSLint)

```
# app/assets/stylesheets/navbar.css
nav ul {
    padding: 0;
}

.nav-mobile {
    display: none;
}

.navbar ul {
    list-style: none;
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

.navbar .multi-col__category {
    padding-left: 0;
}

@media all and (max-width: 1080px) {
    .nav-mobile {
        display: block;
        height: 50px;
        z-index: 2;
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
        z-index: -1;
    }
    .navbar.active {
        opacity: 1;
        z-index: 1;
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