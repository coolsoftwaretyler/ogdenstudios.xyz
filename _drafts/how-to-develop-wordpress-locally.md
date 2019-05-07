---
layout: post
title: 'How to develop WordPress locally and deploy to production'
tags: ['']
description: ''
---
*Last updated May 6, 2019*

We'll use [Local by Flywheel](https://localbyflywheel.com/pricing/#) to set up a local WordPress development environment. Local is relatively new, although it does most of what [MAMP](https://www.mamp.info/en/) has excelled at for a long time. 

The advantage of using Local by Flywheel is it runs in a Virtual Machine rather than on your actual computer. It more closely mimics a real production environemtn, and it includes a ton of extensions for better staging, testing, and deployment if you want to enhance your workflow later on. 

Whether or not you choose to use the more advanced features of Local, it does a great job with the core use case: local WordPress development. 

1. Download Local 

Go to [https://localbyflywheel.com/] and click **Download**. 
Choose your platform and enter your information. I've gone through this process a handful of times and they will send you an initial marketing email, but they're easy to unsubscribe from and respect the unsubscribe for sure. 

2. Install Local 

Run the installer package and grant permissions as needed. 

3. Run Local 

Have Local run after installation, or find the program and spin it up. It may take some time on the initial load. Once it's running, you should see something that looks like: 

![img/wp-dev-tutorial/init-local-run.png]

Click the big green plus button to create a new local site.  

- Give it a name. Choose something that indicates the development nature of the site. Maybe something like "Jake Koplen Dev". 
![img/wp-dev-tutorial/choose-site-name.png]
- Choose the "Preferred" setup option 
![img/wp-dev-tutorial/choose-preferred-setup.png]
- Choose a username, password, and email. **Don't use the information you have on your production site**. Even though it's a development environment, it's a good idea to select a strong password in case this user account makes its way to production. The email is less important, choose whatever you like. 
![img/wp-dev-tutorial/choose-user.png]
- Click "Add site". Local will take a few moments to get things set up and may ask for your password. 
- Check out your shiny new WordPress site. In the local interface, click "View site"
![img/wp-dev-tutorial/click-view-site.png]
- Confirm that WordPress is installed nice and fresh. It should look something like this: 
![img/wp-dev-tutorial/fresh-wp-install.png]

4. Download and export your current site 

Now that we have a nice, clean WordPress installation, let's muck it up with some production code. 

WordPress requires two separate components to run correctly: site files and a database. We can use an FTP client like [Cyberduck for Mac](https://cyberduck.io/) or [FileZilla for PC](https://filezilla-project.org/) to get the site files from Bluehost, and we can use the Bluehost cpanel to get the database. 

- Install Cyberduck or FileZilla. 
- Create your FTP credentials with Bluehost 
    - Log in to Bluehost 
    - Click "Advanced" in the left menu. You'll see something like this: 
    ![img/wp-dev-tutorial/bluehost-advanced-menu.png]
    - Click on "FTP Accounts" 
    - I like to just make an entirely new FTP account when I get started on this. It keeps everything nicely encapsulated, and if something goes wrong you won't mess anything up.
    - Choose a username and password. I recommend using the "Password Generator" button for a secure password. Keep the home directory and Quota at default values. Click "Create FTP Account". 
- Log in to your server with the FTP client
    - If you're using Cyberduck, your interface will look like this: 
    ![img/wp-dev-tutorial/cyberduck-interface.png]
    - Click on the "Open Connection" button. 
    - Choose "FTP-SSL (Explicit AUTH TLS)"
    - Your server name is just your website name, `jkoplendesign.com`
    - Your username is `whateryouchose@jkoplendesign.com` 
    - Your password is the password generated in cpanel earlier 
    - Hit "Connect" if your screen looks like this: 
    ![img/wp-dev-tutorial/cyberduck-login.png]
- If everything connects correctly, you'll end up looking at a file directory. 
- Depending on how Bluehost initially installed your WordPress site, your site files may live in a folder called `public_html` or `jkoplendesign.com`. The correct directory will contain a listing that looks like this: 
![img/wp-dev-tutorial/prod-wp-files.png]
- Keep that screen open and also open up a new Finder or File browser window on your local machine. 
- I like to create a whole new directory to back everything up to, and I usually tuck it in my Downloads folder. So create something like `~/Downloads/YYYY-MM-DD-jkoplendesign.com` with two sub-directories: `Site files` and `Database`. 
- Back in your FTP client, make sure you click View>Show Hidden Files (or its equivalent in whichever program you use). Basically, you want to make sure you can see the `.htaccess` file. There may be other hidden files tucked away in there. It's worth it to grab them. 
- Select the entire directory (including hidden files) and right-click. Select "Download-to" and download them to `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Site files`. 
- It may take some time for your download to complete. Do your best not to interrupt it. It can be a hassle to get halfway through and then start over if you accidentally cancel it. I usually step away from the computer to avoid clicking somewhere accidentally. 

Export your database 

Now that we've got the site files, we need to get the database for the site. This is where most of the configuration and content lives. 

- Head back to your Bluehost cpanel config. This time, click on "phpmyadmin". 
- You should be taken to an administration panel that looks like:
![img/wp-dev-tutorial/phpmyadmin-login.png] 
- Click on the database name in the left menu TODO: get a screenshot here 
- Click "Export" in the top menu
- Select "Quick" as the "export method" and "SQL" as the "Format". 
- You should get a `.sql` file downloaded through your browser. Move that to `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Database`. 

- Compress the whole `~/Downloads/YYYY-MM-DD-jkoplendesign.com` directory. I recommend backing this up to Dropbox or some other cloud storage, along with a physical drive. This zip file is just about everything you need to restore a WordPress site and can act as a great backup and snapshot in time. 

Move the site files into the Local server 

Let's get back to Local now. Local installs site files into `~/Local Sites/site-name` by default. So if you go to `~/Local Sites/jake-koplen-dev/app/public` in your Finder window, you'll see something that looks similar to the first directory we landed on in the FTP client. It'll look a bit like this: 
![img/wp-dev-tutorial/local-install-dir.png]

TODO: the rest of these steps for real to demo them 

- Delete the entire `~/Local Sites/jake-koplen-dev/app/public` directory and replace it with the files in `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Site files`. 
- Click Database>Adminer in the Local interface. You should be looking at something like :
![img/wp-dev-tutorial/local-db-admin.png]
- Once you click Adminer, you'll see the Adminer interface, which looks like this: 
![img/wp-dev-tutorials/adminer.png]
- Select all and click "Drop", like so: 
![img/wp-dev-tutorials/drop-tables.png]
- Confirm your drop command. 
- Select "Import" in the left-hand column
- Click "Browse..." and select the the `.sql` file in `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Database`. 
- Click "Execute" 

Your production database will be loaded into Local's server. In order for it to work correctly, we need to change two values in the database manually. 

In the `wp_options` table, find `siteurl` and `home`. (The table name may have a different prefix). Change them both to `http://jake-koplen-dev.local`

Change the wp-config 

The final piece of the puzzle is to change the `wp-config.php` file to look for the Local database and use the correct credentials there. 

Head over to `~/Local Sites/jake-koplen-dev/app/public/wp-config.php` 

We want to make sure the database settings look like so: 

```
// ** MySQL settings ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'root' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
```

Head on over to jake-koplen-dev.local in your browser and you should see the whole site!

# Editing themes and child themes which don't touch the database 

Editing themes and child themes is the easiest workflow for local to production on WordPress. As long as you aren't doing much with [custom post types](https://codex.wordpress.org/Post_Types), all the work you do on these themes is insulated to the theme directory at `wp-content/themes`. If you are working with custom post types, the PHP code you write will end up affecting the database and you may want to skip to the TODO: next section. 

But if you just need to work on the theme files, you can now find them all at `~/Local Sites/jake-koplen-dev/app/public/wp-content/themes`. Open that up in your preferred editor and go to town. 

Once you've made your changes, go check them out at http://jake-koplen-dev.local. 

If everything is good, all you have to do now is FTP those back up to the server. 

Just like the instructions in TODO: get step number, connect to your Bluehost via FTP. Navigate to the `wp-content/themes` folder on the server, and right click. If you're using Cyberduck, you'll see a menu like this: 
![img/wp-dev-tutorials/ftp-upload-menu.png]

Click "Upload". Navigate to your updated theme at `~/Local Sites/jake-koplen-dev/app/public/wp-content/themes` in the file browser. Select the entire folder. If it already exists, select "Overwrite all files" in the upload menu. It'll look like this: 
![img/wp-dev-tutorials/upload-overwrite-option.png]

Click "Continue", your files will upload, and you'll be good to go! 

# Editing content, settings, custom post types, and other data

Sometimes you may need to do big content edits you want to preview locally. Or you need to make changes to your theme that require settings changes in the WordPress or create custom post types. For that kind of work, you'll need to export and import the full database, like we did in TODO: step link. 

If you have to do this often and hate this process, I'd recommend something like [WP Migrate DB Pro](https://deliciousbrains.com/wp-migrate-db-pro/). It's a paid plug in but it syncs up local and production WordPress databases so you don't have to much around with your database manually. I've never used it because I don't mind playing with databases, so I don't have a great guide for it, but it comes highly recommended by people I trust. 

But if you just need to do this every once in a while, the process is very similar to our setup, but in reverse. 

**If you're changing your production database, you might want to make a backup TODO: link to section before following these instructions** 
- Log in to Adminer with Local 
- Export your database as a .sql files
- Log in to phpmyadmin at Bluehost TODO: link to section 
- Select your WordPress database 
- Select all and drop the tables 
- Upload the local.sql file 
- Change the In the `wp_options` table, find `siteurl` and `home`. (The table name may have a different prefix). Change them both to `https://jkoplendesign.com`
- Check the production website and make sure it all looks as intended. 

Again, I wouldn't recommend doing this process often. It's error prone and you may lose some work. For the most part, if you've got minor content changes, or content changes that don't change much on your site, I'd recommend making those changes through the normal WordPress administration page.  

If you want to make content changes in a local environment, test them out, and then deploy, and you want to do that often, try something like the paid WP Migrate Pro. Local also has the ability to deploy from the local server, but it requires migrating to their proprietary hosting. 


