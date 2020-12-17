---
title: "Composable Architecture and UIKit: Collection Views"
date: 2020-12-16T19:03:44+01:00
tags: swift, composable-architecture, uikit
---

In the [first installment][first-post] of this blog series on UIKit and [The Composable Architecture][TCA] we talked about how we can reduce the boiler plate required to setup a view controller powered by a `Store`.

This post will build on that and see what it takes to implement a collection view.

The first thing you need to know about rendering items from a TCA `Store` in a table or collection view is that we won't be referring to the items by `IndexPath`. Instead we'll be using `IdentifiedArray`, a collection type provided by the library.

This is because you'll be creating a new `Store` for each cell. And you'll be storing references to this store. So using index paths can become fragile if the list of items changes.

## Reducing Cell Boilerplate

Just like we did for view controller's we'll improve the ergonomics of working with custom cells by creating a special TCA-aware class that we'll in turn specialize for each individual cell type our app needs.

```swift
import Combine
import ComposableArchitecture
import UIKit

/// The state store cell is a cell superclass designed to work with Composable Architecture state stores. It removes
/// much of the boiler plate involved with creating a custom cell subclass.
open class StateStoreCell<State: Equatable, Action>: UICollectionViewCell {

  // MARK: Properties

  /// Any current store for this cell.
  public var store: Store<State, Action>?

  /// Any current view store for this cell.
  public var viewStore: ViewStore<State, Action>?

  /// A place to store cancellables for state subscriptions.
  public var cancellables: Set<AnyCancellable> = []

  // MARK: Initialization

  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupViews()
  }

  @available(*, unavailable) public required init?(coder: NSCoder) { fatalError() }

  // MARK: Configuration

  /// Configure the cell with the given store.
  ///
  /// - Parameter store: The store to use for the cell.
  public func configure(with store: Store<State, Action>) {
    let viewStore = ViewStore(store)
    self.store = store
    self.viewStore = viewStore
    configureStateObservation(on: viewStore)
  }

  // MARK: Cell Lifecycle

  open override func prepareForReuse() {
    super.prepareForReuse()
    cancellables.removeAll()
    store = nil
    viewStore = nil
  }

  // MARK: Subclass API

  /// Override this method to configure state observation whenever the cell is configured with a new store.
  ///
  /// - Parameter viewStore: The view store that was created as part of the configuration.
  open func configureStateObservation(on viewStore: ViewStore<State, Action>) { }

  /// Override this method to setup views when a cell is created.
  open func setupViews() { }

}
```

As you can see it is very similar to our view controller class. The most important difference is the optional stores. Since the cell will be reused and perhaps be backed by many different stores during its lifespan we can't pass it a store during initialization (since UIKit handles the initialization).

Instead we provide a special method that will take a store in. It'll then do the necessary setup and call a special `configureStateObservation(on:)` method. This way our subclasses don't have to deal with optional view stores. That gives us an honest view store we can configure observation on.

Furthermore we override `prepareForReuse()` to clear out any subscriptions and stores.

We also provide a `setupViews()` method that subclasses can override to add their own subviews and UI.

Let's move on to an example collection view setup!

## The Cell

Let's start by implementing just a cell that contains a label.

```swift
import Combine
import ComposableArchitecture
import UIKit

struct ListItem: Equatable, Identifiable {
  var id: UUID
  var title: String?
}

enum ListItemAction: Equatable {

}

final class ListCell: StateStoreCell<ListItem, ListItemAction> {

  override func configureStateObservation(on viewStore: ViewStore<ListItem, ListItemAction>) {
    viewStore.publisher.title
      .assignNoRetain(to: \.text, on: label)
      .store(in: &cancellables)
  }

  // MARK: Views

  override func setupViews() {
    contentView.addSubview(label)
    NSLayoutConstraint.activate([
      label.leadingAnchor.constraint(equalTo: contentView.layoutMarginsGuide.leadingAnchor),
      label.trailingAnchor.constraint(equalTo: contentView.layoutMarginsGuide.trailingAnchor),
      label.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
      contentView.heightAnchor.constraint(equalTo: label.heightAnchor, constant: 16)
    ])
  }

  private lazy var label: UILabel = {
    let label = UILabel()
    label.translatesAutoresizingMaskIntoConstraints = false
    label.adjustsFontForContentSizeCategory = true
    label.font = .preferredFont(forTextStyle: .body)
    return label
  }()

}
```

We define a struct that contains an _id_ and a _title_. The struct needs to be `Identifiable` to be used in our list state later, using an `IdentifiedArray`.

We also create an action enum that we'll leave empty for now. But we'll come back to that.

Then there's the cell itself. We'll make it a subclass of the `StateStoreCell` class we created earlier and specialize it to the `ListItem` types.

Then override `configureStateObservation(on:)` and bind the store's title property to the label's text property.

The rest of the code just deals with the label and its auto layout constraints.

## List State

Let's move on to the state and action's of the list itself now.

```swift
struct ListState: Equatable {
  var items: IdentifiedArrayOf<ListItem> = []
}

enum ListAction: Equatable {
  case itemAction(id: UUID, action: ListItemAction)

  case loadItems
  case didLoadItems([ListItem])
}

struct ListEnvironment {
  var fetchItems: () -> AnyPublisher<[ListItem], Never>
}

let listReducer = Reducer<ListState, ListAction, ListEnvironment> { state, action, environment in
  switch action {
  case .loadItems:
    return environment.fetchItems()
      .map(ListAction.didLoadItems)
      .eraseToEffect()

  case let .didLoadItems(items):
    state.items = IdentifiedArray(items)
    return .none

  case let .itemAction(id: id, action: action):
    return .none
  }
}
```

We're keeping it simple. The state is just an `IdentifiedArray` that contains `ListItem`s.

The `ListAction` has an action that triggers loading of items, one action that handles loaded items and then a catch all for the cells' actions that we'll deal with later.

The `ListEnvironment` defines a function that returns a publisher that we'll use to feed the state with items.

## The View Controller

I'm just gonna dump the entire thing in here and then we'll go through it piece by piece.

```swift
final class ListViewController: StateStoreViewController<ListState, ListAction> {

  private enum Section { case main }

  private lazy var collectionView = createCollectionView()

  private lazy var layout = createLayout()

  private lazy var dataSource = createDataSource()

  private lazy var cellRegistration = createCellRegistration()

  private lazy var cellStores: [IndexPath: Cancellable] = [:]

  override func viewDidLoad() {
    super.viewDidLoad()
    title = "Fav Characters"
    view.addSubview(collectionView)

    configureStateObservation()
  }

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    viewStore.send(.loadItems)
  }

  private func configureStateObservation() {
    viewStore.publisher.items
      .compactMap { [weak self] in self?.createSnapshot($0) }
      .receive(on: DispatchQueue.main)
      .sink { [weak self] in
        self?.dataSource.apply($0, animatingDifferences: true)
      }
      .store(in: &cancellables)
  }

  private func createCollectionView() -> UICollectionView {
    let collectionView = UICollectionView(frame: view.bounds, collectionViewLayout: layout)
    collectionView.backgroundColor = .systemBackground
    return collectionView
  }

  private func createLayout() -> UICollectionViewCompositionalLayout {
    let configuration = UICollectionLayoutListConfiguration.init(appearance: .plain)
    let layout = UICollectionViewCompositionalLayout.list(using: configuration)
    return layout
  }

  private func createDataSource() -> UICollectionViewDiffableDataSource<Section, UUID> {
    .init(collectionView: collectionView) { [weak self] collectionView, indexPath, item in
      guard let self = self else { return nil }
      return collectionView.dequeueConfiguredReusableCell(using: self.cellRegistration, for: indexPath, item: item)
    }
  }

  private func createCellRegistration() -> UICollectionView.CellRegistration<ListCell, UUID> {
    .init { [weak self] cell, indexPath, itemId in
      guard let self = self else { return }
      let cancellable = self.store.scope(
        state: { $0.items[id: itemId] },
        action: { ListAction.itemAction(id: itemId, action: $0) }
      ).ifLet { scopedStore in
        cell.configure(with: scopedStore)
      }
      self.cellStores[indexPath] = cancellable
    }
  }

  private func createSnapshot(_ items: IdentifiedArrayOf<ListItem>) -> NSDiffableDataSourceSnapshot<Section, UUID> {
    var snapshot = NSDiffableDataSourceSnapshot<Section, UUID>()
    snapshot.appendSections([.main])
    snapshot.appendItems(items.elements.map(\.id))
    return snapshot
  }

}
```

Most of the properties should be fairly self-explanatory. The only one that might need further detaling is the `cellStores` property. We'll use this to store scoped `Store`s for our cells.

In `viewWillAppear` we kick off the fetching of items. This causes the reducer to reach out to our `ListEnvironment` and get that publisher of items.

Which brings us to the next step. We configure observation on our store that whenever the `items` property changes we create a new data source snapshot and then we'll apply that snapshot to our data source.

**Important:** since view store updates are triggered on `willChange` it is not certain that the actual store has been updated when the data source asks for a cell after applying the snapshot. This will lead to crashes or weird behavior. That's the main reason the `recieve(on:)` operator is in that chain. It is safe to apply a snapshot to a data source from a background queue, but it has to be _consistent_. Since we can't make any guarantees about which queue the publisher fires on it's best to be on the safe side any way.

What follows after is mostly collection view related boiler plate using the new iOS 14 APIs for cell registration. The contents of the cell registration is also our next point of interest. This is where we'll scope the view controller's store to a new store focused on a particular item for a cell. Using the `ifLet` operator we then take this scoped store and pass it to the cell.

Lastly we'll store that "store subscription" in our `cellStores` property and tie it to the specific indexPath.

_Now this is an area I haven't delved that much into yet. But for now I do not attempt any reuse of these stores. Since they are tied to index paths and those might change and not map to the same item anymore they are not safe to use. Perhaps storing based on id and reusing is better. But I've yet to see any issues with this particular approach._

## Putting it on the Screen

In your `SceneDelegate` you can now replace the method that creates a window with the following and hit run to see a list of two characters from The Mandalorian.

```swift
func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
  guard let windowScene = (scene as? UIWindowScene) else { return }
  window = UIWindow(frame: UIScreen.main.bounds)
  let viewController = ListViewController(store: .init(
    initialState: ListState(),
    reducer: listReducer,
    environment: ListEnvironment(
      fetchItems: {
        CurrentValueSubject([
          .init(id: UUID(), title: "The Mandalorian"),
          .init(id: UUID(), title: "The Child"),
        ]).eraseToAnyPublisher()
      }
    )
  ))

  let navigationController = UINavigationController(rootViewController: viewController)
  navigationController.navigationBar.prefersLargeTitles = true
  window?.rootViewController = navigationController
  window?.windowScene = windowScene
  window?.makeKeyAndVisible()
}
```

![Screenshot of iOS simulator showing our collection view so far.](/images/2020/tca-collectionview-1.png)

Very nice.

## Adding Cell Actions

With this it now becomes trivial to add something like swipe to delete.

First, add a `delete` action to the `ListItemAction`.

```swift
enum ListItemAction: Equatable {
  case delete
}
```

Then, update the layout constructor to add a trailing swipe action.

```swift
var configuration = UICollectionLayoutListConfiguration.init(appearance: .plain)
configuration.trailingSwipeActionsConfigurationProvider = { [weak self] indexPath in
  guard let self = self, let id = self.dataSource.itemIdentifier(for: indexPath) else { return nil }
  let actionHandler: UIContextualAction.Handler = { action, view, completion in
    self.viewStore.send(.itemAction(id: id, action: .delete))
    completion(true)
  }

  let action = UIContextualAction(style: .destructive, title: "Delete", handler: actionHandler)
  return UISwipeActionsConfiguration(actions: [action])
}
```

This will add a left swipe action on the cells that sends a `delete` action wrapped in a `itemAction`. Next we need to update our list reducer to handle this case:

```swift
case let .itemAction(id: id, action: .delete):
  state.items.remove(id: id)
  return .none
```

And that's all it takes to implement removing an item. The same can be done with things like cell selection and context menu actions.

## Cell Reducers

As you may have noticed we didn't have any reducer for the cell itself. That's because in this scenario the cell didn't really _do_ anything. We just need them to update whenever the underlying state changes.

In an upcoming post I will talk about how we can implement image loading for cells. This implementation will require a reducer for the cell.

## Conclusion

You might be thinking this looks like a lot of extra stuff just to implement cells. Even if it's not apparent from this example, we now have cells that automatically update themselves if their data changes. Since we used the `id` for the data source it will not update the collection view unless they change. But since the cells have a store scoped to their particular piece of data they will update anyway!

Once we start getting into more "advanced" functionality it'll be clearer what this can unlock. But I feel like this post has gone on for long enough now. So that'll be a story for next time!

[first-post]: https://www.iamsim.me/composable-architecture-and-uikit-the-view-controller/
[TCA]: https://github.com/pointfreeco/swift-composable-architecture
[referral]: https://www.pointfree.co/subscribe/personal?ref=nSUVh3GS