'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "a7e49ab80f4a0c132517e084cd217286",
"splash/img/light-2x.png": "62927aa6c3a98bc471b822fa7624f749",
"splash/img/dark-4x.png": "f2ee65e05e67bee86d2bd90128f85134",
"splash/img/light-3x.png": "f18d6f9246ff77fc62997afbeb24db0e",
"splash/img/dark-3x.png": "f18d6f9246ff77fc62997afbeb24db0e",
"splash/img/light-4x.png": "f2ee65e05e67bee86d2bd90128f85134",
"splash/img/dark-2x.png": "62927aa6c3a98bc471b822fa7624f749",
"splash/img/dark-1x.png": "ae15e8eb2afb7d9cfecf982732867e31",
"splash/img/light-1x.png": "ae15e8eb2afb7d9cfecf982732867e31",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "5d7605b20f50e97984b1071a1525fd86",
"index.html": "9f21ac78908677f357a07e98d9dfefea",
"/": "9f21ac78908677f357a07e98d9dfefea",
"main.dart.js": "f3c336a9e3d9750f1ce572d9426f3942",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "fc8c8d61c6df0eafb2bdeabc4a6137fa",
"icons/Icon-192.png": "943184112ea8e99246cd42a4e173b34f",
"icons/Icon-maskable-192.png": "943184112ea8e99246cd42a4e173b34f",
"icons/Icon-maskable-512.png": "5c79525c69e0240e24abe07e1c4d8a88",
"icons/Icon-512.png": "5c79525c69e0240e24abe07e1c4d8a88",
"manifest.json": "377a54cc93e0b4c7f521be7c7ad8ddb8",
"assets/AssetManifest.json": "bbb69173b71c6d4947ef2234fbee508d",
"assets/NOTICES": "3aee1e056a9616795ea056c283d77cdf",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/AssetManifest.bin.json": "a919363ab0f07fc18334ed2afd43046f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "f1fb56a8e647afddd292662cf4ee7459",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a5d7457fda15b7622c14f432ba63039a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "4f2f58f63a3bfa9e83609d2ac42e7aec",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "fe5b932b2fc70260a636695d95dbea89",
"assets/fonts/MaterialIcons-Regular.otf": "449548e91ff29055615c5e71a005ea19",
"assets/assets/images/banner_2.jpeg": "2b30f5b346562e74610804ef2d122559",
"assets/assets/images/banner_3.jpeg": "8f4a766e495fc31091720643272a0332",
"assets/assets/images/splash.png": "f0ecf5b601b1c99977082ec847b75dce",
"assets/assets/images/logo.jpg": "950c3cf270727d39dc169ffe5fc2aecf",
"assets/assets/images/banner_1.jpeg": "b45652d0361178b8645ebb78cc41a474",
"assets/assets/brands/facebook.svg": "03d81152cfd0aba50b7078d233a86016",
"assets/assets/brands/google.svg": "dfb46a0714c1ec6af8e36c747485dcde",
"assets/assets/brands/apple.svg": "efc4939d7e15c1c0e2ee5da25dcdba17",
"assets/assets/icons/app_icon.png": "757c96c0d81a1fa4d4be6c6e1923b04d",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
