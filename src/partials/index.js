const partials = {
    head: () => workbox.precaching.getCacheKeyForURL("partials/head.html"),
    subwayLines: () => workbox.precaching.getCacheKeyForURL("partials/subwayLines.html"),
    subwayMap: () => workbox.precaching.getCacheKeyForURL("partials/subwayMap.html"),
    foot: () => workbox.precaching.getCacheKeyForURL("partials/foot.html")
};

export default partials;