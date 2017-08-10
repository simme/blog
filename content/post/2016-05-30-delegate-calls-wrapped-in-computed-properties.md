---
title: Delegate calls wrapped in computed properties
slug: delegate-calls-wrapped-in-computed-properties
publishDate: 2016-05-30T11:32:36.000Z
date:   2016-05-30T11:36:44.000Z
tags: iOS
---

In the app I'm currently working I have a view that asks its delegate for the locale to use when rendering it's model object.

The model has strings for all of the supported locales embeded in it and its just a matter of using the correct one when rendering.

The view itself can go through a number of different transitions which is why I need to ask the delegate a few times in a few different places for what locale to use. And I also need to provide a default value in all of those places.

Of couse you could have a property on your view that you just set whenever the view is initialized or whenever you are given a delegate. But this might cause problems because the delegate is not set when `awakeFromNib` is called or what ever.

So I came up with this pattern:

```swift
var locale: String {
  return delegate?.mySpecialViewLocale(self) ?? "en"
}
```

Which works great. It removes the optional from all of the other places in my view and it also allows me to set a default value in one place.

I elaborated a bit more on this and came up with the following:

```swift
protocol MySpecialViewDelegate: class {
  func mySpecialViewStringForView(view: MySpecialView) -> String
}

class MySpecialView: UIView {

  weak var delegate: MySpecialViewDelegate? = nil

  private var cachedString: String? = nil

  private var specialString: String {
    guard let cached = cachedString else { return cachedString }
    guard let string = delegate?.mySpecialViewStringForView(self) else { return "some default value" }
    cachedString = string
    return cachedString
  }
}
```

Basically it adds a caching mechanism to the computed property. If you know that your delegate won't change that value during the lifetime of the object doing the delegation this might be a fine solution if you expect the delegate call to be heavy or if you're calling it *a lot*. But be careful about caching issues. The delegate is probably the one who _should_ do the caching...
