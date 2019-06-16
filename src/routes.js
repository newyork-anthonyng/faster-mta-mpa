const routes = new Map([
    ["subway", "/subway/:subwayLine"],
    ["realTime", "/subway/:subwayLine/realTime/:subwayStation"],
    ["index", "/"]
]);

module.exports = routes;