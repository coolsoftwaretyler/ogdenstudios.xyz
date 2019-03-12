I recently wrote a blog post about [getting an A+ in the Mozilla Observatory with Jekyll and Netlify](https://ogdenstudios.xyz/2019/03/03/how-do-i-get-an-a-plus-mozilla-observatory-jekyll-netlify.html). 

I wrote that post as I completed a Jekyll site for a client. My next projects are going to be WordPress sites, so it makes sense to do the same for the WordPress platform. Here's how you can get an A+ on the Mozilla Observatory with a WordPress website.

## Step 1: Create a new WordPress website 

This blog post assumes some technical knowledge, and setting up a WordPress site requires more than a few commands. I won't go through the entire setup process. But I personally love [Dreamhost](https://www.dreamhost.com/). Here's how you can [install WordPress on a Dreamhost server](https://www.dreamhost.com/). 

Setting up WordPress through Dreamhost will give us access to the WordPress administration panel and an SFTP user. We'll need both sets of credentials to complete the process.

## Step 2: Check the baseline WordPress grade

Once you have WordPress spun up, log in, set up your admin account, and don't do anything. Let's see how a fresh WordPress install fares on [Mozilla Observatory](https://observatory.mozilla.org). 

With a fresh WordPress 5.1 install, our website scores an **F**. 

## Step 3: Set up HTTPS 

When you analyze your site through Mozilla Observatory, you'll be presented with a series of recommendations for improving your score. The first recommendation is automatically redirecting from HTTP to HTTPS.

First, we'll need to change this in the WordPress administration settings. 

Go to **Dashboard > Settings > General > WordPress Address/Site Address** - make sure it begins with `https://`

Next, you'll want to set up that redirect in the `.htaccess` file as well.

[SFTP into your server](https://help.dreamhost.com/hc/en-us/articles/115000675027-FTP-overview-and-credentials) and edit the `.htaccess` file in the root of your WordPress directory. To set up the HTTPS redirect, it should look like: 

```
# BEGIN WordPress
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{SERVER_PORT} !^443$
    RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
    RewriteBase /
    RewriteRule ^index\.php$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

Now check your Mozilla Observatory score again and you'll see you've gotten a 20/100 score and passed 6/11 tests now. Still an **F**, but we're improving.

## Step 4: Set your headers in a child theme 

Mozilla will walk you through which headers to set, one at a time, and explain what each one does. I won't be going over these in-depth in this post. I encourage you to walk through the process yourself. 

In order to set these headers, we'll want to use a `functions.php` file in a child theme. This will allow us to easily set the headers through the WordPress administration page. 

[Create a child theme](https://www.hostinger.com/tutorials/how-to-create-wordpress-child-theme) and then add the following to the bottom of the **child theme's** `functions.php` file:

```
/** Custom security HTTP headers **/
function add_security_header($headers) {
	$headers['Content-Security-Policy'] = "base-uri 'self'; default-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self'; script-src 'self'; style-src 'self'";
	$headers['Referrer-Policy'] = 'no-referrer';
	$headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains';
	$headers['X-Content-Type-Options'] = 'nosniff';
	$headers['X-Frame-Options'] = 'DENY';
	return $headers;
}

add_filter('wp_headers', 'add_security_header');
```

## Conclusion 

With these headers, a blank Jekyll site should score an A+ on Mozilla Observatory with a score of 115/100. It will also clear almost all the Content Security Policy checks they run.

I did my best to make these settings as restrictive as possible, but WordPress breaks under the strictest settings. Setting the `default-src`, `script-src`, and `style-src` to `'self'` will allow WordPress to function as expected. 

Even with those changes, the CSP is pretty locked down. You may find you need to make adjustments to these headers to get certain tools and components to work on your site. This puts you in a good spot because it’s good practice to make the necessary changes intentionally instead of trying to fix broken security policies retroactively.

## Next Steps 

Getting an A+ on Mozilla Observatory doesn't guarantee your site is entirely secure, especially if you're running WordPress. There is a wealth of information out there about locking down a WordPress site. Some great first steps might be [setting up JetPack](https://jetpack.com/support/getting-started-with-jetpack/) or [removing the WP generator meta tag](https://css-tricks.com/snippets/wordpress/remove-wp-generator-meta-tag/).