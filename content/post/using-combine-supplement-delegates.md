---
title: "Using Combine to Supplement Delegates With Publishers"
date: 2019-10-01T13:36:07+02:00
tags: swift, combine
---

Anyone who's ever written an iOS app has come in contact with the delegate pattern. It's a great pattern and fills an important role in iOS development.

_However_, sometimes when you're writing your own custom classes it can feel like a bunch of boilerplate just to notify a delegate that something happened. You might resort to adding a couple of callback properties instead, but those come with their own baggage.

### Publishing Actions

In the recent versions of [Pantry](https://www.pantry.app) I've explored a (to me) new pattern of making my view controllers and objects publishers and publishing actions instead when the user performs an action.

It might look a little something like this:

```swift
import UIKit
import Combine

final class MyCollectionViewController: UIViewController {

    enum Action {
        case selected(Item)
        case showFilterSettings
    }

    public var publisher = PassthroughSubject<Action, Never>()

    // .. code for setting up collection views etc.

    // the action of a keyboard command or navbar button
    @objc private func showFilterSettings() {
        publisher.send(.showFilterSettings)
    }
}

extension MyCollectionViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let item = // .. fetch item from data source based on index path
        publisher.send(.selected(item))
    }
}
```

### Subscribing to Actions

Now when you create that new view controller you can directly, inline, subscribe to these actions and act accordingly. Something like this perhaps:

```swift
let viewController = MyCollectionViewController()
let subscription = viewController.publisher.sink { action in
    switch action {
    case let .selected(item):
        let newViewController = MyDetailViewController(for: item)
        navigationController.show(newViewController)
    case .showFilterSettings:
        let filterSettingsController = FilterSettingsController()
        navigationController.present(filterSettingsController, animated: true)
    }
}
```

Or even move the event handler to its own isolated method that can be easily unit tested or whatever. You know the drill!

### Communicating Back

Now, the reason that this post's title reads supplementing, not replacing, delegates is that the matter of communicating back to the view controller sending the action becomes a little hairier.

One of the advantages to an approach like this is that you can have multiple subscribers to the same publisher. So if you for some reason need to react in multiple different ways to an item being selected you can split that responsibility up between different objects.

On the other hand it also means that there's no clear way of replacing delegate methods that asks a delegate "should I show this thing" or similar. You could pass a callback function as part of the published action. But then what happens if multiple subscribers respond? Waiting for all subscribers to respond might require you to set up some sort of timeout waiting pattern and.. well. It quickly becomes less work to just implement a delegate protocol.

### Before We Go

One small change we can make to improve our API is to make the view controller itself a publisher. We can keep the `PassthroughSubject` but make it private. Then in the required methods of the `Publisher` protocol we can _delegate_ to the `PassthroughSubject`.

```swift
final class MyCollectionViewController: UIViewController {
    enum Action {
        case selected(Item)
        case showFilterSettings
    }

    // publisher can now be private
    private var publisher = PassthroughSubject<Action, Never>()
}

extension MyCollectionViewController: Publisher {
    typealias Output = Action
    typealias Failure = Never

    func receive<S>(subscriber: S)
        where S : Subscriber,
        MyCollectionViewController.Failure == S.Failure,
        MyCollectionViewController.Output == S.Input
    {
        publisher.subscribe(subscriber)
    }
}
```

After doing that we can drop the `.publisher` and just subscribe directly to the created view controller:

```swift
let viewController = MyCollectionViewController()
let subscription = viewController.sink { action in
    switch action {
    case let .selected(item):
        let newViewController = MyDetailViewController(for: item)
        navigationController.show(newViewController)
    case .showFilterSettings:
        let filterSettingsController = FilterSettingsController()
        navigationController.present(filterSettingsController, animated: true)
    }
}
```

### Conclusion

I find this pattern pretty neat and handy when a delegate isn't really necessary. Or when you need to be able to communicate actions to multiple subscribers. Probably nothing new to all you RX folks. But for us who never took the leap before Combine it is brand new and cool.

I'm still in the shallow part of the Combine pool. So feel free to poke me if I've made something wacky! I'm [simmelj](https://www.twitter.com/simmelj) on Twitter. And this blog supports WebMentions thanks to [A WebMention Endpoint](https://webmention.herokuapp.com) by [VoxPelli](https://www.voxpelli.com).
