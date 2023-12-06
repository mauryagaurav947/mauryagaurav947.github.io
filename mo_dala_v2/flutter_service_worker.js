'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "034326fe95c1bccb5167151f028106e2",
"assets/AssetManifest.bin.json": "941f942a1c72183c2a5a0270482b990f",
"assets/AssetManifest.json": "f640d2fc1744bf2c7161870cde65ac8f",
"assets/assets/brands/apple.svg": "efc4939d7e15c1c0e2ee5da25dcdba17",
"assets/assets/brands/facebook.svg": "03d81152cfd0aba50b7078d233a86016",
"assets/assets/brands/google.svg": "dfb46a0714c1ec6af8e36c747485dcde",
"assets/assets/icons/app_icon.png": "73d66885fff2f2bcef24d226a3cf9e83",
"assets/assets/images/banner_1.jpeg": "b45652d0361178b8645ebb78cc41a474",
"assets/assets/images/banner_2.jpeg": "2b30f5b346562e74610804ef2d122559",
"assets/assets/images/banner_3.jpeg": "8f4a766e495fc31091720643272a0332",
"assets/assets/images/party_leader.jpg": "f45ec6c92822988d44770d8c375c67d3",
"assets/assets/images/person_1.png": "2f881290013aa4a7d76840447ea4425e",
"assets/assets/images/person_2.png": "38578f4fbf9e5b200113cbd21074f16f",
"assets/assets/images/person_3.png": "507dde412e6f002898366f235a6d8b6c",
"assets/assets/images/person_4.png": "b6750cc9b5d2cad5453a1c9bdcf8db7d",
"assets/assets/images/splash.jpg": "cf7986e9d7e4ca6e3754c4a3cec5b6b8",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "449548e91ff29055615c5e71a005ea19",
"assets/NOTICES": "6c0bff205360ca8a3ae98f10521330ae",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "4f2f58f63a3bfa9e83609d2ac42e7aec",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a5d7457fda15b7622c14f432ba63039a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "f1fb56a8e647afddd292662cf4ee7459",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "76d987e96b449f0f43a7b16fa02fc2a6",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "597ad5159025b87654544cd8f785eade",
"icons/Icon-512.png": "147cd433886d9eee0b9ac26f3220dbe5",
"icons/Icon-maskable-192.png": "597ad5159025b87654544cd8f785eade",
"icons/Icon-maskable-512.png": "147cd433886d9eee0b9ac26f3220dbe5",
"index.html": "cd00b3740b90b4238677cdef969e7995",
"/": "cd00b3740b90b4238677cdef969e7995",
"main.dart.js": "d400eed445569e4139548ed5a8896db5",
"manifest.json": "377a54cc93e0b4c7f521be7c7ad8ddb8",
"splash/img/dark-1x.png": "d217315f2dbe1ee815e57480e33d3197",
"splash/img/dark-2x.png": "fa87e7b555ff33f86d46e933997460e7",
"splash/img/dark-3x.png": "25cd4b80f757498a932a63a22034e164",
"splash/img/dark-4x.png": "a998c146a46235fd066bdc1c8b3cfff7",
"splash/img/light-1x.png": "d217315f2dbe1ee815e57480e33d3197",
"splash/img/light-2x.png": "fa87e7b555ff33f86d46e933997460e7",
"splash/img/light-3x.png": "25cd4b80f757498a932a63a22034e164",
"splash/img/light-4x.png": "a998c146a46235fd066bdc1c8b3cfff7",
"splash/splash.js": "d6c41ac4d1fdd6c1bbe210f325a84ad4",
"splash/style.css": "a1d5e8e8185d6ed7015cc8e1f179256a",
"version.json": "a7e49ab80f4a0c132517e084cd217286"};
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
