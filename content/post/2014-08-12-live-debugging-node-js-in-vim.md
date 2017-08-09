---
title: Live Debugging Node.js in Vim
slug: live-debugging-node-js-in-vim
publishDate: 2014-08-12T19:35:20.000Z
date:   2014-08-13T03:58:22.000Z
tags: JavaScript
---

I just discovered something pretty neat. There's a Node module called [node-vim-debugger](https://github.com/sidorares/node-vim-debugger) that let's you debug running Node processes, right inside Vim. And it's insanely simple.

First do:

`$ npm install -g vimdebug`

This will install a global module that you'll use to facilitate a connection between Vim and your Node process.

Then let's create a simple Node server to illustrate. Save it as `server.js`.

```javascript
var http = require('http');
http.createServer(function (req, res) {
  debugger;
  var foo = 5 > 7 ? 'bar' : 'foo';
  res.write(foo);
  res.end();
}).listen(3000);
```

You'll notice the `debugger` statement. If you're unfamiliar with that it's basically a breakpoint defined in code.

Pretend that this is your super fancy web application server and you're having some trouble figuring out how to solve an annoying bug you have. For some reason the server always prints `foo` when requesting a page. Odd.

Now start your script with:

`$ node --debug-brk server.js`

This will start your server in debug mode with breakpoints enabled.

Now you have to start the agent that hooks your process up to Vim:

`$ node-vim-inspector`

Now, inside Vim, where you were just editing `server.js` type:

`:nbs`

You'll notice a `->` symbol at the top of the file. By default node in debug mode will break on the first line. So hit `ctrl-n` until you see that the little indicator on the side has passed the `listen` part of our script. The server is now actually up and running. Now open `localhost:3000` in your browser and head back to Vim. The `->` indicator is now next to the `debugger` statement. That's because our browser request hit the http request handler and hence our breakpoint.

Now keep hitting `ctrl-n` and you'll see the cursor jump around as the code is executed. After a few hits the cursor ends up at `foo`. Wow. So five is always less then seven, who knew. So there's obviously something wrong with our assumption that we would ever get `bar` as the response to our request.

If you keep hitting `ctrl-n` you'll sooner or later consistently end up at the same line. This is when you enter the run or debug loop, I think, which will just hang around and wait for something to happen. You can reload the page to make it jump to the breakpoint again.

You can use `ctrl-i` to jump _in_ to a function call or `ctrl-o` to jump _out_ of the current function (ie to after it has returned). I'm currently trying to figure out if it's possible to print the value of a variable in the current scope.

Seems like the module is not recently updated or active in anyway. So I guess we shouldn't expect any new features. But for basic debugging and following the code flow it's very handy and cool!

Happy debugging!
