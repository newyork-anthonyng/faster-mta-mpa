const partials = {
    head: () => workbox.precaching.getCacheKeyForURL("partials/head.html"),
    homeHead: () => workbox.precaching.getCacheKeyForURL("partials/homeHead.html"),
    stationsHead: () => workbox.precaching.getCacheKeyForURL("partials/stationsHead.html"),
    subwayLines: () => workbox.precaching.getCacheKeyForURL("partials/subwayLines.html"),
    subwayMap: () => workbox.precaching.getCacheKeyForURL("partials/subwayMap.html"),
    foot: () => workbox.precaching.getCacheKeyForURL("partials/foot.html")
};

export default partials;