---
title: "Combine's Sequence Publisher Missing First Element"
date: 2019-10-03T12:04:08+02:00
tags: combine, swift
---

Just had a fun run in with a bug in Combine. Any `Sequence` can produce a `Publisher` that publishes each element in
the sequence when you subscribe to it.

You might have a custom sequence implementation that counts from 1 to 9:

```swift
final class Incrementer {
    var value = 0

    func next() -> Int? {
        value += 1
        guard value < 10 else {
            return nil
        }
        return value
    }
}

extension Incrementer: Sequence {
    func makeIterator() -> AnyIterator<Int> {
        return AnyIterator {
            self.next()
        }
    }
}
```

If you now create an instance of this `Incrementer` you can see that Combine has automatically provided a publisher that
you can subscribe to:

```swift
let i = Incrementer()
i.publisher
```

"That's very neat", you think to yourself. So you go to try it out, just something simple at first. Like this:

```swift
i.publisher.sink { v in
   print(v)
}

// Output:
2
3
4
5
6
7
8
9
```

Cool! Huh, wait a second. Where's `1`? I have no idea actually. This works as expected:

```swift
let i = Incrementer()
for x in i {
    print(x)
}
```
 So it doesn't seem related to the `Sequence` implementation.

 Anyway, adding a `.map { $0 }` before calling `.sink` solves the issue.

 ```swift
let i = Incrementer()
i.publisher.map { $0 }.sink { v in
    print(v)
}


// Output:
1
2
3
4
5
6
7
8
9

 ```

🤷‍♂️

Thanks to [Simon Westerlund](https://www.twitter.com/wesslansimon) for helping me investigate this. If anyone at Apple
happens to read this I've filed a Feedback: FB7343531.
