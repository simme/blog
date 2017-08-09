---
title: "My Résumé: or How I Accidentally Built a Static Site Generator"
slug: my-resume-or-how-i-accidentally-built-a-static-site-generator
publishDate: 2015-09-14T18:06:56.000Z
date:   2015-09-14T18:06:56.000Z
tags: Ramblings
---

One thing that I did not really realize when I started freelancing was that potentially customers sometimes asks for a résumé. I hadn't had a résumé in over six years. And I probably only wrote one or two before that.

So last week when I was approached by a company, that I really wanted to work with, asked for my résumé I sat down to write one. I opened up a new Google Docs file and started writing. After a few minutes of writing that stupid programmer's brain of mine realized that I was spending a lot of time doing repetitive tasks like formatting dates and titles.

> I should write this as a JSON file and let the computer style it for me!

`cmd-w` good bye Google Docs. Fired up Vim and started typing JSON instead. But JSON is not great for typing stuff. `/me converts file to YAML`. Ok, got my résumé data figured out. Now what?

I needed to take a pile of data run it through some templating engine and present the resulting HTML. Simple enough. But.. I should probably have a special Handlebars helper to [format date ranges](https://github.com/simme/resume/blob/master/themes/formal/helpers/date-range.js). And one for [converting Markdown](https://github.com/simme/resume/blob/master/themes/formal/helpers/md.js). And one for [killing orphans](https://github.com/simme/resume/blob/master/themes/formal/helpers/orphan-killer.js) (I'm not a monster, talking about lonley words here. And not actually about killing them, rather giving them a friend. So I'm a kind of word hero.)

It's very tiresome to have to remember to include these new helpers every time I write a new helper.. I could probably automate this! And that's how the [Theme](https://github.com/simme/resume/blob/master/theme.js) thing was born. Takes a path, loads helpers and partials at said path. Provides methods for rendering a template into HTML.

Hm.. but now, how do I actually run this stuff? Seems like this would be a good use case for a build system. Like Gulp. A set of simple tasks for compiling CSS, minifying HTML, inlining critical CSS (which was all CSS..) and optimizing images. A [Gulpfile](https://github.com/simme/resume/blob/master/Gulpfile.js) saw the light of day.

One last thing. This HTML I now have gotta be hosted somewhere. I have this Linode. But it's setup with Haproxy to just serve a bunch of Node.js servers. So using [static server](https://www.npmjs.com/package/static-server) I cobbled together a simple script that could be run using Forever.

Actually, **now the last thing**. Code has to move from my computer to the server. Hmm.. I guess I could just build a simple Gulp task that somehows.. moves.. hmm.. _rsync_. Let's just use frickin' _rsync_.

```
cp -R build/ /tmp/simonljsv
mv /tmp/simonljsv/resume-sv.html /tmp/simonljsv/index.html
rm /tmp/simonljsv/resume-en.html
rsync -avz /tmp/simonljsv/ root@iamsim.me:~/simonljungberg.se/
rm -rf /tmp/simonljsv

cp -R build/ /tmp/simonljen
mv /tmp/simonljen/resume-en.html /tmp/simonljen/index.html
rm /tmp/simonljen/resume-sv.html
rsync -avz /tmp/simonljen/ root@iamsim.me:~/simonljungberg.com/
rm -rf /tmp/simonljen
```

Simple enough! Also.. that server thing is not really built for production. Not that it'll have to withstand tons of load.. Haproxy doesn't really do caching. So let's put Cloud Flare in front of it. It's free for my purposes. And wow, look at that. PageSpeed Insights are now showing 98 and 94 for mobile and desktop respectively. If it wasn't for TypeKit and Google Analytics I'd be nailing that 100 so hard.

Did this make me finish the résumé faster? No. On the contrary, it took me a few nights longer then if I had just written that Google Docs. But now I have my CV datafied. Which is nice. And I also got to built a tiny personal site for myself. I'm no designer, but I think it looks ok!

You can check 'em out at [simonljungberg.se](http://simonljungberg.se) for the Swedish version and [simonljungberg.com](http://simonljungberg.com) for the English — not yet proof read — version!
