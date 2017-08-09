---
title: Building an app with Ampersand.js
slug: building-an-app-with-ampersand-js
publishDate: 2015-01-05T10:49:36.000Z
date:   2015-01-05T11:21:34.000Z
tags: JavaScript
---

Throughout 2014 I've noticed lots of activity in the JavaScript framework space. Tons of interesting things are happening. Ember is working on [FastBoot](http://emberjs.com/blog/2014/12/22/inside-fastboot-the-road-to-server-side-rendering.html) which seems super interesting. And also in proximity to Ember is the work on [HTMLBars](https://github.com/tildeio/htmlbars). I've never spent that much time looking at Angular, and frankly its philosophies don't seem to align with mine. Nonetheless, lots of activity all across the board. There's also React.. and probably a million others that I'm currently blanking on.

My latest love affair is [Ampersand.js](http://ampersandjs.com) from the team at [&yet](https://andyet.com). Ampersand calls itself:

> A highly modular, loosely coupled, non-frameworky framework for building advanced JavaScript apps.

Lots of frameworks call themselves "non-frameworks". I feel like it's warranted in this case though. Ampersand is more of a collection of modules. A collection of modules that work very well together thanks to well defined interfaces and some basic conventions.

Ampersand borrows a lot from Backbone. And even copies some of the code straight up. I was actually never a Backbone fan either. I always felt like there was so much boilerplate code. But the fact that Backbone is still around gives it credibility.

The thing that hooked me on Ampersand was the fact that all modules where CommonJS and [existed on npm](https://www.npmjs.com/browse/keyword/ampersand). No complicated build steps that require complex view pre-compiling and whatnot.

Enough rambling. I'm not here to sell you on Ampersand.js. I'm here to tell you how I've ended up using Ampersand (after two weeks of winter holiday hacking) in hopes that it benefits someone else.

## The Setup


I'll say it right now. This "guide", or whatever it shall be called, will not cater too much to beginners. If you don't know what [npm](http://npmjs.com/) or [Browserify](http://browserify.org) is or how it all works, you should look that up first! Oh, and one more thing. By the end of this "guide" you won't have a complete app. This post will just show you how I have come to structure my Ampersand app.

The corner-stones of Ampersand is the [state](https://www.npmjs.com/package/ampersand-state), [model](https://www.npmjs.com/package/ampersand-model), and [view](https://www.npmjs.com/package/ampersand-view) modules. There's no "core" module or anything. If you just want some basic view layer you could pull in just the view module for example.

The [ampersand](https://www.npmjs.com/package/ampersand) CLI is not anything I actually use because it doesn't really fit my needs (in terms of folder structure etc).

In a [previous post](http://iamsim.me/taking-advantage-of-nodes-require-algorithm-with-browserify/) I talked about how I structure my code. That's the same structure I'm using now.

## The "Core"

As I mentioned before, Ampersand does not come with any "core" module. Which isn't really mentioned anywhere in the docs — that confused me for a while. So, we'll need to setup something of our own. First, let's lay out the things we need:

1. A way to map "code" to a "url". Ie. we need a router and some way to structure that code.
2. A way to keep track of global state. This might be a user's session for example. Things that doesn't really fit within a model.
3. A way to manage instantiated models. So that we can make sure we're not running around with duplicates.
4. Someway to manage the app chrome (navigation bars and what not — stuff that is not part of one special page).

### Application State

I'm gonna be real confusing and start with the second item on the list. _Application state_. Because the state encapsulates the other stuff. Notice how I used the word state. And how I previously mentioned a module called `ampersand-state`? Great! Because that's what we're going to use to create our "core".

So I'm going to start with a folder/file structure that looks like this:

```
app-root/
  assets/
    js/
      node_modules/
        application/
          application.js
          package.json
        main.js
```

Let's focus on the application folder for now. We'll circle back to `main.js` later. If you're curious about this structure it's probably because you didn't go back and read [that post](http://iamsim.me/taking-advantage-of-nodes-require-algorithm-with-browserify/) I linked to earlier!

This is how the `package.json` should look:

```json
{
  "name": "application",
  "main": "application.js"
}
```

That's only so that Browserify knows where to find the module code and what it is called. Now open up `application.js` and let's type out the skeleton for our module:

```javascript
//
// # Application State
//
// I usually have a comment like this at the top of each file that describes the module.
//
// These are for hinting. I'm using node: true for convenience, since we're doing CommonJS style modules.
//
/* jshint node: true */
/* jshint browser: true */
'use strict';

var AmpersandState = require('ampersand-state');
// The registry is the module that will hold all of our model instances.
var AmpersandRegistry = require('ampersand-registry');

module.exports = AmpersandState.extend({
  // For all of the state's properties we're going to use the `session` key.
  // Session properties are properties that "should not survive a page load". Which is kind of what we want.
  session: {
    // Our model registry is an object, it is required, and it's created automatically with this function.
    registry: ['object', true, function () { return new AmpersandRegistry(); }]
  },
  
  initialize: function initApp() {
    // This function is called whenever you call "new Application()".
    // So this is where we will bootstrap our app.
  }
});
```

Let's stop there for now. And skip number three in the list so that we can tackle number 4! If you want you can take a brief pause and read the [docs for ampersand-state](http://ampersandjs.com/docs#ampersand-state) to get a better understanding of how it works.

### Application Chrome

Your app probably has a navigation bar. So I'm going with that as an example. This navigation bar might contain a search form, maybe a user menu that needs to look different depending on the state of the session (logged in or not). These parts of your app need to stay put when we change the page. And they also require logic that doesn't fit in any page specific code.

Enter the `ampersand-view`. The purpose of the view is to visualize a state object (or the more common case is a model, which is a "subclass" of state). This means that a view can bind DOM objects to state properties. Meaning that if the state changes the DOM will automatically update. Which is perfect for our user menu for example.

Let's create a new module. I like to group all views together. So in our `node_modules` folder, create a new folder called `views` and in this you create another folder (folders for everyone!!) called `app`. Lastly in this folder create a `package.json` similar to the one above and an `app.js` file for our code.

```javascript
// After this I'll start cutting boilerplate like this from the examples.
/* jshint node: true */
/* jshint browser: true */
'use strict';

var AmpersandView = require('ampersand-view');

module.exports = AmpersandView.extend({
  // We want this view to always just render as soon as we use it.
  autoRender: true,
  
  // This function will be called _after_ the view has been rendered. So here's our chance
  // to set things up if we need to.
  initialize: function initView(options) {
  },
  
  // This function should configure anything related to the DOM representation of this view and whatnot.
  render: function render() {
  },
  
  // This function tells Ampersand _how_ to render this view. In this particular case we just want the view
  // to represent everything inside body. So that's what we will give it.
  template: function template() {
    return document.querySelector('body');
  },
});
```

Alright, there we have the basics. Let's tie things together before we continue.

Again, take a break and skim through the [ampersand-view docs](http://ampersandjs.com/docs#ampersand-view) if you'd like. Views are very powerful and it helps to know what they are capable of.

### Wrapping Up the Base

Now we need a way to tell the browser to create an instance of our state and one instance of our view and tell them about each other. `main.js` is the place to do this. So open that file up and type out:

```javascript
var AppState = require('application');
var AppView = require('views/app');

var state = new AppState();
var view = new AppView({ model: state });

// If you want you can store a reference to the view on window for easy access during debugging etc.
window.app = view; // View has a reference to the state so you only need to expose the view.
```

Now you can just run `browserify assets/js/main.js -o build/bundle.js` to build your app. Hopefully that works without throwing any errors! If you haven't already you can throw together a quick HTML page that loads the file and see if it works. Try adding some `console.log`'s to the `initialize` functions in the code to see if they are beeing run. Or just inspect `window.app`.

Now ain't that neat?

### Back To the App View

I won't go in to too much detail about how to bind views and models together the ampersand docs are pretty good at explainging all of that. I just want to circle back quickly to the app view and describe how I've come to manage things like search forms and such.

The [docs for ampersand-view](http://ampersandjs.com/docs#ampersand-view-subviews) mention `subviews`. A subview is exactly what it sounds, a view that's a child of another view. They are tied together, If a parent is removed the child is removed. Etc.

So in `views/app/app.js` I might have a subviews definition that looks a little something like exactly this:

```javascript
subviews: {
  search: {
    container: '[data-hook="search-form"]',
    constructor: require('views/search-form'),
  },
  userMenu: {
    container: '[data-hook="user-menu"]',
    // Imagine we have a property on our app-state called `currentUser`. Render the subview when 
    // that property is truthy.
    waitFor: 'model.currentUser',
    prepareForView: function (el) {
      // `constructor` is basically sugar for this, but we need to pass model as well.
      return new UserView({
        el: el,
        parent: parent,
        model: this.model.currentUser
      });
    }
  }
}
```

Now when the app view is rendered all of those subviews are also configured and rendered.

### The Registry

As previously noted we want a registry where all the instantiated models are stored. This is so that we can reuse the same models everywhere and take full advantage of bindings (because if you have duplicate models all your views might not update as you expect them).

We've already created the registry in our application state. Now what we need to do is make it so that every model we create automatically ends up in the registry. Now, I have to admit, I haven't really found a great way to do this without relying on the global app reference. So that's how we will do it.

Many of the ampersand modules can be extended with mixins. I guess you could call them "subclasses" that extend the prototype chain between the "base object" and your own special subclass. So this is how my mixin looks:

```javascript
module.exports = {
  initialize: function (opts) {
    // Probably the only place we can access this global property.
    var registry = opts.registry || (window.App && window.App.registry);
    if (!registry) {
      return;
    }

    registry.store(this);
    this.on('destroy', function () {
      registry.remove(this.getType(), this.getId());
    }, this);
  }
};
```

I've saved that to a module I call `base` that lives in `node_modules/models`. When defining a model later I just do:

```javascript
var AmpersandModel = require('ampersand-model');
var Base = require('models/base');

module.exports = AmpersandModel.extend(Base, {
  // Model definition
});
```

**However** when writing this post I read the [readme](https://www.npmjs.com/package/ampersand-registry) for `ampersand-registry` again and it says:

> then whenever we're defining models for our application if we're using ampersand-model or it's lower level cousin ampersand-state we can pass it the registry as part of the definition.

Which is weird because I remember reading the docs and getting recommended the mixin approach. Which is still there if you look at the [github repo](https://github.com/ampersandjs/ampersand-registry#example). Anyway, the `registry` property on the model declaration seems like a cleaner approach. So that's what I'm going to refactor my models to use!

## The Routing Business

The remaining thing from our list is the router. Coupling a chunk of code to a URL. If you take a look at the [documentation for `ampersand-router`](http://ampersandjs.com/docs#ampersand-router) you will see that it's a pretty simple `"route" => "function"` mapping. I don't really like this. Because it requires me to keep all of my page logic in one file. Or at least it requires me to have a lot of boilerplate code that runs my abstracted page logic.

So what I've come up with is a "controller" based approach that uses the events from the router to automatically run my page logic for me. This is how my custom router wrapper looks in it's entirety:

```javascript
//
// # Router
//
// Setup routes and load controllers.
//

/* jshint node: true */
'use strict';

var AmpersandRouter = require('ampersand-router');

module.exports = AmpersandRouter.extend({
  //
  // ## Controllers
  //
  // A list of all the available controller constructors.
  //
  controllers: {
    Account: require('controllers/account'),
    UserProfile: require('controllers/user-profile'),
  },

  //
  // ## Routes
  //
  // The actual routes mapped to $controller.$action.
  //
  routes: {
    'login': 'Account.login',
    'users/:id/:context': 'UserProfile.profile'
  },

  // --------------------------------------------------------------------------

  // Extra options, passed to each new controller
  controllerOptions: {},

  //
  // ## Initialize
  //
  // Bind route event handler to route function. That's all.
  //
  initialize: function initRouter(options) {
    this.controllerOptions = options.controllerOptions || {};
    this.on('route', this.doRoute.bind(this, options.routeCallback));
  },

  //
  // ## Do Route
  //
  // The route was changed. Get the names of the controller and action and
  // invoke the controller.
  //
  doRoute: function doRoute(routeCallback, name, args) {
    var parts = name.split('.');
    if (parts.length !== 2) {
      throw new Error('Invalid route definition: ' + name);
    }
    var controller = new (this.controllers[parts[0]])(this.controllerOptions);
    var action = controller[parts[1]];

    args.push(routeCallback);

    if (typeof action === 'function') {
      action.apply(controller, args);
    }
    // @TODO: Show 404
    //else {
    //}
  }
});
```

As you can see it's still a bit of a work in progress. But here's the gist of it:

* Define routes as `"url" => "controller.action"`.
* Have a map of controllers.
* Bind the `route` event to our `doRoute()` function that parses the `controller.action` string and runs the correct code.

There are two things to note here. I have something called `controllerOptions` and a `routeCallback` that we need to pass to our initializer. This is what I use in the app state object to make stuff happen when the route change. So back to our app-state object and its initialize method:

```javascript
this.router = new Router({
  routeCallback: this.routeChanged.bind(this),
  controllerOptions: {
    app: this
  }
});
```

We've defined a session property (not visible here) called `router`. We set this property to be an instance of our custom router. We pass it a reference to our route change handler and a reference to ourselves. This is important because this is how each controller gets a reference to the app state object, and in turn the registry etc.

Now, the `routeChanged()` function. I also have a `currentView` session property on my app state. Every time a new controller is created in the router, it is called this function as a callback. The controller will return a view that I set as my `currentView`. The application view will listen for changes to this property and switch out the relevant part of the page for this new view (using the [ampersand-view-switcher](https://www.npmjs.com/package/ampersand-view-switcher) module). That way our application chrome stays intact and the only thing that changes is the page specific content.

_Remember to call `this.router.history.start()` (see [docs](https://www.npmjs.com/package/ampersand-router#history-start-router-history-start-options-) for options) otherwise your router won't do anything. Took me a while to figure out. Also, set `silent` to `false` if you want the router to parse the initial page._

## More On Controllers

It might help if I also explain how the controllers work. All controllers are subclasses of `ampersand-state`. A typical controller might look like this:

```javascript
var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
  // Store a reference to our app-state object
  app: null,
  
  initialize: function initController(options) {
    // Remember `controllerOptions` from the router? Yeah, those are passed to the controller constructor.
    // So now our controller has a reference to the app-state and hence a reference to the registry, which might
    // come in handy.
    this.app = options.app;
  },
  
  // Below are "actions".
  
  // Let's pretend this is the UserProfile controller from above, we then want an action called "profile".
  // If you look at the route definition above you see that we have to "arguments" in the path.
  // :id and :context. Those are passed here. Furthermore the router will pass any querystring present.
  // And finally the callback.
  profile: function (userId, context, query, callback) {
    // Do some stuff and create a view.
    var myNewProfileViewObject = new ProfileView({ model: this });
    // Then pass that view back to the callback.
    callback(null, myNewProfileViewObject);
  }
});
```

In essence, each controller is an `ampersand-state` object. Each controller action creates a view, sets itself as the views model and passes this new view to the callback. Should any error happen this can be passed as the first argument in the callback function. And the application will handle that in a generalized way.

The cool thing about this is that in your controller action you can kick off AJAX requests to fetch new models and do whatever. Your "controller view" can then have subviews that `waitFor` properties on the state object. Ie. you could have a property on your controller that gets set _after_ the view has been returned. This way you can show content to the user immediately and Ampersand will then update the views as AJAX requests finishes.

As you've noticed the controller action is also "asynchronous". Which means that the application view can show a spinner until it's recieved the view from the controller. In case you really have to wait for data before showing anything at all.

## Quick Note On Bootstrapping

In my current project I'm actually rendering the first page in its entirety on the server. Which means that I'll have to have Ampersand pick up where the server left off. I'm doing so now by spitting out all my models as raw JSON. Then in the application states initialize method I create models from that raw data. And all my views' template functions check for existing DOM nodes and return those if they exist, rather than rendering new ones from templates.

## Additional Notes On Templates

When doing client side applications you will also have to render stuff client side. I've solved this by having a module simply called `templates` that look like this:

```javascript
// Browserify can't resolve variables and stuff, which is why we have to
// type out the entire path to the templates here. I'm considering symlinks.
// Or maybe putting them in the base node_modules...
module.exports = {
  user: require('../../../../templates/partials/user.hbs'),
  loginForm: require('../../../../templates/partials/login.hbs'),
  tiledPost: require('../../../../templates/partials/tiledPost.hbs'),
  tabbar: require('../../../../templates/partials/tabbar.hbs'),
};
```

In a view I can then require the templates module and do something like this:

```javascript
// a template function in a view
template: function () {
  // Check for existing DOM node
  var el = document.querySelector('[data-post-id="' + this.model.id + '"]');
  if (el) {
    return el;
  }
  
  var template = require('templates').tiledPost;
  return template(this.model);
},
```

And to make this work you also need a transform module in your Browserify call. I'm using [hbsfy](https://www.npmjs.com/packages/hbsfy).

`browserify -t [ hbsfy -e hbs ] assets/js/main.js -o build/bundle.js`

If you want to add helpers to your Handlebars runtime you can `var Handlebars = require('hbsfy/runtime');` and `registerHelper` on that.

## Conclusion

I'm still very much learning about Ampersand.js and its components. But so far I've had very fun experimenting with it and I think it's very powerful. Many argue that with more rigid frameworks like Ember you will be able to maintain any Ember app once you've learned Ember. This will not be the case with Ampersand, since you basically have to glue things together your way (as far as I understand this is mostly the case with Angular too — please correct me if I'm wrong). But on the other hand it opens up for great flexibility which has its own set of pros. I'm not arguing for or against anything. Ampersand suits me perfectly and I'll continue to use it.

That said. Ampersand is still very young, even though it inherits a lot from Backbone. But it definitely feels solid enough too me. And I know &yet is still putting a lot of work into it. I hope to be able to contribute myself once I've gotten in to it a bit more! :)

Feedback of any kind is super welcome to either hi@-this-domain- or @simmelj on Twitter! Thanks for reading, hope it helped! :)
