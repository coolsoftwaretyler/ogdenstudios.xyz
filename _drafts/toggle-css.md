I want to demo two different stylesheets to the designers tomorrow

I could set up two branches on my repo and switch back and forth. But I'd need to keep them in step with any changes on the main branch, and what if my livereload/server doesn't gracefullly reload?

There's also an extra step there, I need to toggle windows, have multiple screens, otherwise context switch. I kind of just want a button to show the two different styles. 

First let's see if I can get a different style. I'll make something like `override.css` in my css folder. 

Include it in the page with 

```
<link id="cssOverride" rel="stylesheet" href="/css/override.css">
```

We give it an ID so we can select on it later in JS.

Let's give it a style and make sure it's working. My old standby: 

```
* {
    color: red;
}
```

Cool, it's rendering. Now let's see if I can turn it on and off. 

Javascript: 

```
var StyleToggle = function () {
    var override = document.getElementById('cssOverride');
    var overrideSrc = override.href;

    function toggle() {
        if (override.href == overrideSrc) {
            override.href = '';
        } else {
            override.href = overrideSrc;
        }
    }
    return {
        toggle: toggle
    }
}
```

This creates a revealing module called `StyleToggle`. When you initialize it, it grabs the override element. It stores the `href` in a value called `overrideSrc`. 

It exports a function called `toggle()` that swaps the href value with the stored `overrideSrc`, or a blank `''` value to wipe it. 

Now I want a button. 

```
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