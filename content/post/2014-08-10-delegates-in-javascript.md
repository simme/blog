---
title: Delegates in JavaScript
slug: delegates-in-javascript
publishDate: 2014-08-10T18:20:11.000Z
date:   2014-08-10T18:20:21.000Z
tags: JavaScript
---

If you've ever done any iOS or Mac development you're probably pretty familiar with the [delegation pattern](http://en.wikipedia.org/wiki/Delegation_pattern). If you've never set foot in Cocoa land you've probably _never_ heard about this (or at least not used it). Basically delegation is a way of specializing an object and removing certain "business logic" from it. For example, take the `UITableView` on iOS. That's the class responsible for displaying all those lists you see on the iPhone. It has a very "simple" mission: render a list of item (and manage scrolling, view reuse etc). An instance of `UITableView` knows nothing about the data it displays, or how it should be displayed. This is all up to the `dataSource` and `delegate` to figure out. Ie. the table view instance will _query_ the `dataSource` for data and views to render.

The [data source protocol](https://developer.apple.com/library/ios/documentation/uikit/reference/UITableViewDataSource_Protocol/Reference/Reference.html) defines a number of methods that a table view data source must or can implement. So, the table view asks the data source "Hey, how many rows should I draw?", "How high are the cells for each row?" and "Could I please have the cell for row 5 in section 2". Et cetera. (Nitpickers need not point out the fact that I took the data source instead of the actual delegate as an example. IMO the data source _is_ a delegate, just another kind. Also made for a better example.)

This makes for very clean separation of responsibilities. The table view don't have to know anything about where the data comes from. Which makes it very easy to reuse the table view itself. Say you're building a Twitter client. There are many places you would show a timline, profile, main feed, list. All of them look the same, but the data comes from different places.

Anyway, lately I've been experimenting with this concept in JavaScript. I guess that basically it's just another way of doing "model -> view". But say you wanted to build a generic list view for the web, a list view that could optimize for scrolling performance and usability, while not having to care about data at all. And then you modularize that and then all of a sudden you have a component you can reuse basically anywhere as long as you slap some extra methods on your model, or view model, or whatever, and you're done.

Kind of a rambly and weird post that didn't really go anywhere. I just feel like delegation could be a handy pattern that should be used more on the web. Instead of having a jQuery-plugin that just takes a `ul`-element already in the DOM you could have a component that acts upon a model.
