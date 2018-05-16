---
title: "UILabel With Padding"
date: 2018-05-16T11:09:27+02:00
tags: ios, swift
---

Sometimes you want to add padding to a `UILabel`. But doing so requires a parent view that adds the actual padding. This subclass fixes this by adding a property for `edgeInsets` and takes care of the necessary overrides to deal with the layouts.

I haven't run in to any issues with this. Let me know if you use it and improve it!

```swift
// MIT License applies.

import UIKit

/**
 A `UILabel` subclass that provides a way of adding padding to the label.
 */
open class Label: UILabel {

    /// The amount of padding for each side in the label.
    @objc dynamic open var edgeInsets = UIEdgeInsets.zero {
        didSet {
            setNeedsLayout()
            invalidateIntrinsicContentSize()
        }
    }

    open override var bounds: CGRect {
        didSet {
            // This fixes an issue where the last line of the label would sometimes be cut off.
            if numberOfLines == 0 {
                let boundsWidth = bounds.width - edgeInsets.left - edgeInsets.right
                if preferredMaxLayoutWidth != boundsWidth {
                    preferredMaxLayoutWidth = boundsWidth
                    setNeedsUpdateConstraints()
                }
            }
        }
    }

    open override func drawText(in rect: CGRect) {
        super.drawText(in: UIEdgeInsetsInsetRect(rect, edgeInsets))
    }

    open override var intrinsicContentSize: CGSize {
        var size = super.intrinsicContentSize
        size.width  += edgeInsets.left + edgeInsets.right
        size.height += edgeInsets.top + edgeInsets.bottom

        // There's a UIKit bug where the content size is sometimes one point to short. This hacks that.
        if numberOfLines == 0 { size.height += 1 }

        return size
    }

    open override func sizeThatFits(_ size: CGSize) -> CGSize {
        var parentSize = super.sizeThatFits(size)
        parentSize.width  += edgeInsets.left + edgeInsets.right
        parentSize.height += edgeInsets.top + edgeInsets.bottom

        return parentSize
    }
}
```

Here's a [gist](https://gist.github.com/simme/cbf22d2ff84b09edc5f0e6854b7411b5)!
