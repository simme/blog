---
title: "Plantry 3.4: Search"
date: 2019-10-02T08:25:44+02:00
---

After a brief holiday in 3.3, Search is now back in Plantry and it's better than ever. Built using SQLite's FTS4 it enables
our users to filter recipes based on ingredients, their name and so on. This is something we've been wanting
to do a long time, feels great to finally ship.

Many thanks to [Gwendal Roué](https://www.twitter.com/groue) for his amazing work on [GRDB.swift](https://github.com/groue/GRDB.swift)
and the quick responses to [issues](https://github.com/groue/GRDB.swift/issues/620).

I also finally had a use for the quintessential reactive programming example: debouncing search queries!

If you want to try it out you can find Plantry on the [App Store](https://itunes.apple.com/us/app/meal-plan-recipes/id1109976916?mt=8&at=1010lLu7)
or read more on the [Plantry Website](https://www.plantry.app).
