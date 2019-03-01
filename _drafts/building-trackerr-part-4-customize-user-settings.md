So here we are, we've got a Rails 6 app living on an Amazon EC2 instance, with a user system built with [Devise] - stored in an Amazon RDS instance. 

Open States requires an API key to hit their database. In early prototypes, I had the application using one API key for the entire instance, but since the goal is to service many users, that won't work. I want each user to have their own API key and store it securely in the database. 

Once a user has an account, direct them to Open States for an API key. 

So we want three options for a home page: 

For someone who is logged out, render the sign/in page. 

So we can set up our `config/routes.rb` file to look like: 

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

So now, if you fire up a browser and go to [localhost:3000], you'll see the log in page from devise. It comes with a handy link for "sign up" in case the user doesn't yet have an account. 

Great, that's one use case out of the way: for people who are signed out or not signed up. 

So let's sign in as our test user: 

Username: tyler@ogdenstudios.xyz
Password: password 

And we'll see our `app/views/pages/index.html.erb` file showing up. But right now, it's just an h1 tag and nothing else. We want to check if a user has an API key or not. 

So far, we don't have any place to store an API Key. Let's add that to the user model. But before we do that, let's get some good Test Driven Development in there. 

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


