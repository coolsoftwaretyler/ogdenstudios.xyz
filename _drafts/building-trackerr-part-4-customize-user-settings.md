So here we are, we've got a Rails 6 app living on an Amazon EC2 instance, with a user system built with [Devise] - stored in an Amazon RDS instance. 

Open States requires an API key to hit their database. In early prototypes, I had the application using one API key for the entire instance, but since the goal is to service many users, that won't work. I want each user to have their own API key and store it securely in the database. 

Once a user has an account, direct them to Open States for an API key. 

So we want three options for a home page: 

For someone who is logged out, render the sign/in page. 
For someone who is logged in but doesn't have an API key set up, render a landing page with instructions on how to get an API key. 
For someone who is logged in with an API key, render the bill browser. 

Let's check this with Test Driven Development! 

We're going to use Rspec as the test suite, and Capybara to test the user functionality. 

We'll be running this test as a [feature spec](https://relishapp.com/rspec/rspec-rails/v/3-8/docs/feature-specs/feature-spec) since it's meant to exercise slices of functionality through an application, and is specifically tied to the external web interface. 

Under the `spec` folder, create a new `features` directory. Then, create a new file called `landing_page_spec.rb`. 

Let's add the skeleton of this file, and we'll fill it out piece by piece. To start, let's re-articulate our requirements as scenarios: 

```
require "rails_helper"

RSpec.feature "Landing page function", :type => :feature do
  scenario "User visits home without logging in" do
  end
  scenario "User without api key visits home and logs in" do 
  end
  scenario "User with api key visits home and logs in" do 
  end
end
```

If you run `rspec spec/features/landing_page_spec.rb` in the project directory, you'll get an output of `3 examples, 0 failures`, since we aren't yet really testing for anything. 

Let's add the first test, for a user visiting the home page without being logged in. It should look like this: 

```
scenario "User visits home without logging in" do
    visit "/"
    expect(page).to have_text("Log in")
end
```

Run rspec again and you should see `3 examples, 1 failure`, as your one expectation is now failing. 

Let's fix that and route the root to the devise log in page. 

We can set up our `config/routes.rb` file to look like: 

```
Rails.application.routes.draw do
  resources :user_settings
  devise_for :users
  devise_scope :user do  
    authenticated :user do
      root 'pages#index', as: :authenticated_root
    end
    unauthenticated do 
      root 'devise/sessions#new', as: :unauthenticated_root
    end
  end
end
```

Run `rspec spec/features/landing_page_spec.rb` again. You'll see `3 examples, 0 failures` as the Log In page is getting rendered on the root path. You can verify yourself  if you fire up a browser and go to [localhost:3000]. 

You'll see the log in page from devise. It comes with a handy link for "sign up" in case the user doesn't yet have an account. 

Awesome, that's one test out of the way. Let's go for the second: what happens when a user without an api key visits the home page and logs in. 

In the `user without api key visits home and logs in` scenario, create a spec that looks like: 

```
scenario 'user without api key visits home and logs in' do
    user = User.create!(email: 'test@ogdenstudios.xyz', password: 'password')
    visit '/'
    fill_in 'user_email', with: user.email
    fill_in 'user_password', with: 'password'
    click_button 'Log in'
    expect(page).to have_text('You still need to set up your API key with Open States')
end
```

If you run the landing page spec again, you should see `3 examples, 1 failure`. Let's fix that failure. 

We want to render a different view based on 


We want each user to have a field for an API key, but it won't be required, since new users won't have one yet. 

That means we want to test that if we were to make a new user and provide an email, password, and api_key, that user would be valid, as would a user without an api key. 

Great! We're really doing TDD now. With that error, we can add a fix and add an attribute for `api_key`. It's as simple as running: 

`rails g migration AddApiKeyToUsers api_key:string`

To check your migration got created correctly, go to the file at `db/migrate/SOMENUMBERHERE_add_api_key_to_users.rb` and check to find: 

```
class AddApiKeyToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :api_key, :string
  end
end
```

If that's in order, run `rails db:migrate`. 

With that column added, `rails test:models` should come back green with 1 run and 1 assertion. Congratulations, you've just done development **driven by tests**. 

There are certainly more tests one could run on a User model, but we've used Devise and most of those are rolled up in the gem, itself. If you've never built a user system from the ground up, [this chapter](https://www.railstutorial.org/book/modeling_users) of Michael Hartl's Rails tutorial is a must-read. 


