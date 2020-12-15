---
title: "Composable Architecture and UIKit: The View Controller"
date: 2020-11-21T21:34:57+01:00
tags: swift, composable-architecture, uikit
---

_This will be the first in a — hopefully — long series of posts about building a UIKit app using [The Composable Architecture][TCA], developed by [Brandon Williams][brandon] and [Stephen Celis][stephen] of [PointFree.co][pointfree] fame._

If you do not subscribe to Point-Free I highly suggest you take a look at some of the free episodes to get you started. If you'd like to sign up, here's a [referral link][referral] that'll give me some credit! :)

This is **not** an introduction to TCA. If you're interested in learning more I highly implore you to checkout the videos or the [GitHub repo][TCA] to learn more.

Furthermore, I've only really experimented with this and never actually finished a complete app using these techniques. I've only just started a new project where I'm going all in on TCA and I'm learning as I build this app. This series will be me exploring and learning as I go. Input is highly valued!

With that out of the way, let's get started!

## View Controllers

The pillar of any UIKit app is the `UIViewController`. It's hard to do anything without those. Personally, I tend to have one view controller per "major part of the screen" and use composition where I feel like it make structural and logical sense.

As such, I implement each feature or screen in the app as one view controller, with its own state, actions and reducer.

Some general guidelines I try to keep in mind as I build up the structure of an app:

* If a controller can present another controller modally, that's a substate/substore of the presenting view controller.
* Collection view cell's each have their own substate and cells implement their own reducer and actions. More on that in a later post.
* Some view controller might act as sort of a "coordinator"/root view controller and thus is a superstate of multiple view controllers where there's a variable flow or loose connection between the involved controllers.

## The `StateStoreViewController` class

To reduce the amount of boilerplate I have to write with each new view controller I created this "super class" that takes care of the most basic things.

```swift
import Combine
import ComposableArchitecture
import UIKit

/// Convenience class for view controllers that are powered by state stores.
open class StateStoreViewController<State: Equatable, Action>: UIViewController {

  // MARK: Properties

  /// The store powering the view controller.
  open var store: Store<State, Action>

  /// The view store wrapping the store for the actual view.
  open var viewStore: ViewStore<State, Action>

  /// Keeps track of subscriptions.
  open var cancellables: Set<AnyCancellable> = []

  // MARK: Initialization

  /// Creates a new store view controller with the given store.
  ///
  /// - Parameter store: The store to use with the view controller.
  ///
  /// - Returns: A new view controller.
  public init(store: Store<State, Action>) {
    self.store = store
    self.viewStore = ViewStore(store)
    super.init(nibName: nil, bundle: nil)
  }

  @available(*, unavailable) public required init?(coder: NSCoder) {
    fatalError("Not implemented")
  }

}
```

1. We define a view controller subclass that is generic over `State` and `Action`. We require that `State` is `Equatable` because that's required by the `ViewStore` initializer. I've never found myself having to do a `State` that was _not_ equatable, so that's just a convenience.
2. We define properties for the `store` and the `viewStore` so that subclasses don't have to bother with that, since we'll be using those everywhere, especially the `viewStore`. Since we'll also be using Combine to do state observation we define a `cancellables` property for subscriptions as well.
3. We create a custom initializer that takes a `store` so that we don't have to define one in each subclass.
4. We mark the `init(coder:)` initializer as `unavailable` which relieves us from having to implement that in each subclass.[^1] I don't use Storyboards and write all my UI in code. If you're using Storyboards you might have to reconsider how you do the initialization part.

## Usage

Now if we were to implement a simplified version of the Counter example from the TCA docs it might look a little something like this:

```swift
import Combine
import ComposableArchitecture
import UIKit

public struct AppState: Equatable {
  var counter: Int = 0

  public init(counter: Int = 0) {
    self.counter = counter
  }
}

public enum AppAction: Equatable {
  case decrementButtonTapped
  case incrementButtonTapped
}

public let appReducer = Reducer<AppState, AppAction, Void> { state, action, _ in
  switch action {
  case .decrementButtonTapped:
    state.counter -= 1
    return .none

  case .incrementButtonTapped:
    state.counter += 1
    return .none
  }
}

public final class CounterViewController: StateStoreViewController<AppState, AppAction> {

  public override func viewDidLoad() {
    super.viewDidLoad()
    view.addSubview(stackView)
    view.backgroundColor = .systemBackground
    NSLayoutConstraint.activate([
      stackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
      stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
    ])

    configureStateObservation()
  }

  private func configureStateObservation() {
    viewStore.publisher.counter
      .map(String.init)
      .map(Optional.some)
      .assignNoRetain(to: \.text, on: countLabel)
      .store(in: &cancellables)
  }

  private lazy var stackView: UIStackView = {
    let stackView = UIStackView(arrangedSubviews: [incrementButton, countLabel, decrementButton])
    stackView.translatesAutoresizingMaskIntoConstraints = false
    return stackView
  }()

  private lazy var countLabel: UILabel = {
    let label = UILabel()
    label.text = "\(viewStore.counter)"
    label.font = .preferredFont(forTextStyle: .title2)
    return label
  }()

  private lazy var incrementButton: UIButton = {
    let button = UIButton(primaryAction: UIAction { [unowned self] _ in
      self.viewStore.send(.incrementButtonTapped)
    })
    button.translatesAutoresizingMaskIntoConstraints = false
    button.setTitle("+", for: .normal)
    return button
  }()

  private lazy var decrementButton: UIButton = {
    let button = UIButton(primaryAction: UIAction { [unowned self] _ in
      self.viewStore.send(.decrementButtonTapped)
    })
    button.translatesAutoresizingMaskIntoConstraints = false
    button.setTitle("-", for: .normal)
    return button
  }()

}
```

And then in the scene delegate, or wherever we need a counter, we can set it up with:

```swift
let viewController = CounterViewController(store: .init(
  initialState: AppState(),
  reducer: appReducer,
  environment: ()
))
```

Much of this code is just the usual UIKit view code[^2]. The only interesting part is really the state observation configuration:

```swift
  private func configureStateObservation() {
    viewStore.publisher.counter
      .map(String.init)
      .map(Optional.some)
      .assignNoRetain(to: \.text, on: countLabel)
      .store(in: &cancellables)
  }
```

The `viewStore` has a publisher property that vends a publisher for each property. So we can dig into the `counter` and get a publisher for that property. We map it through `String.init` to turn it into a string. Then, because `.text` on a label is optional we also have to map it through an `Optional.some` to make the type [system happy][optionalkeypath]. Then I have a custom combine operator to assign the published value to a key path without creating a strong reference.

So that's all it takes to setup a simple view controller powered by TCA.

## Bonus

There are more things we can do to provide even more ergonomics. For example, bar button items. We probably always want them to send an action to our view store. Implementing a `UIAction` for each button creates a lot of boilerplate. To avoid this, we can create an extension on `ViewStore` to hide this for us, like so:

```swift
extension ViewStore {
  func barButtonItem(title: String, image: UIImage?, action: Action, menu: UIMenu? = nil) -> UIBarButtonItem {
    UIBarButtonItem(title: title, image: image, primaryAction: UIAction { [weak self] _ in
      self?.send(action)
    }, menu: menu)
  }
}
```

And now we can easily create a bar button item that opens settings, for example:

```swift
navigationItem.leftBarButtonItem = viewStore.barButtonItem(
  title: "Settings",
  image: UIImage(systemName: "gear"),
  action: .didTapSettings
)
```

There are lots of small things, like this, one can do to greatly reduce the amount of boilerplate it takes to create a UIKit app. And with the tools that TCA provides it can become really easy to quickly build up the bones of a UIKit app and start prototyping without having to provide real data or connect to real backends.

## Conclusion

With the generic `StateStoreViewController` we can remove almost all of the boilerplate required to build view controllers powered by The Composable Architecture.

Next time we'll talk about collection views and how I've set that up!

[^1]: A trick I learned from [Pádraig][padraig] on his [new blog][padraig-blog].
[^2]: I have a bunch of auto layout helpers and convenience view initializers too, that in my case would reduce the required amount of code even more. I've published that code as a package called [Tablecloth](https://github.com/Filibaba/Tablecloth), might write about that later.

[TCA]: https://github.com/pointfreeco/swift-composable-architecture
[brandon]: https://twitter.com/mbrandonw
[stephen]: https://twitter.com/stephencelis
[pointfree]: https://www.pointfree.co/
[referral]: https://www.pointfree.co/subscribe/personal?ref=nSUVh3GS
[optionalkeypath]: https://forums.swift.org/t/combine-assign-to-optional-property-alternate-versions/36058
[padraig]: https://twitter.com/padraig
[padraig-blog]: https://padraig.org/appkit/2020/10/25/layout-in-code.html
[github]: https://github.com/simme/TCAUIKit/tree/main