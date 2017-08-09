---
title: Web App Architecture Discussion
slug: web-app-architecture-discussion
publishDate: 2014-09-05T10:04:31.000Z
date:   2014-09-05T10:04:31.000Z
tags: Web
---

[Brent Simmons](http://inessential.com/), of [Vesper](http://vesperapp.co/) fame, just posed an [interesting bunch of questions](http://inessential.com/2014/09/04/web_app_architecture_question). About the structuring of bigger web applications. Since I'm part of building [one of those](http://bloglovin.com/) I thought I'd share my thoughts on the matter.

In his post Brent talks about the pros and cons of splitting the different responsibilities up into different applications. I, for one, am a strong advocate of splitting it up.

This is the list of components he lists:

* API
* Account management
* Background tasks
* Push notifications
* Main website
* Misc website (aboutpages etc)

Ok, let's start discussing the different questions and points brought up.

## Code Reuse

> If they’re separate apps, then there are issues of code sharing. A simple example: each of the three websites should probably have the same navigation bar at the top. I can’t change it once — I have to change it three times.

> ...

> Consider the navigation bar that has to be the same across websites. If this is built in the browser, built by JavaScript that exists in one downloadable, static file somewhere, then I’ve eliminated code duplication.

What Brent talks about here is hosting the navigation bar as a static file somewhere that gets loaded and rendered in the browser. To me this is the wrong approach. We are currently dealing with some of this on Bloglovin because our web app is starting to get split up between a few different services. We're tackling this by building a collection of components. These components represent different UI elements (kind of like [Boostrap](http://getbootstrap.com) I guess). Each service includes the library of components as a dependency, and as such we update the code in one place and the dependency in the other places.

Modularizing every part of your web app is super easy when you're building on Node.js because [npm](http://npmjs.org/) is amazing. Couple npm with [Browserify](http://browserify.org) and you've got fantastic way of sharing front-end code as well. Especially since npm can load modules from your private GitHub repos.

So, modules modules modules, is the key to solving the issue of code reuse over multiple services.

## "Question: can the website talk to the database?"

_No._

The website is just another client, just like the iOS app. If the API requests can be made from the browser this adds no more latency then what the iOS app already has. Tons of stuff can be done in the browser nowadays. With local storage and Index DB caching in browser is also super easy, a great way to decrease the initial page load time.

If you have to proxy requests through the web server that shouldn't need to add more then a few milliseconds on a request anyway, especially if you can run the API and the web server in the same data center. For example, when loading your personal feed on Bloglovin the request is actually proxied through our web app to our API. This adds on average about 15ms to a page load, which includes the request, the parsing and some transformation. Not super fast, but not terrible.

Doing the API requests from the browser also kind of solves the issue of authentication:

>But it gets worse: each website also needs to be able parse an authentication token cookie and decide if it’s valid or not and who it refers to.

As long as all of the websites are served from the same domain they all have access to the user's credentials (presumably stored in a cookie). Assume that the API uses OAuth 2 with a bearer token (and leave the discussion of how secure this actually is etc out of this) then all the client has to do is add a header with the contents of a cookie for each request. And as such, the only service that has to worry about authentication is the API.

> But that adds latency to the system (and I’m a speed freak), and there is still some duplicated code (the code that calls the API server).

The issue of duplicated code is solved by having a module for the "API client". You don't have to validate the token before doing a request, ask for a user's notes with a given token, and you'll get either a `401` or a `200` response. If you get a `401` redirect the user to a login page and clear cookies.

User data can be cached in the browser, you don't have to look that up every time a page loads. It's really no different from having a session on the server and a cookie with a session ID. As long as the user is logged in the "session" is persisted in the browser.

## Are We Building a 100% in Browser Web App?

>At that point the three different websites could just be JavaScript apps which call the API server. The server components of those websites wouldn’t need to talk to the API server or to the database at all.

That would be a perfectly fine solution. The beautiful thing about Node.js however is that you can use your code both on the server and in the browser. For the API client you only have to switch the part that performs the actual request from XMLHttpRequest (I will always despise Microsoft for that abomination of mixed capitalization) to Node's HTTP module.

If you need to render views in both places most template engines supports both the browser and Node.

So what you could do is render the first page on the server for a faster perceived loading time, and fetch additional data from the browser.

Both [AirBnB](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/) and [Artsy](http://artsy.github.io/blog/2013/11/30/rendering-on-the-server-and-client-in-node-dot-js/) have interesting posts on writing "isomorphic JavaScript applications".

> Are we at the point where this is really feasible and secure?

Yes!

## Account Management

While this might be a separate app all actions that modifies a user's data should go through an API. Not talk directly to a database. Sending out reset emails etc. can be done by putting events on a message queue (see below) and let an email worker handle the particular logic of sending the email.

## Static Assets

Can be served by Varnish or similar. The "first serve" (when the asset is not already in Varnish's memory) can be served by any regular Node.js server.

Or preferable they are put on a CDN during deploy.

## Background Tasks and Push Notifications

Message queues! There are many alternatives, like [Gearman](http://en.wikipedia.org/wiki/Gearman) or [Rabbit MQ](http://en.wikipedia.org/wiki/RabbitMQ). Whether you go with one monolithic app for web and API or not, background tasks should be split out. Using a message queue to distribute tasks between different workers is a great solution! Put any computation that can be deferred on a queue and let some worker handle it as soon as they can.

Say Vesper (yes yes, I know the hypothetical case was a larger app) adds collaborative note editing and you want user B to be notified when user A modifies a collaborative note:

1. API receives an edit.
2. The edit is saved to the database and an event is generated.
3. The event is put on a message queue where anyone interested in the event can interact with it.
4. A push notification server sees the event and generates a push notification for the relevant user.
5. Maybe the user is also interested in email digests of edits and an email worker sees the event and generates a new email.

## It Depends.

> Perhaps the trade-offs in the choice of monolithic vs. modular just balance out and don’t point to a clear better practice. In which case the answer would be: go with whichever I prefer, and deal with the challenges of that approach as they come up.

Both approaches definitively have their pros and cons. I for one am a strong believer in a combined approach. One approach that I want to introduce at Bloglovin is rendering all pages in a "user agnostic" fashion on the server. Cache these super hard both on the client and in Varnish, fill the pages in with user specific data on the client using AJAX and locally cached data. So much of the content is shared between user's (blog profiles, blog posts etc) the only differences are the states of follow buttons, likes on posts and similar.

We just have to find a way to move towards that. And figure out how to handle i.e. follow buttons while the following state is loading. But then again, that's pretty much how most Twitter clients work today. Load a profile, wait a while for follow status. Show a locally cached feed, insert new data above existing.

This approach may not work as well for say, Vesper, which is very private and doesn't share much between users except the UI. So in that case I would probably advocate for doing a client side app. [Ember.js](http://emberjs.com) would be my choice. Maybe Brent would also like Ember since it's an evolution of SproutCore which Apple contributed to during the initial launch of MobileMe!

Hence the "answer" to the final question "What would you do?" it depends greatly on the project. But one monolithic app would never be it.

It's never been easier to build solid web apps, no matter the approach. Sure, there are still cross browser kinks to be worked out, but they are becoming fewer and fewer.

