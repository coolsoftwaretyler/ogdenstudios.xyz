---
layout: post
title: 'Testing JSON routes in Rails'
tags: ['RSpec', 'JSON', 'Routing']
description: 'This week I learned a few tricks for testing JSON routes with Ruby on Rails'
---

## Testing JSON Routes with RSpec

This week I improved test coverage for our Rails controllers. We had 0% coverage on our JSON formats in the controller actions. After some troubleshooting, I was able to increase that to 100% coverage. Here are some tricks I learned along the way: 

First, it's always nice to have the [RSpec docs handy](https://relishapp.com/rspec/rspec-rails/docs/request-specs/request-spec#requesting-a-json-response). 

However, the RSpec docs don't provide any useful syntax for using something like [FactoryBot](https://github.com/thoughtbot/factory_bot) with JSON routes. They assume you'll be writing your objects by hand. I had to figure out how to get the JSON from FactoryBot objects. Here's what I found:

Let's say you've got some model, we'll call it `component`. You want to test the `create` action by sending a POST request to `/components.json`. You can do that like so:

```
component = build(:component)
component_attributes = component.attributes.except("id", "created_at", "updated_at")
component_json = { component: component_attributes }.to_json
post "/components.json", params: circle_json, headers: { "CONTENT_TYPE" => "application/json" }
expect(response).to have_http_status(201)
```

You use FactoryBot to `build` the `component` as usual. Then you grab the relevant attributes, which is everything **except** `id`, `created_at`, and `updated_at`. Then you construct a JSON object with a hash and `.to_json` call, and store it in `component_json`. 

You can post this JSON to the endpoint, and set the `CONTENT_TYPE` to `application/json`. 

Finally, expect a [201 HTTP status](https://httpstatuses.com/201), since you're creating an object in the database. 

## Troubleshooting Rails JSON controllers with Postman

Rails controllers use `protect_from_forgery with: :exception` to require an Authenticity Token to prevent [Cross-Site Request Forgery attacks](https://medium.com/rubyinside/a-deep-dive-into-csrf-protection-in-rails-19fa0a42c0ef). 

But sometimes in development, you might want to skip this step. I know for me, sometimes I just want to hit my endpoints with [Postman](https://www.getpostman.com/) and see what happens. 

If that's you and you're willing to accept the risks (i.e. you forget to change the setting back to default), you can set `protect_from_forgery with: :null_session` and [avoid the Authenticity Token requirement](https://stackoverflow.com/questions/16258911/rails-4-authenticity-token). 