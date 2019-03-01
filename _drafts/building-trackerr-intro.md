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