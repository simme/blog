---
title: Set Your npm init Defaults!
slug: set-your-npm-init-defaults
publishDate: 2014-09-18T16:16:34.000Z
date:   2014-09-18T16:16:34.000Z
tags: node.js
---

I was just now catching up on some old [NodeUp](http://nodeup.com) episodes. In [the one](http://nodeup.com/seventy) about the npm client they talked about some nifty stuff you can do with `npm init` by setting some defaults.

So I just wanted to share this to those who don't listen to the podcast (you should) and for myself as a reference:

```
$ npm config set init.author.name "Simon Ljungberg"
$ npm config set init.author.email hi@iamsim.me
$ npm config set init.author.url http://iamsim.me/
$ npm config set init.license MIT
```

Now the next time you run `npm init` those will be used as the defaults! Very nice time saver.

**But there's more!**

If you run the very intuitive command `npm help 7 config` you'll get a list of all the configurations you can set! There are many. I'm off to exploring me some man-pages!
