---
title: "Using Self Executing Closures to Run Code in SwiftUI"
date: 2020-01-30T16:30:44+01:00
tags: swift, swiftui, ios
---

Not being able to run arbitrary code in SwiftUI view builders can be quite annoying. The other day I realized it's possible to use self executing closures to work around this!

Here's a contrived example that creates a stretchy header:

```swift
struct ScrollThing: View {
  var body: some View {
    ScrollView {
      VStack(spacing: 0) {
        GeometryReader { g in
          Color.white
            .offset(y: {
              let offsetY = g.frame(in: .global).minY
              return offsetY > 0 ? offsetY : 0
            }())
        }.aspectRatio(1, contentMode: .fill)

        Color.blue.frame(height: 1000)
      }
    }
    .edgesIgnoringSafeArea(.vertical)
  }
}
```

### Variable Naming

There seem to be some sort of function builder parse bug when it comes to variables with the same name as view modifiers. I've had issues with the compiler confusing a local closure variable for a view modifier. So be on the look out for that!
