# Project set-up for Trackerr 

## Set up the test suite

Throughout the rest of this series, we'll be leaning heavily on Test Driven Development (TDD). Mostly because I'm not very good at it, and I'd like to improve. 

In order to run tests, we're going to use the [rspec-rails](https://github.com/rspec/rspec-rails) gem. 

I'm choosing rspec primarily because my place of employment uses it, and I'd like to become more valuable there. I think there are plenty of other good options, but I don't know enough about testing to make a more informed decision or give you the tools to make one, either. 

The plan is to also use [shoulda-matchers](https://github.com/thoughtbot/shoulda-matchers) with rspec, although at the time of this writing (March 1, 2018), there seem to be [some issues](https://github.com/thoughtbot/shoulda-matchers/issues/1167) running shoulda-matchers with Rails 6. 

My assumption is these problems will be resolved by the time I publish, or at least close to. So I'm going to include shoulda-matchers in the setup, but won't use it until the patch comes through. 

### Set up rspec-rails 

Most of these instructions can be found in the rspec-rails README. 

1. Add `rspec-rails` to both the `:development` and `:test` groups of your app’s Gemfile:

    ```
    group :development, :test do
        gem 'rspec-rails', '~> 3.8'
    end
    ```

2. Then run `bundle install` in the project 

3. Generate the boilerplate config files by running `rails generate rspec:install`, again, in your project directory. 

### Set up shoulda-matchers 

1. Add shoulda-matchers and rails-controller-testing under your `group :test do` block in the Gemfile: 

    ```
    group :test do
        # Adds support for Capybara system testing and selenium driver
        gem 'capybara', '>= 2.15'
        gem 'selenium-webdriver'
        # Easy installation and use of chromedriver to run system tests with Chrome
        gem 'chromedriver-helper'
        gem 'shoulda-matchers'
        gem 'rails-controller-testing'
    end
    ```

2. Run `bundle install` in the project 

3. In `spec/rails_helper.rb`, add the following configuration just before the final `end` statement: 

    ```
    Shoulda::Matchers.configure do |config|
        config.integrate do |with|
            with.test_framework :rspec
            with.library :rails
        end
    end
    ```

Now your test suite is ready to go. We'll table it for now, but as we get into the real development, we'll become real familiar with these gems. 

## Set up seed migrations 

Recently, a coworker turned me on to the [seed_migration](https://github.com/harrystech/seed_migration) gem and it has absolutely changed the way I work with the database. 

The basic idea is that seed_migration allows you to write your data seeds in an incremental way, rather than all at once in the normal `seeds.rb` file. I'll get to the nitty-gritty on this later. For now, let's just get it installed. 

1. Add `gem 'seed_migration'` to your `Gemfile`

2. Run `bundle install` in the project 

3. Install seed migration by running `rake seed_migration:install:migrations` in your project 

4. Migrate the database by running `rake db:migrate`

## Set up the deploy, database, and user gems 

In part one, I covered setting up [Capistrano](https://github.com/capistrano/capistrano), and in part two, I covered setting up the postgresql gem and [Devise](https://github.com/plataformatec/devise) gem. I won't go into detail here, but we'll be using these packages quite a bit. 

# Conclusion 

We've got our project set up with Rails 6, Capistrano, Devise, PostgreSQL, SeedMigration, Rspec, and shoulda-matchers. Now we can get to the fun stuff. In part four, we'll start really getting down to development.  