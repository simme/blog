---
title: "UIStackView: Left align without stretching"
slug: uistackview-left-align-without-stretching
publishDate: 2016-05-19T12:32:10.000Z
date:   2016-05-19T12:32:10.000Z
tags: ios
---

`UIStackView` introduced in iOS 9 is awesome. However, as someone coming from the HTML/CSS programming world I sometimes find that it does not _really_ match up with the mental model I have of how it _should_ work.

There's not any straight forward way of putting a number of absolutely sized items in a stack view and aligning them to either side. You can make them stretch to fill, distribute equally over the entire width of the stack view and you can center them. But from what I've found there's not really any way to just "stack them to a side".

Turns out, there is!

All you need is a bit of `setContentHuggingPriority` and an invisible stretcher view.

For each arranged subview that you want to keep to a fixed size call `.setContentHuggingPriority(1000, forAxis: .Horizontal)`. This will make the view resistant to stretching.

Then create a new invisible view that we'll use as a "filler" for the rest of the space.

```
let stretchingView = UIView()
stretchingView.setContentHuggingPriority(1, forAxis: .Horizontal)
stretchingView.backgroundColor = .clearColor()
stretchingView.translatesAutoresizingMaskIntoConstraints = false
recipePropertyView.addArrangedSubview(stretchingView)
```

As you might notice this view has a very low content hugging priority making it susceptible to stretching. You also need to make sure that your stack view's distribution is set to `Fill`.

You can place this stretching where ever you want. Place it first to align items to the right. Or place it in the middle to create sort of a toolbar like layout.

Happy stacking!
