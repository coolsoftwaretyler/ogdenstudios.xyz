My goal is to build out Trackerr, a Ruby on Rails app that allows users to follow state legislation, using the [Open States](https://openstates.org/) API. 

Most state-by-state legislative tracking suites are prohibitively expensive. When I worked at a change-making non-profit, we explored a variety of solutions and nothing was affordable. Trackerr will change that and be free to use for progressive organizations. Conservative organizations will be charged an exorbitant fee to use it. 

Aggregating state by state legislative data is a massive challenge, and fortunately it's not one I'm intending to solve. The amazing folks over at Open States are doing that for me, and I'm building on top of their work (and hopefully contributing back to it). 

Instead of worrying about actually piecing together 50 states worth of very different information, the goal of Trackerr is to build an intuitive and affordable interface for people to follow state legislation. 

I've already built out the infrastructure and bare-bones app for this. You can check it out in [xcap and deployment post], and the user system in [updating with suer post]. 

So here we are, we've got a Rails 6 app living on an Amazon EC2 instance, with a user system built with [Devise] - stored in an Amazon RDS instance. 

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