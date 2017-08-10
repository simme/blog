---
title: "UIStackView with UITextView: Need constraints for Y position or height"
slug: uistackview-uitextview-need-constraints-for-y-position-or-height
publishDate: 2016-06-27T19:00:07.000Z
date:   2016-06-27T19:00:07.000Z
tags: iOS
---

Just today I had to replace a `UILabel` with a `UITextView`. The label was inside of a `UIStackView` that had its position pinned to the bottom of another view, hence growing upwards. I'm doing all of this in Interface Builder btw. Just as I let go of the text view I've dragged in I see that ominous red circle with an arrow show up. Indicating that there's some problem with my layout. I click it and I'm presented with the error:

```
Label Stack View
Need constraints for: Y position or height
```

Very frustrating. It has a constraint for it's Y position. And I want it to grow with its contents so I can't just set a fixed height.

After much clicking around in IB it hits me: `UITextView` is a subclass of `UIScrollView` and hence its height is somewhat ambigious. Or at least there's not any given "intrinsic content size". Easy solution to the error was to deselect the `Enable scrolling` checkbox in the attributes inspector for the text view. I don't want scrolling anyway. I'm going to use a few tricks to make the text view grow with its content anyway!


