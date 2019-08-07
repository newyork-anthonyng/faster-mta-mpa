import routeMatchers from "./routeMatchers";
import partials from "./partials/index";
import * as templates from "./templates/index.js";
const urls = {
    subwayLine: (line) => {
        return `/mta/api/subway/${line}`;
    },
    realTime: (line, station) => {
        return `/mta/api/realtime/${line}/${station}`;
    }
};

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    "partials/head.html",
    "partials/recentlyViewed.html",
    "partials/subwayLines.html",
    "partials/subwayMap.html",
    "partials/foot.html",
    "main.js",
    "home.js",
    "static/subway_map.pdf"
]);
workbox.precaching.cleanupOutdatedCaches();

const cacheStrategy = new workbox.strategies.CacheFirst({
    cacheName: workbox.core.cacheNames.precache
});

const apiStrategy = new workbox.strategies.NetworkFirst();

workbox.routing.registerRoute(
    routeMatchers.get("index"),
    workbox.streams.strategy([
        () => cacheStrategy.makeRequest({ request: partials.head() }),
        () => cacheStrategy.makeRequest({ request: partials.recentlyViewed() }),
        () => cacheStrategy.makeRequest({ request: partials.subwayLines() }),
        () => `<script src="/mta/home.js"></script>`,
        () => cacheStrategy.makeRequest({ request: partials.subwayMap() }),
        () => cacheStrategy.makeRequest({ request: partials.foot() })
    ])
);

function getUrlInformation(url) {
    const splitUrl = url.pathname.split("/");
    const subwayLine = splitUrl[3];
    const subwayStation = splitUrl[5];

    return {
        subwayLine,
        subwayStation
    }
}

// handle the "subway" line route
workbox.routing.registerRoute(
    routeMatchers.get("subway"),
    workbox.streams.strategy([
        () => cacheStrategy.makeRequest({ request: partials.head() }),
        ({ url }) => {
            const { subwayLine } = getUrlInformation(url);

            return `<h2>${subwayLine}</h2>`;
        },
        async ({ event, url }) => {
            const { subwayLine } = getUrlInformation(url);

            const response = await cacheStrategy.makeRequest({
                event,
                request: urls.subwayLine(subwayLine)
            });
            const data = await response.json();
            data.subwayLine = subwayLine;

            const template = templates.subwayStations(data);
            return `${template}<script src="/mta/main.js"></script>`;
        },
        () => cacheStrategy.makeRequest({ request: partials.foot() })
    ])
)

// handle the "realtime" line route
workbox.routing.registerRoute(
    routeMatchers.get("realTime"),
    workbox.streams.strategy([
        () => cacheStrategy.makeRequest({ request: partials.head() }),
        ({ url }) => {
            const { subwayLine } = getUrlInformation(url);

            return `<h2>Real time info for ${subwayLine}</h2>`;
        },
        async ({ event, url }) => {
            const { subwayLine, subwayStation } = getUrlInformation(url);

            const response = await apiStrategy.makeRequest({
                event,
                request: urls.realTime(subwayLine, subwayStation)
            });
            const data = await response.json();
            return templates.realTime(data);
        },
        () => cacheStrategy.makeRequest({ request: partials.foot() })
    ])
)

workbox.core.skipWaiting();
workbox.core.clientsClaim();