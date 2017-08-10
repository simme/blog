---
title: Getting rid of typographic orphans with Swift
slug: getting-rid-of-typographic-orphans-with-swift
publishDate: 2016-05-20T05:30:38.000Z
date:   2016-05-20T05:30:38.000Z
tags: iOS
---

I composed this little Swift string extension to get rid of typographic orphans when rendering titles and such:

```swift
//
//  String+Typography.swift
//  FilibabaKit
//
//  Created by Simon Ljungberg on 09/05/16.
//  Copyright © 2016 Filibaba. All rights reserved.
//
import Foundation

extension String {

    /**
     String Without Orphan
    
     - Returns: The string with the last space replaced with a non-breaking space to avoid orphans.
    */
    var stringWithoutOrphan: String? {
        get {
            let space = NSCharacterSet(charactersInString: " ")
            if let lastSpace = self.rangeOfCharacterFromSet(space, options: .BackwardsSearch, range: nil) {
                return self.stringByReplacingCharactersInRange(lastSpace, withString: "\u{00a0}")
            }
            return self
        }
    }

}
```
