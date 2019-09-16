---
layout: post
title: 'Toggle alternate CSS with JavaScript'
tags: ['css', 'client work', 'javascript']
description: 'You can use JavaScript to demo clients two options that differ purely in CSS.'
---

Sometimes you want to give clients two different design options that differ purely in CSS. I run into this often when I'm staging color options, font options, or slightly different page layouts. 

The developer in me wants to set up two different branches on the repository and switch back and forth. But if I'm in a meeting with a client, this approach requires me to context switch in front of them, which makes the demonstration feel clunky, and introduces room for error if I don't keep my branches correctly up to date with any work that happened in the interim. 

I kind of just want a button on the page that I can click and say "Here's option A, and here's option B". Even better, what if I could ship that to clients and they could play with it themselves?

Turns out it's possible, as long as you control the CSS and JavaScript pipeline. 

## Add the CSS Override

Assuming you've already written the original styles, in order to create **Option B**, create a stylesheet at the root of the project called `override.css`. Inside, write some styles to override **Option A** styles. For demo purposes, let's just change the color of all the text to red:

```
/* /override.css */

* {
    color: red;
}
```

## Add some JavaScript

Now you need some JavaScript that: 

* Adds a checkbox to the DOM 
* Adds an `onChange` listener to the Checkbox
* Adds the `override.css` file to the `head` of the page when the checkbox is true
* Removes the `override.css` file from the `head` of the page when the checkbox is false

Here's a script that does that. 

```
// StyleToggle.js

var StyleToggle = function (path) {

    renderOverrideButton();

    function addOverride() {
        var override = document.createElement('link');
        override.id = 'override';
        override.rel = 'stylesheet';
        override.href = path;
        document.head.appendChild(override);
    }

    function removeOverride() {
        var override = document.getElementById('override');
        document.head.removeChild(override);
    }

    function renderOverrideButton() {
        var toggle = document.createElement('button');
        toggle.innerText = 'Override CSS';
        toggle.style.position = 'fixed';
        toggle.style.left = '2em';
        toggle.style.bottom = '2em';
        toggle.addEventListener('click', function () {
            overrideToggle();
        });
        document.body.appendChild(toggle);
    }

    function overrideToggle() {
        var override = document.getElementById('override');
        if (override) {
            removeOverride();
        } else {
            addOverride();
        }
    }
}
```

<script>
  var StyleToggle = function (path) {

    // Start with override styles false 
    var override = false;

    // On instantiation, add the checkbox to the DOM
    renderButton();

    function renderButton() {
      var toggle = document.createElement('button');

      // Button styles
      toggle.style.position = 'fixed';
      toggle.style.left = '2em';
      toggle.style.bottom = '2em';
      toggle.style.padding = '1em';

      // Button text 
      toggle.innerText = 'Style A';

      // Click handler setup  
      toggle.addEventListener('click', function () {
        // Hit the toggle Override 
        toggleOverrideStyles();
      });
      // Append toggle button to the DOM
      document.body.appendChild(toggle);
    }

    function toggleOverrideStyles() {
      if (override) {
        override
        removeOverrideStyles();
      } else {
        addOverrideStyles();
      }
      changeButtonText();
    }

    function addOverrideStyles() {
      override.id = 'override';
      override.rel = 'stylesheet';
      override.href = path;
      document.head.appendChild(override);
    }

    function removeOverrideStyles() {
      var override = document.getElementById('override');
      document.head.removeChild(override);
    }

    function changeButtonText() {

    }



  }

  var toggle = new StyleToggle('/override.css');
</script>