I recently wrote a blog post about gettting an A+ in the Mozilla Observatory with Jekyll and Netlify. 

I decided I'd do the same process for a WordPress install. I wrote the last blog as I completed a Jekyll site for a client, and my next projects are going to be WordPress sites, and I care just as much about those as I do about Jekyll. 

So first, install WordPress [some options for how to do that here]

Once you have WordPress spun up, log in, set up your admin account, and don't do anything. Let's see how a fresh WordPress install fares on Observatory. 

With a fresh WordPress 5.1 install, our website scores an **F**. 

The first recommendation is automatically redirecting from HTTP to HTTPS. Here's how: 

1. Set it up in the settings. 

Dashboard > Settings > General > WordPress Address/Site Address - make sure it looks like `https://secure-wordpress.ogdenstudios.xyz`. 

2. Make set it up in .htaccess

FTP into your server [find a tutorial on how]

Edit your .htaccess file in the root of your WordPress directory. It should look like: 

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

Great! Mozilla gives you a 20/100 score and passed 6/11 tests now. 

The next recommendation is to "Did you know that you can ensure users never visit your site over HTTP accidentally?

HTTP Strict Transport Security tells web browsers to only access your site over HTTPS in the future, even if the user attempts to visit over HTTP or clicks an http:// link."

Now we're thinking with Headers. In order to set custom headers in WordPress, we can edit the active theme's `functions.php` file. [file path here]. 

Add 

```
/** Custom security HTTP headers **/
function add_hsts_header($headers) {
  $headers['strict-transport-security'] = 'max-age=63072000; includeSubDomains';
  return $headers;
}

add_filter('wp_headers', 'add_hsts_header');
``` 

to the bottom. 

With that in place, we've got a 40/100. 