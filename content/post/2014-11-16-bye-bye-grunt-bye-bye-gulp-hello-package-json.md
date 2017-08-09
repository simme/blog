---
title: Bye bye Grunt, bye bye Gulp. Hello package.json.
slug: bye-bye-grunt-bye-bye-gulp-hello-package-json
publishDate: 2014-11-16T14:33:54.000Z
date:   2014-11-16T14:33:54.000Z
tags: Web Development
---

Build systems. The eternal blight of software development. The necessary evil that causes hair loss at a way to young age. Ok, maybe it's not all that bad. But we've all been bitten by them. The build systems.

Anyway. I've never liked Grunt. There I said it. The configuration style doesn't fit me. I've always thought it was too configy and clunky. Then came Gulp that promised a straightforward pipe-based API. It was supposed to be fast. I took to it. I spent some time getting in to Gulp, learning it's API and building out my own build system.

After a while I found this article about how Dan Tello [structures his Gulpfile](http://viget.com/extend/gulp-browserify-starter-faq). I started doing the same. But then, one day, I read a blog post by Keith Cirkel where he was talking about [why we should stop using Grunt & Gulp](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/). And it struck me:

> Why am I spending all this time writing code that is not my "real" code?

The post has a perfectly valid point:

> I realise that someone, somewhere will have a valid use-case for build tools like Grunt and Gulp. I believe, however, that npm can handle 99% of use-cases elegantly, with less code, less maintainence, and less overhead than these tools.

I like that. "Less code, less maintainence".

So, the gist of it. I like SASS and Browserify. So what do I need? I need to:

* Build my application for production.
* Build for development (with automatic rebuilding).
* Testing.

Here's a relevant section from an example `package.json` file.

```json
  "scripts": {
    "test": "node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- --ui tdd -R spec --inline-diffs",
    "build": "browserify -t [ hbsfy -e hbs ] assets/js/main.js -o build/foo.js | uglifyjs2 build/foo.js > build/bloglovin.min.js",
    "watch": "watchify -d -v -t [ hbsfy -e hbs ] assets/js/main.js -o build/foo.js & sass --watch --sourcemap assets/sass:build",
    "start": "NODE_ENV=development nodemon index.js --port=3000 --admin-port=3001"
  },

```

Now when I run `npm run build` I know _exactly_ what it does!

Does it look good? No. It doesn't. But it's pragmatic. I know exactly what each of my build commands does. I don't need to go in to detail about it here. But as you can see it does everything I need it to do in four lines of "code". If I thought one of the lines was getting out of hand I could pretty easily extract it into it's own Bash script and run that instead.

Just like in March when I realized I had strived too far from [what makes CSS, CSS](http://iamsim.me/css----complex-style-script/) and that I wanted to get back to basics. I've started to feel the same about build systems. Let's keep it simple. Let's focus on the code that makes up our apps! :D
