const fs = require('fs')
const path = require('path');
const title = process.argv[2];
const filePath = path.join(__dirname, '..', 'src', 'blog', `${title}.md`);
const content = 
`---
layout: post
title: 
tags: ['post']
description:
date: 2019-09-03
---`
fs.writeFile(filePath, content, { flag: 'w+' }, () => {});