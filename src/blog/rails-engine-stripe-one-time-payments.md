---
layout: post
title: 
tags: ['post']
description:
date:
---

## 

[Rails engines](https://guides.rubyonrails.org/engines.html)

## Generate the engine

```sh
rails plugin new ogdenpaymentprocessor --mountable 
```

## Update the gemspec

`ogden-payment-processor.gemspec` will have some `TODO` items leftover from the generator, including: 

* `homepage`
* `summary`
* `description`

```rb
# ogden-payment-processor.gemspec
# . . . other config here
  spec.homepage    = "https://ogdenstudios.xyz"
  spec.summary     = "Adds Stripe one-time payment capability"
  spec.description = "Adds Stripe one-time payment capability"
# . . . the rest of the gemspec 
```

Then run `bundle`. Once the installation is complete, you can check the engine is running by running `rails s` in the console and visiting `localhost:3000`. 

## Add Stripe to the engine

To add gems to the engine we use the `gemspec` instead of the `Gemfile` you might be used to in a Rails application. 

We'll add the [Stripe gem](https://github.com/stripe/stripe-ruby) like so: 

```rb
# ogden-payment-processor.gemspec 
# . . . other configuration here
  spec.add_dependency "stripe"
# . . . the rest of the gemspec
```

Then `bundle` again. 

## Create the payment_intents controller

Stripe uses [PaymentIntents](https://stripe.com/docs/api/payment_intents) to process payments. We'll take information from the customer, create a PaymentIntent, and then send that PaymentIntent for Stripe to charge the customer. 

Let's build out a controller action to create the PaymentIntent. We'll add a file at `app/controllers/ogdenpaymentprocessor/payment_intents_controller.rb`. Inside, we write: 

```rb
# app/controllers/ogdenpaymentprocessor/payment_intents_controller.rb
module Ogdenpaymentprocessor
    class PaymentIntentsController < ApplicationController
        def create 
        @intent = Stripe::PaymentIntent.create({
            amount: params[:amount],
            currency: 'usd',
        })
        render json: @intent
        end
    end
end
```

This method will use the Stripe gem to create a PaymentIntent with the amount passed in through `params`, and render a JSON response of the PaymentIntent, which we'll use on the front end to make a payment through Stripe. 

## Add the PaymentIntent create route

In `config/routes.rb`, add the `create` route for `payment_intents`. I'll write that like this: 

```rb
# config/routes.rb
Ogdenpaymentprocessor::Engine.routes.draw do
    resources :payment_intents, only: [:create]
end
```

## Add the form 

We'll create a partial for the payment form at `app/views/layouts/ogdenpaymentprocessor/partials/_payment_form.html.erb`, and inside, we'll write: 

```html
<form id="payment-form">
  <div>
    <label for="amount">Amount (USD)</label>
    <input
        id="amount"
        type="tel"
        placeholder="100.00"
        required=""
        autocomplete="tel"
        pattern="(?=.*?\d)^\$?(([1-9]\d{0,2}(\d{3})*)|\d+)?(\.\d{1,2})?$"
    />
    </div>
    <div id="card-element">
      <!-- Elements will create input elements here -->
    </div>
    <!-- We'll put the error messages in this element -->
    <div id="card-errors" role="alert"></div>
    <button id="submit">Pay</button>
</form>
```

This partial will render a form element with an input for amount (which uses a regular expression to format the amount), a card elements location, and a submit button. 

## Add the client-side JavaScript

