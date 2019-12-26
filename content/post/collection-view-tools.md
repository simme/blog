---
title: "UICollectionView Ergonomics"
date: 2019-12-25T19:33:00+01:00
---

One of my favorite things in UIKit is `UICollectionView`. I love how versatile it is. With iOS 13 it got even better with the diffable data source and compositional layout APIs.

However, when dealing with collection views there's a lot of boiler plate one has to take care of. In this post I want to share some of the code I've written to make working with collection views a bit nicer.

## Reusability and Configuration

The central part of collection views are its cells of course. In collection views cells _has_ to be instantiated by the `dequeueReusableCell` method. And to be dequeued they first have to be registered. With the power of Swift's type system we can create a couple of helper protocols to make this process simpler and perhaps even more concise and clear.

First we create a protocol to define what it means to be a reusable cell. All we really need is a reuse identifier:

```swift
public protocol ReusableCell: UICollectionViewCell {
  static var reuseIdentifier: String { get }
}
```

Then we can write an extension on that protocol to provide a default implementation for all cells that conform to the protocol:

```swift
public extension ReusableCell {
  // 1.
  static var reuseIdentifier: String { String(describing: Self.self) }
	
  // 2.
  static func register(with collectionView: UICollectionView) {
    collectionView.register(Self.self, forCellWithReuseIdentifier: Self.reuseIdentifier)
  }
	
  // 3.
  static func dequeue(from collectionView: UICollectionView, at indexPath: IndexPath) -> Self {
    collectionView.dequeueReusableCell(
      withReuseIdentifier: Self.reuseIdentifier,
      for: indexPath) as! Self
  }
}
```

1. We can use the `String(describing:)`[^1] initializer to get the name of the implementing type which will result in a unique identifier for each class.
2. With this method we can call `OurCellClass.register(with: collectionView)` which reads a bit nicer.
3. This makes it so that we don't have to do the `as? OurCellClass` dance in the `cellForItemAtIndexPath` method. The force casting should be safe to do in this scenario as long as we use the `register(with:)` method.

With this code we can create a new cell class:

```swift
public final class OurCellClass: UICollectionViewCell, ReusableCell { ... }
```

And then if we subclass `UICollectionViewController`:

```swift
public final class OurCollectionViewController: UICollectionViewController {
  public override func viewDidLoad() {
    super.viewDidLoad()
    OurCellClass.register(with: collectionView)
  }
}
```

Or if we just create a `UICollectionViewController` without subclassing we can of course just do:

```swift
let viewController = UICollectionViewController(layout: someLayout)
OurCellClass.register(with: viewController.collectionView)
```

### Supplementary Views

We can do the same for supplementary views:

```swift
public protocol ReusableCollectionReusableView: UICollectionReusableView {
  static var elementKind: String { get }
  static var reuseIdentifier: String { get }
}

public extension ReusableCollectionReusableView {
  static var elementKind: String { String(describing: Self.self) + "-element-kind" }
	
  static var reuseIdentifier: String { String(describing: Self.self) }
	
  static func register(with collectionView: UICollectionView) {
    collectionView.register(
      Self.self,
      forSupplementaryViewOfKind: Self.elementKind,
      withReuseIdentifier: Self.reuseIdentifier)
  }
	
  static func dequeue(from collectionView: UICollectionView, at indexPath: IndexPath) -> Self {
    collectionView.dequeueReusableSupplementaryView(
      ofKind: Self.elementKind,
      withReuseIdentifier: Self.reuseIdentifier,
      for: indexPath) as! Self
  }
}
```

The only real difference is that we also need the `elementKind`.

## Configuring Cells

When working with generic data sources it can be handy to also make cell configuration generic. You might for example have some data source class that is generic over the model type it operates on. In such cases you could also provide a `ConfigurableCell` protocol:

```swift
public protocol ConfigurableCell: ReusableCell {
  associatedtype Item
  func configure(for item: Item)
}
```

It then becomes trivial to create a data source that is generic over both a cell type and a model and constrain the generics so that the model and `Cell.Item` is the same type. I'm currently not doing that in any of my projects though, so that exercise is left to the reader. This has been written about by many already.

Regardless of whether you have a generic data source or not, it might be nice to use this API for all cells anyway. Since it creates a unified way of handling configuration across all your cells.

## Getting Rid of the Cell All-together

I have often found myself wanting to use a cell outside of the context of a collection view. Ie. as a plain view. Maybe in a contextual menu preview for example. While `UICollectionViewCell` _is_ a subclass of `UIView` this is technically possible, but it does feel a little weird.

That's why I've created the `ViewHostingCollectionViewCell`. It's a generic cell type that has one job: wrap a `UIView` subclass in a collection view cell and forward important cell updates to the view.

The first part is a protocol that defines a couple of properties and methods a view confined in a cell needs to have.

```swift
public protocol CellConfinable: UIView {
  associatedtype Item
  var isSelected: Bool { get set }
  var isHighlighted: Bool { get set }
  func prepareForReuse()
  func configure(for item: Item)
}
```

This will allow the view to behave pretty much like any collection view cell.

Then we have the actual cell implementation:

```swift
public final class ViewHostingCollectionViewCell<View: CellConfinable, Item>:
  UICollectionViewCell,
  ConfigurableCell where Item == View.Item {

  // MARK: Properties
	
  /// The reuse identifier, made unique by using the type of the wrapped view.
  public static var reuseIdentifier: String { return "hosted-\(String(describing: View.self))"}
	
  /// The hosted view.
  public let hostedView: View
	
  /// The selection state of the cell.
  public override var isSelected: Bool {
    didSet {
      hostedView.isSelected = isSelected
    }
  }
	
  /// The highlight state of the cell.
  public override var isHighlighted: Bool {
    didSet {
      hostedView.isHighlighted = isHighlighted
    }
  }
	
  // MARK: Initialization
	
  public override init(frame: CGRect) {
    hostedView = View(frame: frame)
    super.init(frame: frame)
    contentView.addSubview(hostedView, constraints: [
      equal(\.leadingAnchor),
      equal(\.trailingAnchor)
    ])
    contentView.topAnchor.constraint(equalTo: hostedView.topAnchor).isActive = true
    contentView.bottomAnchor.constraint(equalTo: hostedView.bottomAnchor).isActive = true
  }
	
  public required init?(coder: NSCoder) { Abort.because(.shutUpXcode) }
	
  // MARK: Cell Configuration
	
  public override func prepareForReuse() {
    super.prepareForReuse()
    hostedView.prepareForReuse()
  }
	
	
  public func configure(for item: Item) {
    hostedView.configure(for: item)
  }
}
```

It's fairly simple and straight forward. It's generic over `View` which must be a `UIView` that conforms to the `CellConfinable` protocol.

When a cell is dequeued its `init(frame:)` method is called. Since we know that `View` is a `UIView` we can instantiate one the same way.[^2] [^3]

## Wrapping Up

With all of this in place we can now create a custom view:

```swift
public final class OurView: CellConfinable {
  public init(frame: CGRect) {
    super.init(frame: frame)
    // add subviews and configure layout
  }

  public func configure(for item: OurModel) {
    // configure the view for the model 
  }
}
```

And when we create our collection view:

```swift
let viewController = UICollectionView(layout: someLayout)
ViewHostingCollectionViewCell<OurView>.register(with: viewController.collectionView)
```

And in our data source, using a diffable data source:

```swift
let dataSource = UICollectionViewDiffableDataSource<SectionIdentifier, OurModelIdentifier>(collectionView: viewController.collectionView) { collectionView, indexPath, item in
  let cell = ViewHostingCollectionViewCell<OurView>.dequeue(from: collectionView, at: indexPath)
  cell.configure(for: item)
  return cell
}
```

Isn't that nice?

[^1]: There is some contention regarding the use of `String(describing:)` for use cases like this. I stumbled upon [this post](https://forums.swift.org/t/relying-on-string-describing-to-get-the-name-of-a-type/16391) by [@skagedal](https://www.twitter.com/skagedal) on the Swift forums. But as in our case we only need a runtime unique identifier, we're not relying on it to load stuff from our bundle, I think we're fine.
[^2]: The Auto Layout code I'm using here is inspired by the [Auto Layout with Key Paths episode](https://talk.objc.io/episodes/S01E75-auto-layout-with-key-paths) of [Swift Talk](https://talk.objc.io/).
[^3]: I'm using [some code](https://github.com/davedelong/Syzygy/blob/17c806c608463d8abedc434c3b6cb04d4d9d1003/SyzygyCore/Markers.swift) inspired by [@davedelong](https://www.twitter.com/davedelong) here. Specifically `Abort.because(.shutUpXcode))`. Dave's "SyzygyCore" is a treasure trove of nice little helper methods, extensions and classes. I encourage you to browse it!