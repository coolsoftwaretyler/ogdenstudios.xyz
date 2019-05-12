---
layout: post-to-pdf
title: 'How to edit content in Forestry'
tags: ['']
description: ''
---
<style>
html {
    background-color: white !important
}
</style>

I integrated [shaleentitle.com](https://www.shaleentitle.com) with [Forestry](https://forestry.io/). 

Follow these steps to use Forestry to create, update, and delete content on shaleentitle.com. 

## Login 

You'll receive an initial email from Forestry with login information from me. Follow the link to get access. Any other time, you can access the login page [here](https://app.forestry.io/login). I'd recommend bookmarking it for easy access. 

You should see a page that looks like this: 

![Successful forestry login](/img/forestry-instructions/login-success.png)

Click on **shaleen-title** to get access to your content manager. You'll be taken to a screen that looks like this: 

![CMS home screen](/img/forestry-instructions/cms-home-screen.png)

## Pages 

From the CMS home screen, click **Pages**. You'll see a page that looks like: 

![Page editor](/img/forestry-instructions/page-editor.png)

### Create a new page 

To create a new page, click the **Create new** button at the top of the screen. A dropdown will appear. You can select **Pages** to make a new page, it will become a top level link, like: `https://shaleentitle.com/new-page-title`.

On the next page, you can: 

1. Select a **layout** (you should keep this value set to **page**).
2. Choose a title **title**. This will become the URL. 
3. Set a **description**. This is the value that will show up in link previews. If you leave it empty, it will default to the sitewide description. 
4. Create your **content**. Use the rich text editor to put your content together here. 

Here's what a sample page creation might look like: 

![New page pop-up](/img/forestry-instructions/sample-page-creation.png)

By default, all new pages are set to **Draft**. Click **Save draft** when you're done adding content. Then click the **eye icon** to see a preview of your page. If you're happy with how it all looks, click **OFF** on the **Draft** status, and then click the **Save** button. 

It may take a few minutes for your changes to take effect. Forestry has to write to the repository and Netlify has to build and deploy the updates. The URL will be set to the title. So in this case, the new page created will be `https://www.shaleentitle.com/test-page`. 

### Edit an existing page 

Editing an existing page is almost exactly the same process as creating a new page, except you click on the page you'd like to edit in the page editor screen.

### Delete a page 

Back on the page edit screen, click on the **three dots** on the right side of the page listing. You can click **Delete** to remove the page. It'll look like this: 

![Delete a page](/img/forestry-instructions/delete-a-page.png)

## Blog posts 

Click **Posts** on the left-hand menu of the CMS. You'll see a page that looks like this:

![Posts page](/img/forestry-instructions/posts-page.png)

Click **Create new**. You can choose the same options as pages: creating **Posts** or a **Folder**. A new folder will change the URL structure. My suggestion is you keep all blog posts in the same place, and only ever create new **Posts** here. 

### Create a blog post 

As with the new page interface, choose a **layout**, **title**, and **description**. Then create your blog post. This process might look something like this: 

![Creating a post](/img/forestry-instructions/create-a-post.png)

As with the pages, you can view a draft preview before publishing. Use the **Save draft** and **Save** button in the top right hand corner as needed. 

### Edit a blog post 

You can edit a blog post by selecting it in the blog post interface, changing content, and saving it. 

### Delete a blog post 

Deleting a blog post is the same process as deleting a page, but choose a blog post instead of a page. 

## News posts 

Creating, editing, and deleting news posts is the same as Blog posts, except it happens on the **News** interface, and when you click **Create new**, make sure you select **News update** as its template.

## Awards 

If you click **Awards** on the left menu, you'll see a page like this: 

![Awards page](/img/forestry-instructions/awards-page.png)

### Create an award 

If you click **Add award**, a blank item will be added, like this: 

![Create awards](/img/forestry-instructions/create-awards.png)

### Edit an award 

To edit the new award, or any existing award, click on the item. You'll see an interface that looks like this: 

![Edit awards](/img/forestry-instructions/edit-awards.png)

Add or change the **Date**, **Description**, or set its **Highlighted** status. Most of the dates you have are just the year, but this will take any date string. 

The description should be relatively short, since it gets added to the list. 

The highlighted toggle will turn on/off the trophy icon for the specific award. 

You can also drag and drop each award to change the order they render in the document.

### Delete an award 

You can delete an award by clicking the **trash can icon** next to the award

### Saving changes to the awards 

In order for **any of the create, edit, or delete actions** to take place on awards, you must click **Save** on the Awards interface. You can preview the site by clicking the **eye icon** next to it. 

## Media hits 

Media Hits function the same way that Awards do, with one important exception: **filtering media hits by year**. 

When you edit a Media Hit, you'll see a form that looks like: 

![Edit media hits](/img/forestry-instructions/edit-media-hits.png)

You'll notice there are two date fields: 

**Media Date** and **Year**. 

**Media Date** is the date that will render on the site for people to see. **Year** is the four-digit representation of the year for us to use to filter out which media hits appear on the home page. You can write the **Media Date** in any format you choose, depending on how you prefer. But the **Year** field **must be four digits** in order for the filtering system to work. 