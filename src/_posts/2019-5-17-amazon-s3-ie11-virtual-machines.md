---
layout: post
title: 'Template tags, S3 backups, and IE11 virtual machines'
tags: ['html', 'javascript', 'template tags', 'amazon web services', 'S3', 'postgresql', 'internet explorer', 'virtual machines' ]
description: 'This week I learned about content templates, server backups with S3, and Internet Explorer testing on Macs.'
---
*Last updated May 17, 2019*

## Using template tags for modals 

### The problem 
This week my team had a bug report come in about a modal. We use this modal to serve a third party JavaScript form for the marketing team. The third party JS targets the modal's form by ID, does its magic, and our in-house script just controls hiding and displaying the modal with `display: none;` and `display: block;`. 

Everything works fine when someone uses the modal once. But some users need to dismiss and re-engage with the modal more than once per session. When that happens, the third party script doesn't fire again. The form hangs in its completed state, and users can't submit their valid additional requests to it. 

We also don't have much visibility into the third party script. The documentation provides no clear way to tell it to reload and refresh the form. So we had to hack around it a bit. 

The initial modal looks something like this: 

```
<div class="modal">
    <form id="target"></form>
</div>
``` 

Our form has more content and styles, but this is the basic rundown. It's a modal `div` we control with CSS and JavaScript, wrapped around a `form` element our third-party JS targets. The third-party code is handled in our regular bundle. 

Without something like `thirdPartyScript.refresh()` available to us, we need to come up with another way to re-initialize the script, modal, and form. 

### The solution 

I've been reading about the [HTML Content Template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) and thought this was a great use case for it. So I wrote a `template` that looks like: 

```
<template id="template">
    <div class="modal" id="modal">
        <form id="target"></form>
    </div>
    <script src="thirdParty.js"></script>
</template>
```

And I modified the show and hide modal functions to look like: 

```
// Show the modal
function show() {
    var template = document.querySelector('#template');
    var clone = document.importNode(template.content, true);
    document.body.appendChild(clone);
}

// Hide the modal 
function hide() {
    var modal = document.getElementById('modal');
    modal.remove();
}
```

The show function grabs the document fragment with the id of `template` and runs `importNode()` on it. Then it appends the imported node to the document body. When this happens, the `script` is loaded into the DOM and fire again. It gives us a fresh modal and third party form. When users dismiss the modal, it clears the form entirely by finding the element with id of `modal` (which I added for convenience in this script) and calling `remove()` on it. 

### Limitations 

I'm not sure about the performance implications of rendering DOM. In an ideal world, I'd have some function like `thirdPartyScript.refresh()` I could call on showing the modal. But considering the DOM rendering only happens once at a time, and it's triggered by user action, I think it's a fair solution. 

Internet Explorer doesn't support `template` tags. It also doesn't support the `remove()` method. We support IE11, which can be a hassle, but I always appreciate that support as a challenge. I like thinking "how would I write this JavaScript if it was 2007?" 

Instead of using the `.content` from the `template` tag, you can store the HTML as a string, use `document.createElement()` to create a `div`, set the `innerHTML` of that `div` to the HTML string, and then append it as usual. The `remove()` function can be replaced with `element.parentElement.removeChild(element)` So the IE11 support might look like: 

```
// IE11 
// Show the modal
function show() {
    var markup = '<form id="target"></form><script src="thirdParty.js"></script>';
    var modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'modal';
    modal.innerHTML = markup;
    document.body.appendChild(modal);
}

// Hide the modal 
function hide() {
    var modal = document.getElementById('modal');
    modal.parentElement.removeChild(modal);
}
```

MDN suggests this `if` statement to detect `template` support: 

```
if ('content' in document.createElement('tempalte')) {
    // Use template tag code 
} else {
    // Use code for browsers that don't suppor the template tag
}
```

I'm a huge fan of the `template` tag. It provides an easy interface for controlling markup with JavaScript, while keeping the actual markup **out** of my JS. 

## Using Amazon S3 for database backups

### The problem 

I maintain a personal web application an Amazon EC2 instance and wanted to set up a quick and dirty database backup. In the past, I've used the [Dropbox API](https://www.dropbox.com/developers/documentation/http/overview) for tasks like this, because I have a professional Dropbox plan. But overall, I'm trying to reduce costs and improve my proficiency with Amazon Web Services, so I wanted to do the job using Amazon S3. 

There's a ton of [documentation for the S3 API](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html), but to be honest, I think the AWS documentation is *absolute garbage*. 

### The solution 

I found [this blog post from 2014 about uploading to S3 with curl](http://tmont.com/blargh/2014/1/uploading-to-s3-in-bash) that completely holds up.

I put it together with [this PostgreSQL backup guide](https://www.vultr.com/docs/how-to-backup-and-restore-postgresql-databases-on-ubuntu-16-04). 

I wrote a bash script that keeps one backup on the server at all times. When it runs, it removes the previous backup file, then uses `pg_dump` to create a new backup file in its place. It sets a local file path, a path for AWS, a bucket name, and a date. Then it `POST`s using `curl` and the AWS keys. It looks like this: 

```
#!/bin/bash

rm /path/to/backups/backup.bak
sudo -u postgres pg_dump database_name > /path/to/backups/backup.bak
file=/path/to/backups/backup.bak
aws_path="backups/$(date +%s)"
bucket=bucket_name
resource="/${bucket}/${aws_path}"
contentType="application/x-compressed-tar"
dateValue=`date -R`
stringToSign="PUT\n\n${contentType}\n${dateValue}\n${resource}"
s3Key=S3KEYGOESHERE
s3Secret=S3SECRETGOESHERE
signature=`echo -en ${stringToSign} | openssl sha1 -hmac ${s3Secret} -binary | base64`
curl -X PUT -T "${file}" \
  -H "Host: ${bucket}.s3.amazonaws.com" \
  -H "Date: ${dateValue}" \
  -H "Content-Type: ${contentType}" \
  -H "Authorization: AWS ${s3Key}:${signature}" \
  https://${bucket}.s3.amazonaws.com/${aws_path}
```

I created this by calling `vim backup_script.sh` and filling it out. Once I saved the file, I had to make it executable, so ran `sudo chmod u+x backup_script.sh`. Finally, I set it to run at a certain time as a [cron job](https://www.ostechnix.com/a-beginners-guide-to-cron-jobs/). 

To edit the crontab, I ran `crontab -e` and then set up a job that looks like: 

```
0 11 * * * /path/to/backup_script.sh
```

Which tells cron to run `backup_script.sh` at 11:00 UTC every day of every week of every month. 

### Limitations 

I have no error handling, no logs, and the script is somewhat decoupled from my web application. I'm also a little concerned because `pg_dump` takes a plaintext dump of the database. No passwords or security credentials are stored in plaintext, but things like user emails are. If my S3 bucket got compromised, I could be in trouble. Fortunately, this is a small web app I use for myself and some friends, so the security implications are somewhat limited in scope. 

I also have some discomfort using `sudo` to run a command as the `postgres` user. I did this as opposed to giving expanded permissions to other roles in the database. It feels better to keep the default PostgreSQL permissioning system and hack it in one bash script, rather than change the permissions so my one-off script can run `pg_dump` from the `ubuntu` user. I don't know what the right answer is here and would love to hear from people with a better understanding of secops. Again, the implications are limited because this app is not open for the public or customers. 

## Testing Internet Explorer on a Mac

### The problem 

My team supports Internet Explorer 11 in our web sites. We work on MacBook Pros, which can't run Internet Explorer. So testing local dev environments is a hassle. In the past, we've used remote desktops and tunnels to our local servers, but our remote desktops are being discontinued and we don't always have the option to run tunnels for internal reasons. 

### The solution 

Microsoft releases [virtual machines that run IE8 through IE11 and Edge](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/). I downloaded an IE11/Win7 virtual machine and loaded it into my [VirtualBox](https://www.virtualbox.org/wiki/Downloads). It works like a charm. I can run Internet Explorer 11 and point it to my local server, all on my own machine. 

### Limitations 

You won't be able to access something like localhost:3000 or 127.0.0.1:3000 like you would on your local machine. You can remap your hosts file on the virtual machine, or you can use an alternative IP address. If you have something like `rails s` running on localhost:3000 on the host machine, you can point IE11 to http://10.0.2.2:3000 and it should work just fine. 

It's also somewhat slow, depending on your VirtualBox configuration and host computer resources available. Still, it's the best way for us to get the job done as far as I can tell. 