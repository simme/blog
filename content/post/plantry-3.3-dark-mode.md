---
title: "Plantry Goes Dark Mode"
date: 2019-09-18T19:09:04+02:00
tags: ios13, dark mode, plantry
---

![Plantry plan view in light and dark mode](/images/2019/darkmode-plantry-plan.jpg)

When we first started work on Plantry it had another name and a different look. The rumors of an OLED iPhone were rampant at the time, it was too tempting to not make an app with a true black look.

After a while we came to the conclusion that maybe it was more appropriate for a cooking app, commonly used in a bright kitchen, to have a lighter and more friendly look. Plantry went white and got its new name.

With the advent of iOS 13 the power is now in the user's hands! With version 3.3 of Plantry dark mode is back. Available tomorrow, September 19th, when Apple pushes the button and releases iOS 13 to the masses.

![Plantry recipe view in light and dark mode](/images/2019/darkmode-plantry-recipe.jpg)

This was really fun to work on. I'd say 95% of the work was done in less then a day, but then followed intense polish and tweaks. We hope you like it!

[Max](https://www.twitter.com/maxrudberg) has a more detailed post on [Designing Plantry for Dark Mode in iOS 13](https://blog.maxrudberg.com/post/187798627463/designing-plantry-for-dark-mode-in-ios-13).

### New Search Tab

We've also redone the Search-tab. It makes full use of the new compositional layout APIs in iOS 13 to show off recipes in ways that hopefully makes it more fun to discover new favorites.

![Plantry recipe view in light and dark mode](/images/2019/darkmode-plantry-author.jpg)

As we decided to go iOS13 only we could also take full advantage of the new diffable data source APIs in iOS 13. The new Search tab has actually eschewed our CoreData backend (even though it got compliments at the CoreData lab at WWDC2019, not that I'm bragging) for a SQLite database managed through the _excellent_ [GRDB](https://github.com/groue/GRDB.swift).

In an update coming very soon we'll have full text search of recipes, including searching for ingredients! Something we've wanted to do for a long time. I usually try to avoid mentioning upcoming features that aren't completely baked. But since we had to cut search from this release I felt it was worth mentioning.

### Favorites

Favorites now have their own tab, allowing quick access to your favorite recipes.

![Plantry recipe view in light and dark mode](/images/2019/darkmode-plantry-favorites.jpg)

### Contextual Menus

I've always been a big fan of 3D Touch and Peek and Pop. With the new contextual menu APIs and their collection view integration in iOS 13 it was a no-brainer to also add some contextual menus. So now, anywhere in the Search tab, you can long-press a recipe to get a closer preview and directly add it to your favorites!

---

We'd love for you to give Plantry a try! You can read more about the app at [plantry.app](https://www.plantry.app) or head straight to the [App Store](https://apps.apple.com/us/app/plantry-meal-plans-recipes/id1109976916) for a free download.