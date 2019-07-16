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

https://medium.com/@brockreece/scoped-styles-with-v-html-c0f6d2dc5d8e

https://css-tricks.com/native-like-animations-for-page-transitions-on-the-web/

Need to use overlay transitions in vue modal: https://github.com/euvl/vue-js-modal/issues/294