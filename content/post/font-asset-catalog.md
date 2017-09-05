---
title: "Loading Fonts From an iOS Framework"
date: 2017-09-05T21:57:48+02:00
tags: iOS
---

I've spent the last couple of days moving all of the UI code in [Meal Plan](https://itunes.apple.com/us/app/meal-plan-healthy-cooking/id1109976916?ls=1&mt=8)
into a separate framework. Mainly to be able to develop my UI in Playgrounds.

Turns out though, that loading fonts from an Asset Catalog in a framework is.. impossible?

I could for my life not get it to work. What ever I tried I could not get the font data out of the asset catalog so that I could register the fonts. Which is why I ended up just moving the files out of the asset catalog in to the bundle itself, without the catalog "wrapper". I'm using this bit of code, that I found on Stack Overflow, to load and register the fonts:

```swift
extension UIFont {

    public class func loadAllFonts() {
        registerFontWithFilenameString("TisaMobiPro-Bold", bundleIdentifierString: bundleIdentifier)
        registerFontWithFilenameString("TisaMobiPro-BoldItalic", bundleIdentifierString: bundleIdentifier)
        registerFontWithFilenameString("TisaMobiPro-Italic", bundleIdentifierString: bundleIdentifier)
        registerFontWithFilenameString("TisaMobiPro", bundleIdentifierString: bundleIdentifier)
    }

    static func registerFontWithFilenameString(_ filenameString: String, bundleIdentifierString: String) {
        let frameworkBundle = Bundle(identifier: bundleIdentifierString)!
        if frameworkBundle.isLoaded { frameworkBundle.load() }
        let pathForResourceString = frameworkBundle.path(forResource: filenameString, ofType: "ttf")
        let fontData = NSData(contentsOfFile: pathForResourceString!)
        let dataProvider = CGDataProvider(data: fontData!)
        let fontRef = CGFont(dataProvider!)
        var errorRef: Unmanaged<CFError>? = nil

        if (CTFontManagerRegisterGraphicsFont(fontRef!, &errorRef) == false) {
            NSLog("Failed to register font - register graphics font failed - this font may have already been registered in the main bundle.")
        }
    }
}
```
