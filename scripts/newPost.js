const fs = require('fs')
const path = require('path');
const title = process.argv[2];
const unfiltered = process.argv[3];

newPost();

function newPost() {
    const filePath = generateFilePath(title);
    let content;
    if (unfiltered === 'unfiltered') {
        content = filteredFrontMatter();
    } else {
        content = regularFrontMatter();
    }
    fs.writeFile(filePath, content, { flag: 'w+' }, (err) => {
        if (err) return console.log(err);
        console.log(`Created ${filePath}`);
    });
}

function generateFilePath(title) {
    let directory;
    if (unfiltered === 'unfiltered') {
        directory = 'unfiltered'
    } else {
        directory = 'blog'
    }
    return path.join(__dirname, '..', 'src', directory, `${title}.md`);
}

function regularFrontMatter() {
    return "---\nlayout: post\ntitle: \ntags: ['post']\ndescription:\ndate:\n---";
}

function filteredFrontMatter() {
    return `---
title: "This is the post title"
author: Tyler Williams
author_gitlab: tywilliams
author_twitter: Twitter username or gitlab # ex: johndoe
categories: unfiltered
image_title: '/images/blogimages/gitlab-values-cover.png'
description: "Short description for the blog post"
tags: tag1, tag2, tag3 # Please add some relevant tags from the blog handbook: https://about.gitlab.com/handbook/marketing/blog/#tags. Please only use tags from this list (do not create new ones).
---        
`
}