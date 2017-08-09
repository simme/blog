---
title: CSS — Complex Style Script
slug: css----complex-style-script
publishDate: 2014-03-01T12:13:29.000Z
date:   2014-03-01T12:17:33.000Z
tags: css
---

I've been spending an unreasonable amount of time thinking about CSS and all the various preprocessors lately. Working on a large project like [Bloglovin](http://bloglovin.com) has given me some perspective. I used to work on smaller "content sites" powered by Drupal where the complexity and number of pages where a lot less significant. I also used to be the sole person writing CSS for any one project.

_Watch out, I'm not really sure where I'm about to take this article. Just felt like venting._

During my last year or so at my previous job we switched from a brief period of dating with LESS to SASS. The possibility of writing loops and if-statements in the CSS was awesome. Nesting and whitespace significant syntax was baller. It kinda made it fun to write CSS again. When starting my rewrite of Bloglovin.com I brought that feeling with me. [Rework](https://github.com/reworkcss/rework) had recently been released and we were switching over to Node.js for our front-end web application. I took the opportunity and went all out on Rework and [css-whitespace](https://www.npmjs.org/package/css-whitespace).

I don't regret that decision. Rework is an amazing piece of software that allows any handy developer to do magic with CSS. It has allowed us to move pretty quickly on the development side of things.

However, during my spare time the past few months I've been experimenting more with pure CSS on a few side projects. And guess what? I like it. Granted, these have been very small projects never even intended for public release.

Now, I would still not want to write pure CSS for any project the size of Bloglovin. But I am starting to think about scaling back a bit on the preprocessor side. I have to admit that [Myth](http://www.myth.io) is partly responsible for putting this thought on my mind.

Thinking more about I think the reasoning boils down to the same reasons I abandoned CoffeeScript. The extra layer of abstraction hides the end result. This is not a problem in and of itself. But it requires more from the developer to write code that still results in good CSS. It's so easy to forget that, especially when build and deploy scripts totally removes you from the final product.

My biggest gripe is probably nesting. We try to never nest more then one step. But still, sometimes that creates unwieldy selectors. Before you say "_but if you were using OOCSS you wouldn't really have that problem_". Yeah, I'm not saying you can't write good CSS using nesting and significant whitespace, all I'm saying is it _allows_ for bad code. It makes it easy to forget to write good code, because writing bad code becomes even easier.

I like systems that takes away that problem. And this is where some smartass comes and tells me that I should use a statically typed language instead of JavaScript. I would still like JS if it were typed, but I don't like transpiled languages — and I _do_ like Node.js. So for now I am stuck with JavaScript, and I'm fine with that.

_So, what is it that I want?_ Some kind of middle ground. I want **real CSS syntax**, curlies and semicolons. It's not that hard to write, most editors do it for you. **No nesting**, forces the developer to think more about classes and structuring all the way from the HTML. Basic preprocessing; [variables](https://www.npmjs.org/package/rework-variant) are really indispensable, [import](https://www.npmjs.org/package/rework-importer) that turns into concatenated CSS, [automatic vendor prefixing](https://www.npmjs.org/package/autoprefixer) and [calc()](https://www.npmjs.org/package/rework-calc).

There are few other utilities like [Imagesize](https://www.npmjs.org/package/rework-imagesize) that are nice but not really required.

I am probably late to the party. But I think it's time for me to scale back on my complexity style scripting and fall back on something closer to the metal. I think I have given the importance of CSS way to little thought. It's always been a tool to me. Time to start viewing it as the _art_ it kinda actually is.

---

I'd love to hear other developers thoughts on this matter. Hit me up on the [twitters](http://twitter.com/@simmelj).
