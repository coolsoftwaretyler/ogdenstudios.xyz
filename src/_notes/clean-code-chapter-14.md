---
layout: post
title: Clean Code Chapter 14
---

# Successive refinement 

This is a case studdy in successive refinement. We'll examine a module that started well but did not sclae. Then we will refacotr and clean it. 

Most of us parse command-line arguments. If we don't have a convenient utility, we walk the array of strings passed into the main function. There are some good utilities, but none of them do exactly what the author wanted. So he wrote his own. He calls it Args. 