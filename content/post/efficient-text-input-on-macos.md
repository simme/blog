---
title: "Efficient Text Navigation on macOS"
date: 2020-04-25T18:10:14+02:00
---

A while back I noticed my wife using the trackpad on her MacBook Air to select text and felt this inner little nerd know-it-all poke my brain. And so the idea for this blog post was born.

I cannot remember when or how I learned these tricks. Probably as an accident when I was learning HTML as a ten year old, writing all caps tags.

Anyway, I've been thinking about jotting down these tips for a long time, so here we go. Most of these can be applied to all textfields in the entire OS, and most (all?) will also work on iOS with a hardware keyboard. Some apps might behave slightly differently, it's a great tell when an app is not using native AppKit components.

### Modifier Keys

We all know how to use our trusty arrow keys to move the cursor horizontally and vertically in a text view. But something not everybody knows is that you can hold down modifier keys while doing this to change what happens when you press an arrow key.

These are:

* <kbd>option</kbd>/<kbd>alt</kbd>/<kbd>⎇</kbd>, use to move a "word" when navigating sideways and a paragraph when moving vertically. When moving to the left the cursor stops at the _start_ of words (in a LTR language at least), and conversely moving to the right will stop at the end of a word. Different apps or contexts might treat a "word" differently.[^1]
* <kbd>command</kbd>/<kbd>cmd</kbd>/<kbd>⌘</kbd> to move to beginning or end of a line, or up/down to move to the start or end of a document.

_These commands are not really unique to text input. In Safari for example you can type <kbd>⌘↓</kbd> to move to the end of a page. Or <kbd>↑</kbd> to move to the top of the page._

Furthermore <kbd>control</kbd>/<kbd>ctrl</kbd> can be used to move between camelCasedWords. But as macOS comes with these key combinations hooked up to Spaces navigation by default they're not that useful. For coders it can be useful to disable those keyboard shortcuts. But for most other people they're not that useful from a text input perspective.

### Deleting Text

Now, these modifier keys can be used for more than moving around. They can also be used to delete text more efficiently. Instead of holding down that backspace for a couple of seconds to remove an entire line, try <kbd>⌘⌫</kbd> to delete it in one keystroke!

### Selecting Text

Taking things even further you can apply the <kbd>shift</kbd>/<kbd>⇧</kbd> modifier to _select_ text as you're navigating around. <kbd>⇧⌘←</kbd> will select everything from the cursor to the end of the line for example. Or <kbd>⎇←</kbd> selects from the cursor and back one word. You can combine these. As long as there's text selected you can extend or shrink the selection a word or line at a time. Letting go of all modifiers but <kbd>shift</kbd> let's you select just a character at a time.

### Conclusion

Using the text input modifiers can greatly increase your text input speed when typing text on your computer.

I'd suggest taking some time internalizing these tips to reduce the amount of times you reach for the mouse or trackpad to select text!

It can be very hard to retrain yourself if you've spent years writing on a computer and always reach for the mouse to select text or move around in a document. Perhaps this tweet by [Sam Soffes](https://www.twitter.com/soffes) is helpful:

<div class="twitter-widget-wrapper">
<blockquote class="twitter-tweet" data-conversation="none" data-theme="dark"><p lang="en" dir="ltr">I found this model really intuitive after a bit. Command for big moves, option for medium moves, control for small ones, and no notifier to nudge.<br><br>Once I could remember it, I used them all the time.</p>&mdash; Sam Soffes (@soffes) <a href="https://twitter.com/soffes/status/1252618652769124354?ref_src=twsrc%5Etfw">April 21, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Happy typing!

---

If you're still reading and found this article useful it'd mean a great deal to me if you wanted to check out the app I'm working on. It's called [Plantry](https://www.plantry.app/) and it'll help you cook better food at home! Thanks :)


[^1]: Xcode is frustratingly inconsistent in this and always moves way further than I think it should...
