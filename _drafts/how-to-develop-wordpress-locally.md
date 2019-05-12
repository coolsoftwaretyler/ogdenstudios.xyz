---
layout: post-to-pdf
title: 'How to develop WordPress locally and deploy to production'
tags: ['']
description: ''
---
## Install the local server application

We'll use [Local by Flywheel](https://localbyflywheel.com/pricing/#) as a local WordPress development environment. Local is relatively new, although it does most of what  has excelled at for a long time. 

The advantage of using Local by Flywheel instead of something like [MAMP](https://www.mamp.info/en/), is it runs in a Virtual Machine rather than on your actual computer. Since it runs in a VM, it can mimic a real production environment more closely. Local is also free for personal use and can be scaled up with extensions for better staging, testing, and deployment if you want to enhance your workflow later on. FlyWheel has their own proprietary hosting you could move to and integrate an even smoother deploy workflow. 

Whether or not you choose to use the more advanced features of Local, it does a phenomenal job with its core use case: local WordPress development. Here's how to install it: 

1. Go to [https://localbyflywheel.com/](https://localbyflywheel.com/) and click **Download**. 
2. Choose your platform and enter your information. They will send you an initial marketing email, but it's easy to unsubscribe.
3. Run the installer package and grant permissions as needed. 

## Create a fresh WordPress installation

After installation, Local should start up. If it doesn't run automatically, find the icon in your Applications or Programs folder. It may take some time on the initial load. Once it's running, you should see something that looks like: 

![Initial local run](/img/wp-dev-tutorial/init-local-run.png)

1. Click the big green plus button to create a new local site.  
2. Give it a name. Choose something that indicates the development nature of the site. Something like "Jake Koplen Dev". 
    ![Site name choice](/img/wp-dev-tutorial/choose-site-name.png)
3. Choose the "Preferred" setup option.
    ![Local setup options](/img/wp-dev-tutorial/choose-preferred-setup.png)
4. Choose a username, password, and email. This will get overwritten later on, so choose whatever values you want.
    ![Local WordPress user setup](/img/wp-dev-tutorial/choose-user.png)
5. Click "Add site". Local will take a few moments to get things set up and may ask for your computer password to write to the system. 
6. Check out your shiny new WordPress site. In the local interface, click "View site".
    ![Local View Site option](/img/wp-dev-tutorial/click-view-site.png)
7. Confirm that you have a fresh WordPress installation. It should look something like this: 
    ![Fresh WordPress install](/img/wp-dev-tutorial/fresh-wp-install.png)

## Create a full backup of the production site

Now that we have a nice, clean WordPress installation, we can muck it up with some production code. We'll take a full back up of the production site and then install that backup to the local environment. 

WordPress requires two separate components: site files and a database. We can use an FTP client like [Cyberduck for Mac](https://cyberduck.io/) or [FileZilla for PC](https://filezilla-project.org/) to get the site files from the server, and we can use cpanel to get the database. Here's how we can grab a full backup of the production site:

1. Install Cyberduck or FileZilla.
2. Log in to Bluehost 
3. Click "Advanced" in the left menu. You'll see something like this: 
    ![Bluehost advanced menu](/img/wp-dev-tutorial/bluehost-advanced-menu.png)
4. Click on "FTP Accounts" 
5. I like to make an entirely new FTP account when taking backups for the first time. It keeps everything encapsulated.
6. Choose a username and password. I recommend using the "Password Generator" button for a secure password. Keep the home directory and quota at default values. Click "Create FTP Account". 
7. Log in to your server with the FTP client. If you're using Cyberduck, your interface will look like this: 
    ![Cyberduck interface](/img/wp-dev-tutorial/cyberduck-interface.png)
8. Click on the "Open Connection" button. 
9. Choose "FTP-SSL (Explicit AUTH TLS)"
10. Your server name is just your website name, `jkoplendesign.com`
11. Your username is `[usernameyouchose]@jkoplendesign.com` 
12. Your password is the password generated in cpanel earlier 
13. Hit "Connect" if your screen looks like this: 
    ![Cyberduck login](/img/wp-dev-tutorial/cyberduck-login.png)
14. If everything connects correctly, you'll end up looking at a file directory. 
15. Depending on how Bluehost initially installed your WordPress site, your site files may live in a folder called `public_html` or `jkoplendesign.com`. The correct directory will contain a listing that looks like this: 
    ![Production server WordPress directory](/img/wp-dev-tutorial/prod-wp-files.png)
17. Keep that screen open and open up a new Finder or file browser window on your local machine. 
18. I like to create a whole new directory for backups in my Downloads folder. So create a folder like `~/Downloads/YYYY-MM-DD-jkoplendesign.com` with two sub-directories: `Site files` and `Database`. 
19. Back in your FTP client, make sure you click "View > Show Hidden Files" (or its equivalent in whichever program you use). You want to make sure you can see the `.htaccess` file. There may be other hidden files tucked away in there. It's worth it to grab them. 
20. Select the entire directory (including hidden files) and right-click. Select "Download-to" and download them to `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Site files`. 
21. It may take some time for your download to complete. Do your best not to interrupt it. It can be a hassle to get halfway through and then start over if you accidentally cancel it.
22. Now that we've got the site files, we need to get the database for the site. This is where most of the configuration and content lives. 
23. Head back to your Bluehost cpanel config. This time, click on "phpmyadmin". 
24. You should be taken to an administration panel that looks like:
    ![phpmyadmin login](/img/wp-dev-tutorial/phpmyadmin-login.png)
25. Click on the database name in the left menu
26. Click "Export" in the top menu
27. Select "Quick" as the "export method" and "SQL" as the "Format". 
28. You should get a `.sql` file downloaded through your browser. Move that to `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Database`. 
29. Compress the whole `~/Downloads/YYYY-MM-DD-jkoplendesign.com` directory. I recommend backing this up to Dropbox or some other cloud storage, along with a physical drive. This zip file is everything you need to restore a WordPress site. It can act as a great backup and snapshot in time of your production site. **I recommend performing this process regularly, and every time you make large changes to your website**.

## Import the production site to Local

Let's get back to Local now. Local installs site files into `~/Local Sites/site-name` by default. So if you go to `~/Local Sites/jake-koplen-dev/app/public` in your Finder window, you'll see something that looks similar to the first directory we landed on in the FTP client: 

![Local installation directory](/img/wp-dev-tutorial/local-install-dir.png)

1. Delete the entire `~/Local Sites/jake-koplen-dev/app/public` directory and replace it with the files in `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Site files`. 
2. Click "Database > Adminer" in the Local interface. You should be looking at something like:
    ![Local database administration page](/img/wp-dev-tutorial/local-db-admin.png)
3. Once you click Adminer, you'll see the Adminer interface, which looks like this: 
    ![Adminer interface](/img/wp-dev-tutorial/adminer.png)
4. Select all and click "Drop", like so: 
    ![Drop tables command](/img/wp-dev-tutorial/drop-tables.png)
5. Confirm your drop command. 
6. Select "Import" in the left-hand column
7. Click "Browse..." and select the the `.sql` file in `~/Downloads/YYYY-MM-DD-jkoplendesign.com/Database`. 
8. Click "Execute" 
9. In the `wp_options` table, find `siteurl` and `home`. (The table name may have a different prefix). Change them both to `http://jake-koplen-dev.local`
10. The final piece of the puzzle is to change the `wp-config.php` file to look for the Local database and use the correct credentials there. 
11. Head over to `~/Local Sites/jake-koplen-dev/app/public/wp-config.php` 
12. Change the database settings look like: 
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
13. Point your browser to jake-koplen-dev.local and you should see the whole site!

## Editing themes and child themes which don't touch the database 

Editing themes is the easiest workflow for Local to production. As long as you aren't doing much with [custom post types](https://codex.wordpress.org/Post_Types), all the work you do on these themes is insulated to the theme directory at `wp-content/themes`. If you are working with custom post types, the PHP code you write will end up affecting the database and you may want to follow the instructions in the next section.

But if you just need to work on the theme files, you can now find them all at `~/Local Sites/jake-koplen-dev/app/public/wp-content/themes`. Open that up in your preferred editor and go to town. 

Once you've made your changes, go check them out at [http://jake-koplen-dev.local](http://jake-koplen-dev.local). 

If everything is good, all you have to do now is FTP those files back up to the server. 

1. Just like the instructions in **Step 3** of **Create a full backup of the production site**, connect to your server via FTP. Navigate to the `wp-content/themes` folder and right click. If you're using Cyberduck, you'll see a menu like this: 
    ![FTP upload menu](/img/wp-dev-tutorial/ftp-upload-menu.png)
2. Click "Upload". Navigate to your updated theme at `~/Local Sites/jake-koplen-dev/app/public/wp-content/themes` in the file browser. Select the entire folder. If it already exists, select "Overwrite all files" in the upload menu. It'll look like this: 
    ![Overwrite files](/img/wp-dev-tutorial/upload-overwrite-option.png)
3. Click "Continue", your files will upload, and you'll be good to go! 

## Editing content, settings, custom post types, and other data

Sometimes you may need to do big content edits you want to preview locally. Or you need to make changes to your theme that require settings changes in the WordPress. For that kind of work, you'll need to export and import the full database, like we did in **Create a full backup of the production site** and **Import the production site to Local**

If you have to do this often, I'd recommend something like [WP Migrate DB Pro](https://deliciousbrains.com/wp-migrate-db-pro/). It's a paid plug-in that syncs up local and production WordPress databases so you don't have to import/export manually. I've never used it so I can't write instructions for it, but it comes highly recommended by people I trust, and includes support if you end up buying a license.

If you only expect to make these kinds of changes every once in a while, you can likely get away with doing it manually.

**Before you change your production database, I highly recommend taking a backup again.** 

Once you've made your database-level changes on the local site, follow these steps to import it to the production site: 

1. Log in to Adminer with Local 
2. Export your database as a .sql files
3. Log in to phpmyadmin at Bluehost 
4. Select your WordPress database 
5. Select all and drop the tables 
6. Upload the local.sql file 
7. In the `wp_options` table, find `siteurl` and `home`. (The table name may have a different prefix). Change them both to `https://jkoplendesign.com`
8. Check the production website and make sure it all looks as intended. Depending on your changes - this may also require uploading modified themes via FTP. 

Again, I wouldn't recommend doing this process often. It's error prone and you may lose some work. For the most part, if you've got minor content changes, I'd recommend making those changes through the normal WordPress administration page. It's easier (and much safer) to import that content into Local than taking the Local database and importing it to the production site. 

Local also has the ability to deploy from the local server, but it requires migrating to their proprietary hosting, and I've never used it so can't make a strong case for it or provide much insight there. It's good to know it's an option, though.