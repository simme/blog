/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["404.html","f195c229457733fd4c61856261bdfe12"],["building-an-app-with-ampersand.js/index.html","f6b7f7080583c92104fb3d7d30fdade4"],["bye-bye-grunt-bye-bye-gulp.-hello-package.json./index.html","333b41617b49a265fec0f3c8fe9ec1c6"],["cleaning-up-your-git-repo/index.html","8261097b5ab1d1fa70c06f15f4cbabe0"],["css--complex-style-script/index.html","874fe8ab1c6537f209d15d106fc73ea9"],["css/master.css","7d40d4d9e5f8bb8db6b8c7e089c4b032"],["css/master.css.map","c027977ec3f7aa603147a9e55416c9b5"],["delegate-calls-wrapped-in-computed-properties/index.html","945f9736fccec68b2b6368fe4ce23e85"],["delegates-in-javascript/index.html","dcf096710129e5c8b46c00dd6ebaec6d"],["design-details/index.html","743f2570416555753092b7a2aeb64a5a"],["do-you-even-backup/index.html","88f6852f27ee780bc1746eb849d0b26a"],["feed.json","d427b86f32c4894979f487ae70aa00b0"],["getting-rid-of-typographic-orphans-with-swift/index.html","5f306c7c3b9d3b69ddd0f880c2f67e00"],["how-to-correctly-defer-loading-of-javascript/index.html","11d7d5138a61c20939136f7dff2098b6"],["index.html","6c5f7ccc65e1a84bf2b5a83a1a20a15c"],["index.jsonfeed.json","5ccb00bd9c803050d0a4e5ca2d5f8917"],["index.xml","0a34bce977d7f45bde42631dffa9eb51"],["ios-storyboard-tips--tricks/index.html","bb2f23fb7f1d935c98f54ea91560e4c7"],["jank-free/index.html","2002e7d96a0a0ad0a59dbcd9c7d725cc"],["jared-tries-a-watch/index.html","b1e0bf25256da4b801d33716a9769719"],["lazy-properties-in-swift/index.html","b5bb66d27963f6b04af60c02b4d63341"],["live-debugging-node.js-in-vim-update/index.html","877853ebaca8281f7dd9790fd13a08fa"],["live-debugging-node.js-in-vim/index.html","60be6a9b2d5a6d3d92b003a543c0be9e"],["mac-app-of-the-week/index.html","541e9f1e20fca68918446ac918393f54"],["minolta-autocord--servicing-the-focus-helicoid/index.html","f03016c379424473611183db10b315a8"],["more-than-a-coder/index.html","5fa0590cdbd2b68748e760ffa86a37b6"],["my-résumé-or-how-i-accidentally-built-a-static-site-generator/index.html","578cf7f9a4c5335a5a9913f4fd7ad8df"],["my-watch-and-i/index.html","8084112422f033b65677211771ce6175"],["nodes-require-and-browserify-take-2/index.html","b44b8fede086ba5e3c7eaa55d941f0f0"],["on-getting-things-done/index.html","6b6e6c0c6a042ca30be465f09192d640"],["page/1/index.html","6bbe291950cccc66565a35d53da471dc"],["page/2/index.html","689a6252adef7bc75fc25b1a15062e9b"],["page/3/index.html","d5c3aed8da6fc731f1db6fd10f6e9e77"],["page/4/index.html","8492b837227a1468880abb73adf6d6fc"],["post/index.html","00a827548b0df2bbab11344591200153"],["post/page/1/index.html","33b4e87e46f95d221c746242ab85d836"],["post/page/2/index.html","fea6bfb8dbbff1348dedb74957b06dff"],["post/page/3/index.html","95f0b3deed7fec04114a8c968d34626f"],["post/page/4/index.html","aba5298584889a4a9a105bfaa7d93f70"],["reactive-cocoa/index.html","8dd023ca6fd17e3a91defc050b48be44"],["set-your-npm-init-defaults/index.html","9eeedbd5d8562aa0749e93ae60a86f06"],["sitemap.xml","1d0040ef1edb1339db11e5eef42a4122"],["speaking-of-podcasts/index.html","d95e9772cc3e419e65503d095cb02767"],["swift-equatable-and-hashable/index.html","52bb0648b7772dca242e948b6fedf8bd"],["tags/apple-watch/index.html","3350c510f3beb6e31662e4ccbe21e9b5"],["tags/apple-watch/page/1/index.html","0c5892f2972634f796f824c2b9f99823"],["tags/apple/index.html","61f7cbc30e60b6690ffeb113c2294d6c"],["tags/apple/page/1/index.html","7f34ef59633586b8842e26ba6e4eef53"],["tags/apps/index.html","eb3c05e51f86920667ac9119e471858f"],["tags/apps/page/1/index.html","17406961dc45d7fbbe3585546d1fa288"],["tags/computer-hygiene/index.html","e1d0d14bb688152b49f1b9865e9cc8b0"],["tags/computer-hygiene/page/1/index.html","52bdbb6afc8c2a4e2cf802ab369731c4"],["tags/css/index.html","1a0e8fb2a6a921cb77bf6e97e461c5f2"],["tags/css/page/1/index.html","2a18f69ce6487ae3fb9dbbca0501e5bc"],["tags/film-photography/index.html","5063abfc6c65b4301b449ce189a0eb1d"],["tags/film-photography/page/1/index.html","ae7de4cb5f2169ecf6042ee560fd6ac3"],["tags/git/index.html","616ecd2fd6088f714cc5cfb26e3b9733"],["tags/git/page/1/index.html","557aa241d52ca06ce9b406ac0645c523"],["tags/gtd/index.html","fd5081fb4c08f456613188c2520d1b11"],["tags/gtd/page/1/index.html","59952bab817fd3658b86191d77ab6f7d"],["tags/ios/index.html","3e24245c69b320542b4624b227af404f"],["tags/ios/page/1/index.html","bfd5bab7efb1dc9e792b9e96a1a20935"],["tags/javascript/index.html","51620168e0bc150da584def905006a8e"],["tags/javascript/page/1/index.html","d3e137a0943e1d42a60259d244bdc237"],["tags/node.js/index.html","525703e0f2e38cb79bd65033619a0617"],["tags/node.js/page/1/index.html","54eff7f230ab5a4541eca4ce646fecc1"],["tags/podcasts/index.html","36fd1d6f7d398e92edfc1e8aa7890244"],["tags/podcasts/page/1/index.html","05ccb1bfed2098e02399257c0c0342ad"],["tags/ramblings/index.html","8ce6d32b7d213cca8ce4222bb35fd6bb"],["tags/ramblings/page/1/index.html","b36baf1717bd09e900fb689dd71a547a"],["tags/reading/index.html","99abfb8f8a185f5d9c92af69b00e85c7"],["tags/reading/page/1/index.html","5718186b30608c613fe07084455e1c81"],["tags/swift/index.html","6f94aaac20f2a07c4469d0a5cea52269"],["tags/swift/page/1/index.html","6c162ce1e3a539ff843a38919af6acf6"],["tags/web-development/index.html","aff4b15628b9a559a54c1da7566715f2"],["tags/web-development/page/1/index.html","2749dbb13349296a6aea124c3a22b9fc"],["tags/web/index.html","e2cf9ccbe5e71195c1927f700ccc0840"],["tags/web/page/1/index.html","c480cc7cbda26067a97b836f61e29859"],["tags/work/index.html","221259da364060f87c07cd31ca3bf8e9"],["tags/work/page/1/index.html","770db7eeb48ed662c6888bcb41a3211b"],["taking-advantage-of-nodes-require-algorithm-with-browserify/index.html","c1a540acb49c236ce9c629a4d1fcee1a"],["the-coordinator-pattern/index.html","cfb7e084e7995150afa4b0944967ffd2"],["the-obsolescence-of-the-apple-watch/index.html","cc6e152fb6c763f439f83d699ba5ec28"],["the-trello-css-guide/index.html","cd4724b5545fcb1025813d0013f384f3"],["the-wars-to-come/index.html","c4f7f095459f02b2f106e43958b0c583"],["the-zeiss-ikon-nettar-516/2/index.html","5062bfa13245c6faefe1fdb8ad2f0fa7"],["uistackview---uitextview-need-constraints-for-y-position-or-height/index.html","035f77de1926c6ade31813744e3cdaa9"],["uistackview-and-autolayout/index.html","6e78e25c9368bc42ec5157fff5b1a859"],["uistackview-left-align-without-stretching/index.html","138fea7e271621b801fcd87e20c469d1"],["using-localstorage-as-a-message-bus-between-windows/index.html","2e1654f4a80102d21c3fc97d852b0e4e"],["web-app-architecture-discussion/index.html","34e2437da7b514f0e558e288916fef46"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







