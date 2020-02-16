---
layout: post
title: Refactoring Personal Data out of a Devise Model
tags: ['post']
description: "Sticking user data in a Devise model is a Rails anti-pattern. Here's how I refactored my Reader model."
date: 2020-02-16
---

I'm working on [Ruby on Rails](https://rubyonrails.org/) application. It's an ecommerce platform for print creators. My minimum viable product is working, and it's time to roll up my sleeves and refactor the code to get it production-ready. 

## What needs to change about my Reader Model?

The basic authentication model is the `Reader`. It represents what you might consider to be a `User` in other applications. 

This model is built with [Devise](https://github.com/heartcombo/devise). When I first wrote it, I also used it to store profile information for each reader. 

After some great conversations in the [Ruby on Rails Link Slack](https://www.rubyonrails.link/), I've come to understand that my authentication model shouldn't be responsible for managing user data. It sort of violates the [single responsibility principle](https://www.rubyonrails.link/). And practically speaking, every attribute follows the `current_reader` object in controllers and views. So if I have a logged-in `Reader` on the home page, the view knows all of its attributes. In my case, that only includes a `first_name` and `last_name` column, but this approach can lead to problems down the road.

If I continue to add reader data in the `Reader` model, I will be loading a lot of unnecessary data in each request with the `current_reader` object.

I want to contain these attributes in a new class called `ReaderProfile`, of which each `Reader` object will `have_one`. 

## The Current Reader Model

This is my current `ApplicationRecord` subclass:

```rb
# frozen_string_literal: true

class Reader < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :works, :through => :purchases
  has_many :followings
  has_many :purchases
  has_many :reading_list_items
  has_many :works_to_read, through: :reading_list_items, source: :work
  has_many :reviews
end
```

And the relevant schema from `db/schema.rb`.

```rb
create_table "readers", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_readers_on_email", unique: true
    t.index ["reset_password_token"], name: "index_readers_on_reset_password_token", unique: true
end
```

## The Current Reader Tests

I'm using [RSpec](https://github.com/rspec/rspec-rails) to test my Rails application, along with [FactoryBot](https://github.com/thoughtbot/factory_bot_rails) for my factories.

I have unit tests in `spec/models/reader_spec.rb`. Here's what I test for: 

```rb
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Reader, type: :model do
  it 'has a valid factory' do
    expect(build(:reader)).to be_valid
  end
  describe 'associations' do
    it { should have_many(:followings) }
    it { should have_many(:purchases) }
    it { should have_many(:reading_list_items) }
    it { should have_many(:reviews) }
    it { should have_many(:works) }
  end
end
```

## The ReaderProfile Model 

I can create my new `ReaderProfile` model with the command: 

```
rails g model ReaderProfile first_name:string last_name:string reader:references
```

This creates the relevant ActiveRecord class, Rails migration, and tests for the class. 

## Testing the ReaderProfile 

I'm going to make `first_name` and `last_name` information optional for readers, so all I want to do is make sure I've got a test in `spec/models/reader_profile_spec.rb` that checks for a valid factory and it belongs to a `Reader` object. Here's what that unit test looks like:

```rb
RSpec.describe ReaderProfile, type: :model do
  it 'has a valid factory' do
    expect(build(:reader_profile)).to be_valid
  end
end
```

My factory in `spec/factories/reader_profiles.rb` looks like: 

```rb
FactoryBot.define do
  factory :reader_profile do
    first_name { "MyString" }
    last_name { "MyString" }
    reader { create(:reader) }
  end
end
```

I add the `belongs_to` code in my `ReaderProfile` model like so: 

```rb
# app/models/reader_profile.rb
class ReaderProfile < ApplicationRecord
    belongs_to :reader
end
```

And when I run `rspec spec/models/reader_profile_spec.rb`, my tests pass. 

## Adding to the Reader Tests

I want every `Reader` object to have one `ReaderProfile`. To test that, I add the following to `spec/models/reader_spec.rb`: 

```rb
it { should have_one(:reader_profile) }
```

And I update the `Reader` model to look like: 

```rb
# frozen_string_literal: true

class Reader < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :works, :through => :purchases
  has_many :followings
  has_many :purchases
  has_many :reading_list_items
  has_many :works_to_read, through: :reading_list_items, source: :work
  has_many :reviews
  has_one :reader_profile
end
```

When I run `rspec spec/models/reader_spec`, everything passes. 

## Updating the impacted Views and Controllers

I've been focusing on the model layer of this refactoring. It's worth noting that I have `current_reader.first_name` and `current_reader.last_name` strewn through my application. I'll need to find-and-replace those instances to `current_reader.reader_profile.first_name` and `current_reader.reader_profile.last_name`. 

I'll also need to drop the `first_name` and `last_name` parameters from the `ReadersController`, and create endpoints for readers to create, update, and delete their profiles.

## Conclusion 

Aside from my remaining TODOs, I've made good progress today. Now I have a `ReaderProfile` model to encapsulate personal information associated with each `Reader`. This makes it easier to add more pieces of `Reader` data without bloating the authentication class. It also means I can extend my authentication class to include different types of profiles if I like. Here's what my refactoring is really saying: 

* The `Reader` model handles authentication and authorization for readers. When a reader signs in, they can access their associated `ReaderProfile`. 
* The `ReaderProfile` model stores personal information about the `Reader` it belongs to. 