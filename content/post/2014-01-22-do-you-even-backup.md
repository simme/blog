---
title: Do You Even Backup?
slug: do-you-even-backup
publishDate: 2014-01-22T12:30:24.000Z
date:   2014-01-22T12:44:27.000Z
tags: Computer Hygiene
---

Having a solid backup solution is really important to me since I have tons of code that I don't, but really should, push to GitHub or similar. I have thousands of photos that I really don't want to lose. Read on to see what makes me sleep at night!

## Clone It

I use [SuperDuper](http://www.shirt-pocket.com/SuperDuper/SuperDuperDescription.html) from _ShirtPocket_ to make a bootable backup of my MacBook Pro's harddrive. I have it connected to my monitor and SuperDuper is configured to automatically make a _smart copy_ (only backups new/changed files) everytime I connect the hardrive — ie. every time I connect my laptop to my monitor. And since the USB hub is _on_ my monitor that also means everytime I turn the monitor on (every morning).

Once the backup is complete SuperDuper ejects the drive and quits itself. I don't have to do anything.

The fantastic thing about a bootable backup is that should my MacBook's internal drive die I'll experience no downtime since I can just boot from my backup. I could even restore to a new drive while continuing to work.

And it the horrific case of a complete computer emergency I could even boot from the external drive connected to my girlfriends MacBook Air.

If you're wondering what drive I'm currently using it's a **WesternDigital Elements** 500Gb external USB drive. Requires no additional power supply and fits neatly on the stand of my monitor. Only annoying thing is the blue led light, which I covered with a piece of black tape.

## HFS+ and You

If you've listend to _any_ podcast featuring [John Siracusa](http://hypercritical.com/) you've undoubtedly [heard](http://atp.fm/episodes/40-the-compliance-shark) [him](http://www.imore.com/debug-24-jalkut-nielsen-siracusa-and-future-os-x) [whine](http://5by5.tv/hypercritical/56) about [HFS+](http://en.wikipedia.org/wiki/Hierarchical_File_System). The issue is that HFS+ is not awesome at maintaining and ensuring data integrity. It's easily corrupted etc. I won't talk about that here because I'm no expert. All you need to know is that I run **Disk Utility** (It's an app on your Mac) fairly regurlarly to repair and verify my disk. Because if you have errors in your computer's filesystem they will propagate to your SuperDuper clone and it won't matter that you have a backup.

It's not in anyway a gurantee that it'll keep your data safe. But at least you'll get an early warning when you start getting errors that can't be repaired.

## Always Have a Backup Backup

SuperDuper great and all. But I'm not naive enough to trust all my data to a tiny pocket drive. That's where [Backblaze](http://www.backblaze.com) comes in. Backblaze is an online backup service that stores all your stuff for $5 per month.

For one it's offsite so if my house burns down or theives break in I won't lose _that_ backup. They have strong encryption which is nice and lastly it's continious so it's not reliant on a disk being plugged in. Altough it requires an internet connection of course.

