---
title: Lazy Properties in Swift
slug: lazy-properties-in-swift
publishDate: 2014-09-19T10:40:36.000Z
date:   2014-09-19T19:34:41.000Z
tags: Swift
---

Continuing to use my blog as a reference for myself and a summary of stuff I've learned about here's a post about Swift!

I've spent some time now trying to write a little app, and I recently wanted to set a custom `dataSource` on one of my tableviews. The problem was that I wanted to keep a reference to this dataSource in my table view controller (which I might actually not need since it's always there via the `tableView` property). _But_, in Swift you need to initialize all properties in your `init()` which I couldn't use since I'm relying on storyboards, so `awakeFromNib()` is the correct place to set such stuff up.

I first tried using optionals, ie:

```
class MyTableView: UITableViewController {
  let dataSource: CustomDataSource?
  
  override func awakeFromNib() {
    dataSource = CustomDataSource()
    tableView.dataSource = dataSource!
  }
}
```

The problem with this approach is that anytime I want to reference my dataSource I have to unwrap it using `!`. Which feels stupid and clumsy.

Spewing out some frustration on Twitter gave me [a hint](https://twitter.com/maciekish/status/512740889068707842) on how to _properly_ solve this.

So after reading up on `lazy` my tableview controller now looks like this:

```
class MyTableView: UITableViewController {
  lazy var dataSource: FormalTableViewDataSource = {
    return CustomDataSource()
  }()
  
  override func awakeFromNib() {
    tableView.dataSource = dataSource
  }
}
```

This also works when you have a property that's an object who's constructor needs an object that you create after `init()` for example.

I'll be super greatful if anyone tells me I'm doing it wrong :)
