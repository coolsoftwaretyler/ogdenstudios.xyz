---
layout: post
title: 'Troubleshooting Devise Redirects with Multiple Models and Turbolinks'
tags: ['post']
description: "I had some problems getting turbolinks redirects to work with multiple Devise models. Here's how I figured it out."
date: 2020-02-18
---

## Using two Devise Models

I pretty much always default to using [Devise](https://github.com/heartcombo/devise) for my Ruby on Rails authentication.

For my current side project built in Rails 6, I've got two authenticating models: `Author` and `Reader`. It makes sense for me to keep these two models entirely separate. It's made my life a lot easier, in general. Using multiple models is supported out of the box with Devise, [with some custom configuration](https://github.com/heartcombo/devise/wiki/How-to-Setup-Multiple-Devise-User-Models). 

## Preventing Cross-model Visits with Devise

Devise provides a [sample solution](https://github.com/heartcombo/devise/wiki/How-to-Setup-Multiple-Devise-User-Models#6-fix-cross-model-visits-fancy-name-for-users-can-visit-admins-login-and-viceversa-and-mess-up-your-auth-tokens) to prevent a logged in `Author` from *concurrently* logging in as a `Reader`, and vice-versa.

I modified the sample code a little bit when I first implemented this. I didn't have anywhere to send them since I built it out early in the development process, so I had each model `redirect_to` the `root_path`. This laid the groundwork for two days of troubleshooting down the road. 

My custom `Accessible` module was initially written like this: 

```
# ../controllers/concerns/accessible.rb
module Accessible
  extend ActiveSupport::Concern
  included do
    before_action :check_user
  end

  protected
  def check_user
    if current_admin
      flash.clear
      # if you have rails_admin. You can redirect anywhere really
      redirect_to(root_path) and return
    elsif current_user
      flash.clear
      # The authenticated root path can be defined in your routes.rb in: devise_scope :user do...
      redirect_to(root_path) and return
    end
  end
end
```

## The Turbolinks Red Herring

As time went on, I built out most of the functionality of the application. I got the MVP working, built out some seed data, and deployed to a staging environment. I did some manual testing and played around with everything, and noticed that whenever I logged in as a sample `Author` or `Reader`, I got redirected to the home page. I assumed I had misconfigured something, so I followed [this wiki article](https://github.com/heartcombo/devise/wiki/How-To:-Redirect-back-to-current-page-after-sign-in,-sign-out,-sign-up,-update) to redirect users back to their last visited page. 

The wiki article provides two different implementations. I tried both and couldn't get it to work for the life of me. I dug in to the helper methods, hard coded returns, ran [byebug](https://github.com/deivid-rodriguez/byebug) sessions, and couldn't quite figure out waht wasn't working. 

But I noticed that both of the methods provided by Devise checked if the request was an [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest). I thought I had identified the bug: I was using [turbolinks](https://github.com/turbolinks/turbolinks) out of the box with Rails 6. I don't know precisely what Turbolinks is doing under the hood, but my understanding is that it uses client-side requests to pre-render pages from the same origin, providing an SPA-like experience. 

I figured Turbolinks navigation was breaking the expected Devise behavior. I found [semi-recent blog posts](https://www.oarod.com/2017/01/29/turbolinks-with-devise/) about this phenomenon. I saw a few issues across the Turbolinks and Devise repositiories. I figured I was on to something. 

## Building a Reduced Test Case

So after I latched on to this idea, I decided I would write a blog post about it. To demonstrate the problem, I spun up a sample Rails app with Turbolinks and Devise. I duplicated my issue. As I went to turn off Turbolinks and demonstrate the root cause, I found this snippet in `config/initializers/devise.rb`: 

```rb
# ==> Turbolinks configuration
# If your app is using Turbolinks, Turbolinks::Controller needs to be included to make redirection work correctly:
#
#  ActiveSupport.on_load(:devise_failure_app) do
#    include Turbolinks::Controller
#  end
```

So I un-commented the piece of configuration, but no luck. There was still a problem. 

## Removing the `current_user` Check

In the [first StoreLocation example](https://github.com/heartcombo/devise/wiki/How-To:-Redirect-back-to-current-page-after-sign-in,-sign-out,-sign-up,-update#storelocation-to-the-rescue), I noticed that `store_location_for(:user, request.fullpath)` was only being triggered if `current_user.present?` returned true. 

But that doesn't track for me. I want to store the location for a `User` (or `Author`, or `Reader`, or whomever) *before they log in*. So I removed that check. In my sample app, with just one `User` Devise model, and with `Turbolinks::Controller` turned on, I implemented the following: 

```rb
# This example assumes that you have setup devise to authenticate a class named User.
class ApplicationController < ActionController::Base
  before_action :store_user_location!, if: :storable_location?
  # The callback which stores the current location must be added before you authenticate the user 
  # as `authenticate_user!` (or whatever your resource is) will halt the filter chain and redirect 
  # before the location can be stored.
  before_action :authenticate_user!

  private
    # Its important that the location is NOT stored if:
    # - The request method is not GET (non idempotent)
    # - The request is handled by a Devise controller such as Devise::SessionsController as that could cause an 
    #    infinite redirect loop.
    # - The request is an Ajax request as this can lead to very unexpected behaviour.
    def storable_location?
      request.get? && is_navigational_format? && !devise_controller? && !request.xhr? 
    end

    def store_user_location!
      # :user is the scope we are authenticating
      store_location_for(:user, request.fullpath)
    end
end
```

And it worked! I figured I had solved my problem. All I needed to do to make it work in my actual application was: 

1. Turn on `Turbolinks::Controller`
2. Implement the first `store_user_location!` method
3. Remove checks for `current_author` and `current_reader`
4. ??? 
5. Profit!

## Hubris. Pure Hubris. 

I made those changes to my application. No luck. I tried the second implementation of `store_user_locaiton!`... no luck. I turned Turbolinks on and off again. No luck. I yelled a little bit into a pillow. No luck, but it felt good. 

I started digging into the differences between the sample application and my real application. I figured the biggest difference was using one Devise model vs. using many. So I started looking at the generated controllers and views for my multiple Devise models. I wrote some experimental code, tried to override `after_sign_in_path_for` from Devise, and still no luck. 

But, if you'll recall, I was [preventing cross-model visits](#preventing-cross-model-visits-with-devise) with my `Accessible` module. For laughs, I turned off the module. Things started working. 

## The Real Culprit: Hardcoded Redirects 

Remember how I told my `Accessible` module to `redirect_to(root_path) and return` in `check_user`? Yeah - me neither. I forgot I had written that method long ago before the application had taken shape. Forgot that I was hardcoding a redirect to the root path. 

So I tapped into the `stored_location_for` method from Devise. I rewrote the `Accessible` module to look like: 

```rb
module Accessible
  extend ActiveSupport::Concern
  included do
    before_action :check_user
  end

  protected

  def check_user
    if current_author
      flash.clear
      redirect_to(stored_location_for(:author)) and return
    elsif current_reader
      flash.clear
      redirect_to(stored_location_for(:reader)) and return
    end
  end
end
```

And everything started working. Now: 

* `Authors` can't log in as `Readers` without signing out first
* `Readers` can't log in as `Authors` without signing out first 
* When a person signs in to either an `Author` or a `Reader` account, they will then be redirected to the last page they were viewing before signing in 
* Turbolinks are still working.