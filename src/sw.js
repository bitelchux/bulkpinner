/* Bulk Pinner - Create multiple pins in your Pinterest boards at once
 * Copyright (C) 2017 Luke Denton
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const appCacheNames = [
    'bulk-pinner--short-term--007',
    'bulk-pinner--long-term--004'
];

const appCache = [
    {
        name: appCacheNames[0],
        files: [
            '/site/',
            'index.html',
            'css/styles.[stylesHash].css',
            'js/scripts.[scriptsHash].js'
        ]
    },
    {
        name: appCacheNames[1],
        files: [
            'img/icon.png',
            'img/icon.svg',
            'img/loader.svg',
            'img/favicons/favicon-32x32.png',
            'img/favicons/favicon-16x16.png',
            'vendor/error-capture.js',
            'https://fonts.gstatic.com/s/lora/v12/0QIvMX1D_JOuMwr7Iw.woff2',
            'https://fonts.gstatic.com/s/istokweb/v11/3qTvojGmgSyUukBzKslpBmt_.woff2',
            'https://assets.pinterest.com/sdk/sdk.js'
        ]
    }
];

self.addEventListener('install', e =>{
    // console.log('[ServiceWorker] Install');

    e.waitUntil(
        Promise.all(
            appCache.map((appCache) => {
                caches.open(appCache.name).then(cache => {
                    // console.log('[ServiceWorker] Caching app shell');
                    return cache.addAll(appCache.files);
                })
            })
        )
    );
});

self.addEventListener('activate', e => {
    // console.log('[ServiceWorker] Activate');

    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (!appCacheNames.includes(key)) {
                    // console.log('[ServiceWorker] Remove old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    // console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request).catch(() => {
                console.log('[ServiceWorker] Caught', e.request.url);
            });
        })
    );
});
