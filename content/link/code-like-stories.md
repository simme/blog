---
title: "Writing Code That Reads Like a Story"
date: 2018-01-29T19:05:30+01:00
link: "http://lightsonsoftware.com/writing-code-that-reads-like-a-story/"
---

Stumbled upon this post by Scott Mountenay today. It's a great post (except for assuming all developers to be a "he")
that successfully highlights the biggest problem I, personally, encounter as a developer:

> When the written expression diverges too far from the mental model, it becomes increasingly difficult for the
> programmer to reason about the code and map it to their own mental model, at which point working with the code
> becomes very difficult. Eventually the programmer will determine that the code no longer makes any sense, and that
> it must be rewritten. Rewriting the code is a suboptimal outcome, requiring a lot of time and effort to develop and
> express a new mental model.

This is something that I've struggled with my entire career. And I suspect I'm not alone. Getting to that stage where
it _feels_ easier to just scrap the entire thing and do a rewrite. Which then creates a vicious cycle of rewrites,
because:

> There is great risk that the programmer eager to rewrite the code in accordance with his own mental model does not
> >understand everything that is happening in the current system, and will not account for those things in his new
> model.

I've started to become aware of this issue as of late and have started to implement a defence systems for this. When I
can no longer fit a problem and it's potential solution in my head I start to feel frustrated. It's easy to
procrastinate instead of pushing through. This is when pen and paper is an excellent tool, and as I
[wrote the other day](http://www.iamsim.me/microblog/10/) taking a break to do some refactoring and documentation helps
to regain that grasp of the code and how it all fits together.

Said refactoring contains a lot of the things that Scott writes about, like reording methods, reducing nesting, break
out long functions into smaller ones. And so on. I've found that for me it reduces the cognitive load required to keep
the "main areas" of the code in my head if all the "cruft" is shuffled into tiny functions that I don't have to "see".
