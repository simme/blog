---
title: "Creating Static Table Views"
date: 2017-09-28T11:25:52+02:00
---

One of the most boring tasks an iOS developer can be handed, is to build a static table view. For example a section of the application's settings. There's a lot of boilerplate involved. Interface builder might make it a bit easier, but it is still boring.

Today I started re-arranging the settings screen in [Meal Plan][filibaba], as I was manually creating data sources and switching over index paths I thought to myself, there _has_ to be a better way. Instead of googling around I started out to solve the issue myself.

I have a pretty short list of requirements in this case:

* I want to get a nice overview in the code of the layout of the table view. Ie. I don't want to have to change more than one place to change a cell.
* I need to be alerted whenever a user taps a cell.
* I have to be able to set section headers and footers.

The thing I came up with is, as of now, pretty limited to solve these specific issues. But could be extended fairly easily to accommodate a bit more advanced use cases, I think.

In this particular example we're going to build the "send feedback" screen of Meal Plan. It has two sections and a total of three cells. Send email, rate in App Store and share meal plan with a friend.

What we really have here is a set of three actions. Let define that as an enum:

```swift
enum FeedbackAction {
    case email
    case rate
    case tellFriend
}
```

Now, let's create a protocol that defines the various things that we need for each cell:

```swift
public protocol TableViewDescriptor {
    var icon: UIImage? { get }
    var label: String { get }
    var detailLabel: String? { get }
}
```

Make our feedback action enum conform to this protocol:

```swift
public enum FeedbackAction: TableViewDescriptor {
    case email
    case rate
    case tellFriend

    public var icon: UIImage? {
        switch self {
        case .email: return UIImage(named: "email")
        case .rate: return UIImage(named: "rate")
        case .tellFriend: return UIImage(named: "share")
        }
    }

    public var label: String {
        switch self {
        case .email: return "Personal Feedback"
        case .rate: return "Rate us"
        case .tellFriend: return "Tell a Friend"
        }
    }

    public var detailLabel: String? {
        switch self {
        case .email: return "Email"
        case .rate: return "App Store"
        default: return nil
        }
    }
}
```

Now that we have that, we need a way for a `UITableViewDataSource` to render a table view layout from this. To do this we need to be able to:

* Initiate the `FeedbackAction` enum from an index path.
* Know the layout of the table view, number of sections etc.

Let's start with the latter. We can define a static property on our enum that represents the desired layout of our table view. Like this:

```swift
// Add property to protocol
protocol TableViewDescriptor {
	static var layout: [[Self]] { get }
}

// Add property to our feedback actions
public enum FeedbackAction: TableViewDescriptor {
	static var layout: [[FeedbackAction]] = [
		[.email, .rate],
		[.tellFriend]
	]
}
```

You can see how it's very easy to see that there'll be two sections and what actions will be in each section. That satisfies my "overview" requirement.

Now, the sharp eyed developer will notice that with the layout property, we've already created the mapping between enum and index path. So we can easily address our requirement to initialize the enum from an index path. And we can do this "generically" in an extension on the protocol. While we're at it we can also implement a function for configuring the cells.

```swift
open protocol TableViewDescriptor {
    init(indexPath: IndexPath)
    func configure(cell: UITableViewCell)
}
    
extension TableViewDescriptor {

    public init(indexPath: IndexPath) {
        self = Self.layout[indexPath.section][indexPath.row]
    }

    public func configure(cell: UITableViewCell) {
        cell.textLabel?.text = self.label
        cell.imageView?.image = self.icon
        cell.detailTextLabel?.text = self.detailLabel
    }
}
```

With that we have almost everything we need to implement the table view controller itself. Let's create a `UITableViewController` subclass that is generic over the `TableViewDescriptor` protocol.

```swift
open class StaticTableViewController<Descriptor: TableViewDescriptor>: UITableViewController {

    open var selectionCallback: ((Descriptor, StaticTableViewController) -> Void)?

    // MARK: Data Source

    override open func numberOfSections(in tableView: UITableView) -> Int {
        return Descriptor.layout.count
    }

    override open func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return Descriptor.layout[section].count
    }

    override open func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .value1, reuseIdentifier: nil)
        let action = Descriptor(indexPath: indexPath)
        action.configure(cell: cell)
        return cell
    }

    // MARK: Delegate

    open override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selectionCallback?(Descriptor(indexPath: indexPath), self)
    }
    
}
```

Now, with just one line of code more we can create a table view that renders our feedback enum:

```swift
let feedbackViewController = StaticTableViewController<FeedbackAction>(style: .grouped)
```

With that we have but one of my original requirements left to implement. Section headers and footers. This is probably the least elegant part of my solution, but it works. We'll just add two static properties to our descriptor protocol:

```swift
public protocol TableViewDescriptor {
    static var sectionHeaders: [Int: String]? { get }
    static var sectionFooters: [Int: String]? { get }
}

open class StaticTableViewController<Descriptor: TableViewDescriptor>: UITableViewController {
    override open func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return Descriptor.sectionHeaders?[section]
    }

    override open func tableView(_ tableView: UITableView, titleForFooterInSection section: Int) -> String? {
        return Descriptor.sectionFooters?[section]
    }
}
```

And we can add headers and footers to our enum like so:

```swift
    public static var sectionHeaders: [Int : String]? = [
        0: "We'd love to hear from you"
    ]
    public static var sectionFooters: [Int: String]? = [
        0: "For support errands it is easier for us to help via email.",
        1: "Tell a friend about this app by sending them a link via text or email."
    ]
```

Easy, huh?

Due to generic constraints, that I'm not proficient enough to work around, I went with a selection callback, rather than a full on delegate protocol. So the usage of the above would end up as something like this:

```swift
let vc = StaticTableViewController<FeedbackAction>(style: .grouped)
vc.title = "Send Feedback"
vc.selectionCallback = { action, vc in
    if let indexPath = vc.tableView.indexPathForSelectedRow {
        vc.tableView.deselectRow(at: indexPath, animated: true)
    }
	  switch action {
		  case .email: sendEmail()
		  case .rate: openAppStore()
		  case .tellFriend: shareApp()
	  }
}
```

I've put the [full source code][github] in a Playground that can be found on my GitHub account. Expanding the usage for custom cell types, accessory views, etc, is left as an exercise for the reader. ;)

[filibaba]: http://filibaba.com
[github]: https://github.com/simme/StaticTableViewController
