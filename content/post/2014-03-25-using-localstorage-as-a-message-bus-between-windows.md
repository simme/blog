---
title: Using localStorage as a message bus between windows
slug: using-localstorage-as-a-message-bus-between-windows
publishDate: 2014-03-25T03:15:01.000Z
date:   2014-03-25T03:15:01.000Z
tags: Web
---

A while back I implemented a function on [Bloglovin](http://www.bloglovin.com) for synchronizing log out across multiple open windows. Ie. if you had multiple tabs open for Bloglovin and signed out in one of them we will sign you out in all of them. This is to avoid weird behavior for AJAX requests in "still logged in tabs" etc.

I first looked at the HTML5 `postMessage` API. But to use that you require a reference to the window you want to send a message to. Which you don't have for tabs opened by the user. What I did find out however is that whenever you make a change to `localStorage` and event is triggered in all open windows on the same domain. The event is _not_ triggered in the window that caused the change.

With this knowledge in mind I went to create a tiny function that on log out writes a special key to localStorage. The value is just a timestamp on when the event happened, this is so that we can disregard it if a certain time as passed since it was written. So the tab that triggers the log out writes this key to localStorage, all the other windows listen for the `storage` event. When it is triggered we just check the name of the key of the updated row. If it matches our special log out key we trigger a log out in this window too. This works great.

After implementing this a brilliant thought struck me:

> Shouldn't we be able to use localStorage to synchronize state between tabs in bigger ways then just handling log out?

From this thought [Browbeat](https://github.com/simme/browbeat) was born. Browbeat is a super simple implementation of the [Bully algorith](http://en.wikipedia.org/wiki/Bully_algorithm). Basically it uses localStorage to initiate an election between open windows. A master window is elected and from there we can do all sorts of cool things.

One use case that I've been thinking about is to share a socket connection. Instead of opening one WebSocket per window we can have one open connection to the server in the master window. The master window would then relay all incoming messages on the socket to the "slaves" using localStorage.

Another use case (that don't necessarily requires Browbeat) is state synchronization. Say you have an Ember application running in multiple windows. You update the model in one window and then propagate this change to all other windows. When the user switches tab the update is already there. No confusing data mismatch!

Generally speaking this is probably overkill for the vast majority of web applications. I have no statistics to back this up but the average user probably doesn't open a ton of tabs. Still, it's an interesting thought to play with!

We will hopefully be able to put Browbeat into production pretty soon, I'm hoping within a few months.

These are the kinds of ideas that makes me really excited for frontend web technologies at the moment. I feel like we are slowely but surely "catching up" to native apps. That said I'm a firm believer that native will continue to "feel better" for a long time to come. But all cool things we can do to improve the web experience is awesome!
