const routes = new Map([
    ["partials", "/partials/:fileName"],
    ["subway", "/subway/:subwayLine"],
    ["realTime", "/subway/:subwayLine/realTime/:subwayStation"],
    ["index", "/"]
]);

module.exports = routes;