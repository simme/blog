---
title: UIStackView and Autolayout
slug: uistackview-and-auto-layout
publishDate: 2015-07-31T19:35:56.000Z
date:   2015-07-31T19:36:20.000Z
tags: iOS
---

Was about to tear my own hair off due to issue with `UIStackView` and autolayout. Here's a simplified version of my view hierarchy:

```
- UIStackView
  - MyCustomView
    - UILabel
  - MyCustomView
    - UILabel
  - MyCustomView
    - UILabel
```

The stack view are laying the custom views out in a horizontal fashion. Now, whenever I added a constraint similar to this:

```swift
let xConstraint = NSLayoutConstraint(item: label,
  attribute: .Left,
  relatedBy: .Equal,
  toItem: self,
  attribute: .Left,
  multiplier: 1.0,
  constant: 20)
```

to my custom view (where `self` in this case is the custom view) would make the stack view shift all content way off to the left.

Took a while to figure out that the reason for this was a line that I automatically add to all of my views as soon as I need to do some programmatic autolayouting:

```swift
self.translatesAutoresizingMaskIntoConstraints = false
```

Ie, I was disabling autoresize mask translation for my custom view. Turns out the stack views are somehow making use of those.. I guess?
