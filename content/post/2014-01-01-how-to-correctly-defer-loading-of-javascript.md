---
title: How to Correctly Defer Loading of JavaScript
slug: how-to-correctly-defer-loading-of-javascript
publishDate: 2014-01-01T21:22:07.000Z
date:   2014-01-01T21:22:29.000Z
tags: JavaScript
---

Stumbled upon this article about [defering the loading of JavaScript](http://www.feedthebot.com/pagespeed/defer-loading-javascript.html) in a good way.

Using the old ways of placing scripts in the footer or other causes a big delay in the `document ready` event. Which is when your page has _actually_ finished loading. This method triggers the loading of the script _on that same event_.

> The methods of inlining, placing scripts at the bottom, using "defer" or using "async" all do not accomplish the goal of letting the page load first then loading JS and they certainly do not work universally and cross browser.

Now I need to figure out how to use this in conjuction with [Ember](http://emberjs.com) the best way. Showing content to the user ASAP should be a top priority. This gets tricky when you have a large library to load.
