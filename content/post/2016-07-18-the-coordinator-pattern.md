---
title: The Coordinator Pattern
slug: the-coordinator-pattern
publishDate: 2016-07-18T05:48:50.000Z
date:   2016-07-19T17:12:42.000Z
tags: iOS
---

Soroush Khanlou had a very interesting [blog post](http://khanlou.com/2015/10/coordinators-redux/) a while back. In it he elaborates on his "coordinator pattern". Its a very neat pattern in which you make all of your view controllers "flow agnostic". Ie. they know nothing about the view controller hierarchy, when to push another view controller on the navigation stack, when to present a modal etc. All of that responsibility is delegated to a coordinator object. Each view controller becomes completely isolated. If you haven't read his post you should go ahead and do that before continuing here. It's a great read!

I'm currently working on a new app for [Filibaba](http://filibaba.com). When the various flows of the app started coming together I quickly realized that many of the view controllers were basically the same, but with small variations in behavior. I had started building the app using storyboards and segues and that was quickly becoming a mess.

## Isolation

I took a week to pause feature development and rewrite each view controller. Instead of having direct access to the model layer each view controller now has properties and a delegate that informs the behavior. Instead of pushing a detail view controller on the stack a table view instead notifies its delegate (most likely a coordinator) that a cell was selected. The delegate then creates the detail view controller and pushes it on the stack.

This means that no view controller relies on global state or is in any other way tied to the rest of the environment. So reusing them becomes incredibly easy.

## Enter Coordinator

After doing this I was left with very pretty view controllers, but a very broken app. So I took to pen and paper to sketch out each of the flows in the app. Basically a flow chart of the entire app. Doing this I could identify areas where the same type of flow occurred. Each of these areas became their own coordinator.

For example, I had a onboarding flow that was very similar to the edit flow. These became the one and same coordinator.

After having each of the flows down I started thinking about what a coordinator needed to be able to do:

* Maintain a list of child coordinators.
* They need a root view controller to start from.
* They need a reference to my storyboard to instantiate view controllers.
* They need a reference to my "application context" (an object containing database connections and settings).
* Start and stop child coordinators.

I came up with this protocol (gist, might not show up in RSS readers):

```swift
//
//  Coordinator.swift
//
//  License: MIT
//  Author: Simon Ljungberg, Filibaba
//
import UIKit

/// A callack function used by coordinators to signal events.
typealias CoordinatorCallback = (Coordinator) -> Void

/**
 A coordinator is an object that manages the flow and life cycle of view controllers in an application.
 See: http://khanlou.com/2015/10/coordinators-redux/ for more.
 */
protocol Coordinator: NSObjectProtocol {
   /// A string that identifies this coordinator.
   var identifier: String { get set }

   /// Some object holding information about the application context. Database references, user settings etc.
   var appContext: AppContext? { get }

   /// The storyboard we create new view controllers from. Not using segues, only storyboard identifiers.
   var storyboard: UIStoryboard { get }

   /// The root view controller for a coordinator.
   var rootViewController: UIViewController { get }

   /// We identify each coordinator with a string, for debugging reasons and stuff.
   var childCoordinators: [String: NSObject] { get set }

   /// Force a uniform initializer on our implementors.
   init(appContext: AppContext?, storyboard: UIStoryboard, rootViewController: UIViewController)

   /// Tells the coordinator to create its initial view controller and take over the user flow.
   func start(withCallback completion: CoordinatorCallback?)

   /// Tells the coordinator that it is done and that it should rewind the view controller state to where it was before `start` was called.
   func stop(withCallback completion: CoordinatorCallback?)

   /**
     Add a new child coordinator and start it.
     - Parameter coordinator: The coordinator implementation to start.
     - Parameter identifier: A string identifiying this particular coordinator.
     - Parameter callback: An optional `CoordinatorCallback` passed to the coordinator's `start()` method.
     - Returns: The started coordinator.
   */
   func startChild<T: NSObject where T: Coordinator>(coordinator coordinator: T, withIdentifier identifier: String, callback: CoordinatorCallback?) -> T

   /**
     Stops the coordinator and removes our reference to it.
     - Parameter identifier: The string identifier of the coordinator to stop.
     - Parameter callback: An optional `CoordinatorCallback` passed to the coordinator's `stop()` method.
   */
   func stop(coordinatorWithIdentifier identifier: String, callback: CoordinatorCallback?)
}
```

```swift
/**
 A default implmentation that provides a few convenience methods for starting and stopping coordinators.
 */
extension Coordinator {
   // Default implementation, so that we don't have to do this for all coordinators.
   func startChild<T: NSObject where T: Coordinator>(coordinator coordinator: T, withIdentifier identifier: String, callback: CoordinatorCallback?) -> T {
      childCoordinators[identifier] = coordinator
      coordinator.start(withCallback: callback)
      return coordinator
   }

   func stop(coordinatorWithIdentifier identifier: String, callback: CoordinatorCallback? = nil) {
      guard
         let coordinator = childCoordinators[identifier] as? Coordinator,
         let index = childCoordinators.indexForKey(identifier)
      else {
         fatalError("No such coordinator: \(identifier)")
      }

      coordinator.stop(withCallback: { [unowned self] (coordinator) in
         self.childCoordinators.removeAtIndex(index)
         callback?(coordinator)
      })
    }

   /**
      Start a child coordinator of the inferred type and store a reference to ti.
      - Parameter rootViewController: The root view controller of the new child coordinator.
      - Parameter configure: An optional configuraiton block
   */
   func startChildWith<T: NSObject where T: Coordinator>(
      rootViewController: UIViewController,
      callback: CoordinatorCallback? = nil,
      configureWith configurationBlock: ((T) -> Void)? = nil
   ) -> T {
      let coordinator = T.init(appContext: appContext, storyboard: storyboard, rootViewController: rootViewController)
      configurationBlock?(coordinator)
      startChild(coordinator: coordinator, withIdentifier: coordinator.identifier, callback: callback)
      return coordinator
   }
}
```

(To simplify things pertaining to storing of child coordinators etc I made the coordinators `NSObject`s. Generic self constraints and what not. Would be great to get around this somehow.)

The default implementation extension provides convenience methods for starting and stopping a coordinator.

## Usage

So imagine you have a view controller showing a contact. The view is displaying an edit button. The view controller is managed by a `ContactsBrowsingCoordinator`. The user taps that edit button which triggers a delegate call: `delegate?.contactDetailViewController(contactDetailViewController: ContactDetailViewController, wantsToEditContact contact: Contact)`

The delegate of the view controller is the `ContactsBrowsingCoordinator`. When the `wantsToEdit` method is called it spins off an `EditContactCoordinator` doing something like this:

```swift
func contactDetailViewController(contactDetailViewController: ContactDetailViewController, wantsToEditContact contact: Contact) {
  // The type of coordinator to start is inferred by the type declaration in the block.
  startChildWith(rootViewController, callback: nil) { (coordinator: EditContactCoordinator) in
    // Your chance to set behavioral properties on the `EditContactCoordinator`, like the contact being edited.
    // This block is called _before_ the start method of the coordinator.
    coordinator.contactToEdit = contact

    // This coordinator can be a delegate of the new coordinator to get notified of events. Like when the user is
    // done. This is when this coordinator would call `stop` on the edit coordinator which would then rewind the
    // navigation stack and return to where it kicked off.
    coordinator.delegate = self
  }
}
```

In the `start` method of the `EditContactCoordinator` we create the edit view controller and present it:

```swift
func start(withCallback: CoordinatorCallback) {
  // See: https://medium.com/swift-programming/uistoryboard-safer-with-enums-protocol-extensions-and-generics-7aad3883b44d
  let viewController: EditContactViewController = storyboard.instantiateViewController()

  // Pass on the property we set before
  viewController.contact = contact
  viewController.delegate = self

  rootViewController.presentViewController(viewController, animated: true)
}
```

## Recap

This particular design has made it super simple for me to modify the various flows when we've made changes to ordering. It makes each view controller very simple and easy to read and reason about.

All of the flows are clearly articulated in each coordinator and following along is straight forward. I don't think I'll ever write an app any other way.

Sure, it's a bit of boilerplate. For smaller apps you will end up with more code just to connect two view controllers. But I still think it's worth it in the long run. It also helps you think about what each view controller has to be able to do when you define its delegate protocol. It is easy to see when things start to get out of hand and you might have to split things up further.

I implement each view controller delegate as an extension to my coordinators. This way it is easy to split it up into multiple files and find the bit of code you're looking for.

Many, not all, view controllers are still defined and laid out in a storyboard. I'm just not using segues. Instead I'm using a [storyboard extension](https://medium.com/swift-programming/uistoryboard-safer-with-enums-protocol-extensions-and-generics-7aad3883b44d) to make view controller instantiation super simple.

I'd be happy to answer any questions on Twitter: [@simmelj](https://twitter.com/simmelj). Or in the comments of the gist. If you have any other feedback on how one might improve the Coordinator protocol I'd be super happy, still very new to generics.
