const express = require("express");
const app = express();

const headPartial = require("./src/partials/head.html");
const footPartial = require("./src/partials/foot.html");
const subwayLinesPartial = require("./src/partials/subwayLines.js");
const {
  subwayStations,
  realTime
} = require("./src/templates/index.js");
const https = require("https");
const axios = require("axios");
const LRU = require("lru-cache");
const routes = require("./src/routes");
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const path = require("path");
const compiler = webpack({
  mode: "development",
  entry: path.resolve(__dirname, "../src/app.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
});

app.use(
  middleware(compiler)
);

app.get(routes.get("index"), (req, res) => {
  res.write(headPartial);
  res.write(subwayLinesPartial);
  res.write(footPartial);
  res.end();
});

app.get(routes.get("partials"), (req, res) => {
  const fileName = req.params.fileName;

  switch (fileName) {
    case "head.html":
      res.send(headPartial);
      break;
    case "foot.html":
      res.send(footPartial);
      break;
    case "subwayLines.html":
      res.send(subwayLinesPartial);
      break;
    default:
      res.sendStatus(404);
      break;
  }
});

const apiCache = new LRU({
    max: 100,
    maxAge: 1000 * 60 * 5, // 5 minutes.
});
const SUBWAY_STATION_URL = "http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getStationsByLine";
const REALTIME_URL = "http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getTime";
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
  } catch(e) {
    console.error(`Error getting subway line information at ${url}`);
    console.error(e);
  }

  return parsedBody;
}

async function getSubwayStation(line, station) {
  const url = `${REALTIME_URL}/${line}/${station}`;
  const networkResponse = await apiClient.request({
    httpsAgent,
    url
  });

  const data = networkResponse.data;
  return data;
}

app.get(routes.get("subway"), async (req, res) => {
  const subwayLine = req.params.subwayLine;
  res.write(headPartial);
  res.write(`<h2>${subwayLine}</h2>`);
  const data = await getSubwayLine(subwayLine);
  data.subwayLine = subwayLine;
  res.write(subwayStations(data));
  res.write(`<script src="/main.js"></script>`);
  res.write(footPartial);
  res.end();
});

app.get(routes.get("realTime"), async (req, res) => {
  const { subwayLine, subwayStation } = req.params;

  res.write(headPartial);
  res.write(`<h2>Real time info for ${subwayLine}</h2>`);
  const data = await getSubwayStation(subwayLine, subwayStation);
  res.write(realTime(data));
  res.write(footPartial);
  res.end();
});

const listener = app.listen(process.env.HOST || 3000, () => {
  console.log(`Server listening on ${listener.address().port}`);
});

module.exports = app;
