---
title: iOS Storyboard Tips & Tricks
slug: ios-storyboard-tips-tricks
publishDate: 2015-05-08T19:46:22.000Z
date:   2015-05-08T19:46:22.000Z
tags: iOS
---

I've been spending some time diving into iOS development for reals during my spare time the last couple of months. In this time I've come to learn a lot of things about storyboards, other than that they are pretty awesome.

Here are two things in particular.

## Table View Data Sources and Delegates

In the very [first issue](http://www.objc.io/issue-1/index.html) of [objc.io](http://objc.io) they discuss how to make your `UITableViewControllers` [lighter](http://www.objc.io/issue-1/lighter-view-controllers.html) by moving data sources and delegates to separate objects. Turns out you can achieve this with storyboards — without the need to create a custom table view controller subclass!

1. In Interface Builder search for `Object` in the _Object Library_ (lower right).
2. Hit `Return` or drag the `Object` to your table view.
3. If it's not automatically selected, seletect the `Object` and open up the _Identity Inspector_.
4. In the section `Custom Class` enter the name of your custom data source class.
5. Control drag from the table view to your data source object, select `data source` from the popup menu.
6. You're done!

By hooking things up this way I've come along way without creating a ton of custom controllers just to create my data sources.

## The Exit/Unwind Segue

You probably know this already if you've ever done anything with storyboards, but it was news to me.

1. Implement a method in a view controller (any view controller — I think) with the following signature `func myUnwindSegue(segue: UIStoryboardSegue)`.
2. Control drag from any button to the `Exit` icon on your _current_ view and select the method you want to "unwind" to.

Whenever your button is tapped the current view controller will be dimissed if it was presented modally or popped from the navigation stack if it's contained in a navigation controller. Basically it'll do the right thing to go back to the view controller implementing the method. If the destination view controller cannot be unwound to, because it's not in the navigation stack or something, the button will do nothing (I think).

Now, any function with the above signature will show up in the list of available ones. So first of all, if you have lots of view controllers you want to unwind to you probably want to name your methods in a unique way, and not just `back`. Maybe `returnToListOfThings` or `saveThisThing`.
