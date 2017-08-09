---
title: Taking advantage of Node's require algorithm with Browserify
slug: taking-advantage-of-nodes-require-algorithm-with-browserify
publishDate: 2014-12-22T21:02:56.000Z
date:   2014-12-22T21:02:56.000Z
tags: JavaScript
---

This morning I read [a post](https://medium.com/node-js-javascript/working-without-frameworks-part-1-b948f281f782) written by [Paolo Fragomeni](https://twitter.com/hij1nx). In it he describes how he builds stuff without using a framework. The part that was really eye opening to me though, was the fact that you can have a `node_modules` directory in other places than in the root of your project.

Thinking about it it seems kind of obvious. However, it _is_ an easy thing to overlook. Paolo didn't dive too deeply into the nitty gritty details, so I'll lay it out in this post.

Here's the gist of it. Say you have a folder structure that looks like this:

```
my-app/
  assets/
    js/
      node_modules/
        .. your custom front-end modules
      main.js
  node_modues/
    .. lots of modules
```

Say `main.js` looks something like this:

```javascript
var Application = require('application');
var app = new Application();
app.boostrap();
```

And then you use [Browserify](http://browserify.org) to build this with something like:

```bash
browserify assets/js/main.js > build/app.js
```

Now.. where does `application` live? How does Browserify find it? The long answer is described in the [Node.js documentation for loading modules](http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders). The short answer is: first we look in the `node_modules` folder inside of the assets folder. If the module we're looking for cannot be found there Node (or Browserify in our case) starts walking up the directory tree looking for another `node_modules` folder.

So our theoretical `application` module might live in `my-app/assets/js/node_modules/application/`. In this folder there'd be an `index.js` file that looks something like this perhaps:

```javascript
module.exports = Application;

function Application() {
  // Some setup logic and stuff.
}

Application.prototype.bootstrap = function () {
  // Magic
};
```

The thing I _don't_ like about this approach is that it creates tons of `index.js` files, which might make it hard to tell file from file in your editor or whatever. So what I like to do is to actually have a `package.json` for each module with only two properties. Like so:

```json
{
  "name": "application",
  "main": "application.js"
}
```

This way the module file can be `application.js`. You end up with a lot of package files instead, but I can live with that.

## Grouping Modules

One pattern that you might be accustomed to is to group models in one directory, views in one directory, helpers in one etc. You can still do that! Simply by putting your modules inside directories.

```
node_modules/
  models/
    user-model/
    article-model/
  views/
    user-view/
```

Now, to rewuire the `user-model` module, for example, you'd do: `require('models/user-model');` Notice the lack of `./` or even worse `../` in front of the model path. Regardless of from _where_ you are calling `require` this will still work. Since Browserify will look inside your `node_modules` folder by default!

## .gitignore

If you're like me then you like to ignore the `node_modules` folder by default. But since in this case the folder would actually contain code that you might not publish as individual modules you probably also want to commit them to you project repo. Easy! Just put `!assets/js/node_modules` in your `.gitignore` and commit away!

## Conclusion

Not having to worry about relative path's inside your require statements is a huge boost to code clarity. I really like this approach and will continue experimenting with it!

Also, remember that this applies to Node.js code as well, it's not limited to Browserify. It could also be a great way of making it easy to share code between client and server!

Thanks Paolo, for the tip!
