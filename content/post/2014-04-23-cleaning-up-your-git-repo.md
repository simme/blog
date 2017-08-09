---
title: Cleaning up Your Git Repo
slug: cleaning-up-your-git-repo
publishDate: 2014-04-23T10:26:18.000Z
date:   2014-04-23T10:26:17.000Z
tags: Git
---

If you have ever worked in a team with more then one person, on a project managed with Git and this project was run using something akin to [git-flow](http://nvie.com/posts/a-successful-git-branching-model/) you have probably seen repos with tons of "dead" branches. Branches that were used for pull requests or features that has long since been merged.

Isn't that annoying? Why would you need all those branches in your local repository? I don't want them in my repo, that's for sure!

Here are two commands that I run regularly to clean up my local Git repository.

`$ git remote prune origin`

`git branch --merged | grep -vE "release|master|develop" | xargs -n 1 git branch -d`

Let's walk through them one by one. 

The first one is a very simple command that removes all your local "remote branches" (the ones named `origin/foobar`) that are no longer on the remote. For example feature branches that have been merged and deleted during a pull request. Of course you can replace `origin` with what ever remote you want to prune.

The second one is a bit more involved:

First grab all the local branches that have been merged. The man pages has this to say about `--merged`:

> --merged is used to find all branches which can be safely deleted, since those branches are fully contained by HEAD.

Secondly run the list through `grep` with an inverted regex to remove the branches we want to keep (in my case those are `release`, `master` and `develop`).

Lastly use `xargs` to run `git branch -d` for every branch in the list. If you want to verify what branches will be actually removed you can run the command without the `xargs` part first to just see the list.

Your local git repo should now only contain the branches that you have not yet merged (current feature branches etc) as well as remote branches still in the works. Now go on with your work knowing your repo is a bit lighter!
