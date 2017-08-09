---
title: "Node's Require and Browserify: Take 2"
slug: nodes-require-and-browserify-take-2
publishDate: 2015-08-16T18:41:22.000Z
date:   2015-08-16T18:41:22.000Z
tags: JavaScript
---

A while back I wrote about [taking advantage of Node's require algorithm with Browserify](http://iamsim.me/taking-advantage-of-nodes-require-algorithm-with-browserify/). While I liked the concept of doing that I never really liked how it made things look file-wise.

Well. Turns out you don't need to wrap your little module in a directory or give it a package.json!

Say you have a module called... let's say `do-some-math` that exports some fancy math functions that are unique do your project. If you followed my previous article you'd end up with a folder called `do-some-math` in your "custom" `node_modules` folder. Your module folder would contain at least one JavaScript file and a package.json. Once you've accumulated a bunch of modules this ends up being many files and folders that don't really serve any purpose.

So, what you _actually_ can do is to just have a file called `do-some-math.js` in your "custom" `node_modules` folder. And that's it.

Now, I haven't experimented too much with this yet. But for stuff like views that (in my case) requires the module to explicitly state Browserify transform in their package.json (since Browserify does not apply transforms to "external" modules) this will not work.

I'm just getting back into some more "heavy" client side app-stuff after a while mostly hacking on iOS stuff. So we'll see how this turns out!
