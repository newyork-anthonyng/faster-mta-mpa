const express = require("express");
const app = express();
const {
  headPartial,
  footPartial,
  subwayLinesPartial
} = require("./src/partials/index.js");
const { subwayStations } = require("./src/templates/index.js");
const https = require("https");
const axios = require("axios");
const LRU = require("lru-cache");

const routes = new Map([
  ["subway", "/subway/:subwayLine"],
  ["index", "/"]
]);

app.get(routes.get("index"), (req, res) => {
  res.write(headPartial);
  res.write(subwayLinesPartial);
  res.write(footPartial);
  res.end();
});

const apiCache = new LRU({
    max: 100,
    maxAge: 1000 * 60 * 5, // 5 minutes.
});
const SUBWAY_STATION_URL = "http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getStationsByLine";
const apiClient = axios.create({
    baseURL: '',
    timeout: 10000,
});
const httpsAgent = new https.Agent({
  keepAlive: true
});
async function getSubwayLine(line) {
  const url = `${SUBWAY_STATION_URL}/${line}`;
  const cachedResponse = apiCache.get(url);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await apiClient.request({
    httpsAgent,
    url
  });

  const data = networkResponse.data;
  let parsedBody = [];
  try {
    parsedBody = JSON.parse(data);
    apiCache.set(url, parsedBody);
  } catch(e) {}

  return parsedBody;
}

app.get(routes.get("subway"), async (req, res) => {
  const subwayLine = req.params.subwayLine;
  res.write(headPartial);
  res.write(`<h2>${subwayLine}</h2>`);
  const data = await getSubwayLine(subwayLine);
  res.write(subwayStations(data));
  res.write(footPartial);
  res.end();
});

const listener = app.listen(process.env.HOST || 3000, () => {
  console.log(`Server listening on ${listener.address().port}`);
});

module.exports = app;
