---
title: Swift Equatable and Hashable
slug: swift-equatable-and-hashable
publishDate: 2016-05-31T04:33:49.000Z
date:   2016-05-31T04:33:49.000Z
tags: iOS
---

Swift provides a protocol that you can conform to to let the world know that your objects or structs can be compared and found equal or not: `Equatable`.

There's also a protocol that allows you to use your objects as keys in a dictionary: `Hashable`.

In an app I'm working on I'm making some of the models (`struct`s) conform to these procotols so that I can make diffing and such when refreshing the UI. And I learned a lot very quickly about this particular topic!

Let's pretend we have a struct that holds two integers:

```swift
struct IndexPath {
  let row: Int
  let column: Int
}
```

Now we would like to be able to use our `IndexPath` as keys in a dictionary, so we conform to `Hashable`:

```swift
extension IndexPath: Hashable {
  // Which in turn requires us to provide the `hashValue` property
  var hashValue: Int {
  	// This is what you might do if you're like me and don't really know what you're doing:
    return row.hashValue | column.hashValue
  }
}
```

I was pretty sure I was doing this wrong so I took to the fantastic [Core Intuition Slack](http://chat.coreint.org) (Also if you're not already subscribed to the podcast — do it know, I'll wait!). I quickly got a few very helpful answers. First from [Dennis Hennesy](http://www.peerassembly.com):

>I think `a.hashValue ^ b.hashValue` would be better. The problem with OR is that if one value is 11111….11111, the other value has no effect on the result.

That makes perfect sense. Shortly after, [Michel Fortin](https://michelf.ca/home/) expandend on that saying:

>Even better would be to multiply one of the values by an arbitrary big constant value such as: `a.hashValue ^ (b.hashValue &* 7197972913`. (the `&*` operator is used so that instead of triggering an overflow it'll just wrap around)
>
>Because otherwise all it takes with `^` for the hash to be zero is that `a` and `b` be equal, which could be a likely occurence (depending on your actual data of course).

I wrote a short test to see and surely enough `IndexPath(row: 1, column: 1)` did get the same hash value as `IndexPath(row: 7, column: 7)` when I didn't apply that arbitrary constant. The [NSHipster article](http://nshipster.com/swift-comparison-protocols/) on the subject does not mention this, but do use the `^` operator.

Moving on. Conforming to `Hashable` also forces us to conform to `Equatable` so we have to implement `==` for our little struct:

```swift
// Does not have any methods "on it".
extension IndexPath: Equatable { }

func == (lhs: IndexPath, rhs: IndexPath) -> Bool {
  return lhs.hashValue == rhs.hashValue
}
```

This is what I did first. Turns out this might also be a bad idea. Michel continued to explain:

> Typically, the hash value is used as a first quick check for inequality. If the hash is the same it means the objects *can* be equal, and you then have to do a full check for equality. So it's important for performance that hashes don't collide too often, but it's fine if it happens from time to time.

This is what the Swift documentation says about `hashValue`:
> Axiom: x == y implies x.hashValue == y.hashValue.
>
> Note: The hash value is not guaranteed to be stable across different invocations of the same program. Do not persist the hash value across program runs.

Note the order in the axiom. Two equal objects should have the same `hashValue`. But the "implies" only goes one way. Two equal `hashValue`s might not equal two equal objects. Which is why the `==` operator shouldn't just do a `hashValue` compare, but rather a full compare _if_ the hashValues are the same. If they are not the same we can know for sure that the objects are not equal. But if the `hashValue`s are equal we need to double check.

So finally we end up with:
```swift
struct IndexPath {
  let row: Int
  let column: Int
}

extension IndexPath: Hashable {
  var hashValue: Int {
    return row.hashValue ^ (column.hashValue &* 987654433)
  }
}

extension IndexPath: Equatable { }

func == (lhs: IndexPath, rhs: IndexPath) -> Bool {
  guard lhs.hashValue == rhs.hashValue else { return false }
  return lhs.row == rhs.row && lhs.column == rhs.column
}

// ----

let a = IndexPath(row: 1, column: 2)
let b = IndexPath(row: 3, column: 6)
let c = IndexPath(row: 1, column: 2)

a == b // true
a == c // false
```

Of course this is a bit of a contrived example that probably does not gain much from our little "performance optimization". Might even be that Swift do the hash comparison under the hood if available, I'd be curious to know!

The important part to me was the bits about `hashValue` computation. Getting that right is important. Because if you have to different objects that yield the same hash and then try to use them both as keys in the same dictionary you'll get a few gray hairs. It's errors in code like this that can lead to weird inconsistency bugs.

Thanks to Michel and Dennis for the help! And also to [Kevin Lundberg](http://www.klundberg.com) for weighing in!
