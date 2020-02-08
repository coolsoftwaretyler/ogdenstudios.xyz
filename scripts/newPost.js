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
date:
---`;
fs.writeFile(filePath, content, { flag: 'w+' }, () => {});