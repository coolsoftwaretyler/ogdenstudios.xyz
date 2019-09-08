Static site scaffolding with Github template repositories
If you’re beginning your web development career, static site generators can be a great tool for small freelance projects, and GitHub template repositories can optimize your project setup. Static sites are a great solution for brochure websites, landing pages, and other web properties that don’t get updated frequently and don’t require tons of custom functionality. You can host them cheaply, deploy them quickly, and hand them off to clients with ease.

​
​​Most static site generators make installation and quick start easy. But after starting a few projects, you may find that you replicate effort with config files, folder structure, and other post-installation tasks. At my day job, my team cranks out small landing pages very frequently, and I discovered a way to automate much of that housekeeping using GitHub template repositories. 

There’s no shortage of static site generators out there to choose. I’ll use Eleventy as an example, but this workflow could work for Hugo, Jekyll, Nuxt, or any other flavor of static site generator you prefer. 

Using the command line

Getting used to the command line will help you get up and running with many web technologies. It can be confusing at first, but it’s an invaluable tool for your web development career. 

When you read documentation and install software, you’ll often run into commands that are meant to be executed in a command line. The command line comes in many shapes and sizes, here are some resources for common versions: 


- Linux: How to Start Using the Linux Terminal
- Mac: How to use Terminal on the Mac when you have no idea where to start
- Windows: How to Install and Use the Linux Bash Shell on Windows 10
Create your template folder 

Open up your command line and run type the following commands, line by line: 


    cd ~
    mkdir static-site-template
    cd static-site-template

These three commands change directory into your home directory (`~` in Unix-based systems), make a new directory called `static-site-template`, and then change directory into the `static-site-template` directory. 

If you aren’t on Linux or Mac, you may need to `cd` into something like `Users/yourname/` instead. 

Initialize the Node project

In order to work with Eleventy, you’ll need to install Node. Node allows your computer to run JavaScript code outside of a browser context. You can download it here.

When you install Node, you will also install the node package manager, or NPM. NPM allows you to download node packages to your computer. Eleventy is a node package, so you’ll use NPM to get it.

Once you have Node on your machine, head back into your command line. Make sure it’s currently in the `static-site-template` directory you created. You can check your command line’s context by typing `pwd`. This command prints working directory to the terminal. If you aren’t in that directory, use `cd` to navigate there.

Once you’re in `static-site-template`, run this command:


    npm init

This creates a file called `package.json` in the directory. NPM will prompt you for a series of questions to fill out the metadata in your `package.json`. After answering the questions, the node project is initialized.

Install Eleventy

Now that you have a `package.json` file in your directory, NPM will be able to install packages, run scripts, and do other tasks for you. NPM uses the `package.json` file as an entry point in the project to figure out precisely how and what it should do.

You can tell NPM to install Eleventy as a development dependency by running: 


    npm install -D @11ty/eleventy

This will add a `devDependency` entry to the `package.json` file and install the Eleventy package to a folder called `node_modules`. 

The critical part about the `package.json` file is that if you were to provide this `package.json` to NPM on any other computer running node, it would know to install Eleventy in its `node_modules` folder. 

Configure Eleventy

One of the things I like the most about Eleventy is how flexible it is. There are tons of ways to configure an Eleventy project. For the purposes of this tutorial, I’m going to demonstrate a configuration that provides you with: 


- A folder to cleanly separate your website source code from your overall project files 
- An HTML document to create a single page website
- CSS to style your website
- JavaScript to add functionality to your website

Hop back in the command line. Inside your `static-site-template` folder, run these commands one by one (excluding the comments that appear after each `#` symbol): 


    mkdir src           # creates a directory for your website source code
    mkdir src/css       # creates a directory for the website styles
    mkdir src/js        # creates a directory for the website JavaScript
    touch index.html    # creates the website HTML document
    touch css/style.css # creates the website styles
    touch js/main.js    # creates the website JavaScript

This creates the basic file structure that will inform your Eleventy builds. However, if you were to run Eleventy right now, it wouldn’t spit out the website we want. We have to configure Eleventy to understand that it should only use files in `src` for building, and that the css and js folders should be processed with passthrough file copy. 

We can give this information to Eleventy through a file we create called `.eleventy.js` in the root of the `static-site-template` folder. 

You can create this file from the command line by running this command inside the `static-site-template` folder: 


    touch .eleventy.js

Edit the file in your favorite text editor so that it contains this: 


    module.exports = function(eleventyConfig) {
        eleventyConfig.addPassthroughCopy("src/css");
        eleventyConfig.addPassthroughCopy("src/js");
        return {
          dir: {
            input: "src"
          }
        };
      };

Lines 2 and 3 tell Eleventy to use passthrough copy for your CSS and JavaScript. Line 6 tells Eleventy to use only the `src` directory to build its output. 

You can now run the Eleventy program. In the command line, type: 


    npx @11ty/eleventy

You’ll see output like this: 


    Writing _site/index.html from ./src/index.html.
    Copied 2 items and Processed 1 file in 0.04 seconds (v0.9.0)

And your `static-site-template` folder should now have a new directory in it called `_site`. If you dig into that folder, you’ll find your `css` and `js` directories, along with your `index.html` file. 

This `_site` folder is the final output of Eleventy. It is the entirety of your website, and you could host it on any static web host. 

We haven’t yet added any content, styles, or scripts, so the site wouldn’t be very interesting just yet. 

Create your boilerplate website

You can now populate your static site with some placeholder content. Inside `src/index.html`, write: 


    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Static site template</title>
            <meta name="description" content="A static website">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="css/style.css">
        </head>
        <body>
        <h1>Great job making your website template!</h1>
        <script src="js/main.js"></script>
        </body>
    </html>

Inside `src/css/style.css`, write: 


    body {
        font-family: sans-serif
    }

And inside `src/js/main.js`, write: 


    (function() {
        console.log('Invoke the static site template JavaScript!');
    })();
Check out your boilerplate website

You can view all this code by running `npx @11ty/eleventy` `--``serve` in the command line. Eleventy will spin up a server with Browsersync and tell you where to find it. Likely at `localhost:8080`. 

Visit that site and you’ll see an `h1` with the text “Great job making your website template!” in a sans-serif font. If you check the JavaScript console, you’ll see the message “Invoke the static site template JavaScript!” in your logs. 

Make your project a git repository

Git is the most commonly used version control system in software development. Most Unix-based computers come with it installed, and you can turn any directory into a git repository by running this command:


    git init

Run that in your `static-site-template` directory and you’ll see a message like: 


    Initialized empty Git repository in /path/to/static-site-template/.git/

This creates a hidden `.git` folder inside the directory, which allows the Git program to run commands against your project. 

Set up your .gitignore file

Before you do run Git commands on your project, you can tell Git about files you don’t want it to touch. 

Inside the `static-site-template` directory, run: 


    touch .gitignore

And then open up that file in your favorite text editor. Add this content to the file: 


    node_modules/
    _site/

This tells Git to ignore the `node_modules` directory and the `_site` directory. 

You don’t want to version control `node_modules` because the folder can get huge, and NPM can recreate the folder using the information stored in your `package.json` file. 

You don’t want to version control `_site` because Eleventy can generate it from all the files in `src`. It would be repetitive and take up unnecessary space to include that output folder in the version control system. It’s also possible that if you left `_site` in, you might commit an old build of the site. Future users (or a future version of yourself) could mistake it as the most up to date version of the website and use it incorrectly.

Store your repository with GitHub 

Git is the version control software, and GitHub is a git repository host.  You can host git repositories on other providers like BitBucket or GitLab. But since we’re talking about a GitHub specific feature (template repositories), we’ll push this repository up to GitHub. 

If you don’t have an account already, go ahead and join GitHub. Once you have an account, create a GitHub repository and name it static-site-template. 

GitHub will walk you through a few questions in their new repository wizard. Once the repository is created on their end, you’ll be prompted with choices: create a new repository on the command line or push an existing repository from the command line. 

Neither of these choices are exactly what you need. They assume you either don’t have anything at all, or you have been using Git locally already. The `static-site-template` project exists, has a Git repository initialized, but doesn’t yet have any commits on it. So ignore their prompts and instead run the following commands in your command line (excluding the comment in line 3):


    git add .
    git commit -m "first commit"
    # Replace the URL in line 4 with the URL GitHub gave you for your repository
    git remote add origin https://github.com/ogdenstudios/static-site-template.git
    git push -u origin master

This adds the entire `static-site-template`  folder to the Git staging area. It commits it with the message “first commit”, adds a remote repository (your GitHub repository), and then pushes up the master branch to that repository. 

Make it a template repository

With the repository stored on GitHub, you can make it a template. On the GitHub landing page for your repository, click Settings. On the settings page, check the button for Template repository.

Go back to the repository page and you’ll see a green button that says Use this template. If you click that button, you’ll create a new repository for your GitHub account. The new repository will start with the same files and folders as static-site-template. You can then download or clone that new repository to your machine and get started working on a new project with all the base files and configuration you set up in the template project. 

Extending the template

In this post you created a very basic Eleventy project. It includes a `src` folder, one HTML document, a CSS file, and a JavaScript file. You then uploaded it to GitHub and set it up for use as a template repository. 

When you begin your next project, come back to the GitHub repo. Click the use this template button, and begin work with the new repository GitHub makes. Fill in the missing pieces: add content, styles, functionality, and any other configuration or extensions your project requires. 

When you finish that project, identify the pieces that you might want to reuse in future projects. Perhaps you figured out a cool hover effect on buttons. Or you built your own JavaScript carousel element. Or maybe you’re really proud of the document design and hierarchy of information. 

If you think anything you did on a project will come back again on your next run, remove the project-specific details and add it to your template project. Push it up to GitHub, and the next time you use static-site-template to kick off a project, your reusable code will be available to you. 

Limitations

GitHub template repositories are a useful tool that can help you avoid repetitive setup on new web development projects. I find this especially useful for static site projects. These template repositories might not be as useful for more complex projects that require external services like databases. 

Template repositories allow you to ship your own standard code base so you can solve a problem once and use that solution over and over again. But while your new solutions will carry over to future projects, they won’t be ported backwards to old projects. 

This process may also trick you into shipping unnecessary code to future projects. This is a great process for sites with very similar structure, styles, and functionality. Projects with wildly varied design an functionality may not benefit from this code-sharing, and you could end up bloating your project with unnecessary code. 

Copy my template

If you want to see what a finished template might look like, I’ve set one up for myself here. You’re welcome to fork it to your own account and make modifications. 
