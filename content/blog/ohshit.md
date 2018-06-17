# So you volunteered to fix someone's website, and now you don't know what the fuck to do.

Been there.

The thing is, there is always another way to accomplish a goal or task. This is the internet, and if some weird configuration needs to get tried - it has been. So I'm not going to cover every scenario there is. I'm going to limit my scope to the types of solutions I've encountered in my work.

I like using the word "solution" because that's often what a website is: a solution to a problem. It also expands the universe of what you might try when solving a problem for a client, friend, or coworker. If you think outside of the common "website" box - and consider a solution, you might find a google doc works best. Or a google app. Maybe something on Heroku. Maybe just a social media page with a custom domain is all you need to satisfy your needs. Being a good developer is about finding the right solution fit for the problem within a certain scope.

## Asking questions
> Sometimes the best thing you can know is what you don't know.

Learning to ask the right question is one of the most important skillsets I've learned in my time fixing websites. Another great function of the vast and ever-expanding internet is that there is a tutorial out there for *everything*. The trick is finding which tutorial meets your needs. Sometimes you just want to know "how the fuck do I change the color on the donate link?" and there doesn't seem to be a tutorial for changing one dang button.

## Tutorials

Oh boy. There are so many. I would say too man, but that's not accurate. It's rad how many tutorials are out there. And because of the volume of them, you essentially don't ever need to know anything. The most important thing you need to know is how to filter out the noise and signal: what tutorial will actually serve your purposes?

Here is where time is one of the most crucial factors. If you're in a crunch and just need to figure out how to make some quick changes and fixes, a big long tutorial isn't going to serve you well, and you're going to be relegated to stackoverflow hell - looking for that one perfect quick fix.

But if you can anticipate your upcoming tech needs, say "I know my wordpress site is likely to break on the next update" - then you can take some time and search for a good "How to maintain a WordPress site" tutorial.

Go through a tutorial like that, and you'll be set up for success. It may not address specifically the problems and concerns you have - but it will give you a sense of the fundamentals and building blocks of a WordPress site, which in turn, will help inform your questions and tools for when the crunch time comes. If you understand *how* WordPress functions, you'll have a better sense of what broke when it inevitably all goes to shit.

1. I have a WordPress site and I need to make quick fixes - where do I even start?
2. We use some other managed service like Shopify, NationBuilder, or some website builder and need to make changes.
3. Some clever person did a custom build using Jekyll, Hugo, or just plain code and I need to know what to do.

Server-Side vs. Client-Side
This is a great example of where things get really murky really quickly in terms of delineation.

The most basic thing, but probably least useful explanation is:
server-side code runs on your web server
client-side code is executed on your user's computer.

There, that probably didn't help you at all.

Some examples of server-side tools are PHP, MySQL, Python, Django, etc.
Examples of client-side code is the classic trifecta of HTML, CSS, and JavaScript.

Again, that probably didn't answer a heck of a lot of questions for you. So let's use WordPress as an example.

For a simple WordPress blog, you likely have some regular ol' pages (a home page, an about page, etc.) and then your blog posts.

All of the content of those pages and posts (the words, the images, etc.) live on your server in a MySQL database. For now, you don't need to know anything about that database other than it holds your stuff.

Outside of your database, but still on the server, live the WordPress core files, theme files, and plugin files. For this scope, think of them as the scaffolding of the site. In that collection of files, there is HTML, CSS, and JavaScript which all tell your WordPress site how to display and work with the data that lives in the database.

A good, tangible example of how this plays out is themes. You may have tested out a bunch of themes on your site, or just found one that was close to good enough for your purposes. When you hit "activate theme", you probably noticed the content of your site didn't change, but the look and feel did.

That's because the theme files are (mostly) separate from your database. When someone talks to your server, the server sends the theme files to that person. The theme files get executed and ask for information from the server (your content), they get that info, render it into plain ol' HTML/CSS/JS, and then send those files to the person, whose computer takes care of the rest.

How internet stuff works.

Servers are just computers that allow incoming and outgoing connections.
In the server is usually some technology to do server-side stuff.
Servers, after doing their server-side stuff, send that info to whoever was requesting it, and then the rest happens on eahc person's computer. 
