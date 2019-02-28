My goal is to build out Trackerr, a Ruby on Rails app that allows users to follow state legislation, using the [Open States](https://openstates.org/) API. 

Most state-by-state legislative tracking suites are prohibitively expensive. When I worked at a change-making non-profit, we explored a variety of solutions and nothing was affordable. Trackerr will change that and be free to use for progressive organizations. Conservative organizations will be charged an exorbitant fee to use it. 

Aggregating state by state legislative data is a massive challenge, and fortunately it's not one I'm intending to solve. The amazing folks over at Open States are doing that for me, and I'm building on top of their work (and hopefully contributing back to it). 

Instead of worrying about actually piecing together 50 states worth of very different information, the goal of Trackerr is to build an intuitive and affordable interface for people to follow state legislation. 

I've already built out the infrastructure and bare-bones app for this. You can check it out in [xcap and deployment post], and the user system in [updating with suer post]. 

User stories: 

1. Users should be able to make an account - covered in devise. Check part two of the series. 
2. Once they make an account, direct them to Open States to get an API key 
  - So if people go to trackerr.ogdenstudios.xyz, they should see one of three options: 
    1. Splash page to sign up if they haven't already 
    2. Splash page with directions to get an API key if they don't have one 
    3. Their bill explorer. 
3. Add their API key to Trackerr
4. Once they have an API Key, they can access a tab and select a state they're interested in 
5. Once there, they can select a date range they're interested in
6. They can create a collection - a snapshot of all the bills with activity in that state in their desired date range. 
7. They can browse the collection and "follow" bills 
8. They can view their followed bills and see which ones have had activity within a date range 
9. They can getpush notifications about those bills. 

So here we are, we've got a Rails 6 app living on an Amazon EC2 instance, with a user system built with [Devise] - stored in an Amazon RDS instance. 

# 2. Once a user has an account, direct them to Open States for an API key. 

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

RSpec setup here


Open States requires an API key to hit their database. In early prototypes, I had the application using one API key for the entire instance, but since the goal is to service many users, that won't work. I want each user to have their own API key and store it securely in the database. 

So let's do this with Test Driven Development. I'm going to write a test on the User model to make sure that the api key field exists. 

So I wrote a test like this, in `test/models/user_test.rb`

```
require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup 
    @user = User.new(email: "tyler@ogdenstudios.xyz", password: "password", api_key: "someapikeyhere")
  end

  test "should be valid" do 
    assert @user.valid? 
  end
end
```

And run `rails test:models` in console. At first, I found I was getting an Unique Constraint Error from Devise, because Devise uses the Rails-generated fixtures. I found [this GitHub issue](https://github.com/plataformatec/devise/issues/4475) and commented out the empty fixtures, for now. 

Once I did that, I got the anticipated error, which is: 

```
Error:
UserTest#test_should_be_valid:
ActiveModel::UnknownAttributeError: unknown attribute 'api_key' for User.
    test/models/user_test.rb:5:in `setup'
```

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

You can see for yourself that everything is working by firing up `rails s`, and visiting `localhost:3000/users/sign_up` to create a new account. For now, not much will really happen. If you've been following along since step one, you'll likely just see the base view we created during tutorials one and two. 

So now that we have an `api_key` attribute on the user model, we want to give people the ability to add their key. I'm going to allow people to do this at `/settings`. 

TDD again! 

First, let's create the test for the PagesController, created in part 1. 

Make a file at `test/controllers/pages_controller_test.rb` and fill it as such: 

```
require 'test_helper'

class PagesControllerTest < ActionDispatch::IntegrationTest

  test "should get index" do
    get root_url
    assert_response :success
  end

  test "should get settings" do
    get settings_url
    assert_response :success
  end
end
```

getting `root_url` should work, since we've routed `root, to: "pages#index"`, and the `pages_settings_url` won't work since we haven't set up the controller and routed it, yet. 

So first up, let's make controller method. In `app/controllers/pages_controller.rb`, add the following method: 

```
    def settings 
    end
```

And in `config/routes.rb`, add:

```
get "/settings", to: "pages#settings"
```

Your `rails test` should still be failing as it's missing a template. Finally, add a view at `app/views/pages/settings.html.erb`. Add `<h1>Settings</h1>` at the top so you know you're somewhere when you get there. 

Run `rails test` again and you'll see everything is clearing as green. 

OK, so after trying to get the settings controller to render a settings view and put a settings form in it, I've realized that Settings should be their own model, which is owned by a User model. 

Let's reverse this. 

First, I'll delete `app/views/pages/settings.html.erb`

Next, I'll delete the settings method in the controller. 

Then, I'll delete the route in `config/routes.rb`. 

I've also got to delete the "should get settings" test in `test/controllers/pages_controller_test.rb`. 

I'm giong to remove the api_key column from the User model by running `rails generate migration RemoveApiKeyFromUsers api_key:string`

Then I'll run `rails db:migrate` 

And fainlly, I'll remove the API key from the user validity test in `test/models/user_test.rb`

Let's see if any tests fail by running `rails t`. 

Everything's good. Nice. 

So now I'll scaffold out the UserSetting model, views, and controllers by running `rails g scaffold UserSetting api_key:string`

Run the migration with `rails db:migrate`

Something interesting you might notice in this scaffold is that we get two files: `test/fixtures/user_settings.yml` and `test/models/user_setting_test.rb`. 

Let's check the fixtures file. We find two objects: 

```
one:
  api_key: MyString

two:
  api_key: MyString
```

We can use these as test objects, much like how we used `.new` to create a user object in the user tests. We can write plain YAML here and check the objects. 

If you run `rails t`, you'll find that some more tests have been added and pass as green. 

Cool, now I want to make sure that we set up a one-to-one relationship between Users and UserSetting objects. Seach user will have one UserSetting, and we'll use UserSetting to store all their site-wide settings. For now, that's just an api_key. 

Let's hit that TDD button one more time. I want to set up a test that 


Let's set up tests with [rspec-rails](https://github.com/rspec/rspec-rails). 

Add 

`gem 'rspec-rails'` to dev and test  

Run 

`rails generate rspec:install`

Set up settings in `spec/rails_helper.rb`

Then add [shoulda-matchers](https://github.com/thoughtbot/shoulda-matchers)

```
  gem 'shoulda-matchers'
  gem 'rails-controller-testing'
  ```

  Make a folder and file under `spec`: `spec/models/users_spec.rb`

  # Validations 
  # Relationshps 
  # Methods 