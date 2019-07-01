---
layout: post
title: 'Lessons learned: '
tags: ['']
description: ''
---

## Nuxt transitions

https://nuxtjs.org/api/pages-transition/

```
// pages/index.vue

<script>
import InteractiveExperience from "~/components/InteractiveExperience.vue";
export default {
  components: {
    InteractiveExperience
  },
  pageTransition: 'test'
};
</script>
```

something else about how we do these.