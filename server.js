const express = require("express");
const app = express();

const headPartial = require("./src/partials/head.html");
const footPartial = require("./src/partials/foot.html");
const subwayLinesPartial = require("./src/partials/subwayLines.js");
const subwayMapPartial = require("./src/partials/subwayMap.html");
const {
  subwayStations,
  realTime
} = require("./src/templates/index.js");
const urls = require("./src/urls");
const formatData = require("./src/formatData");
const https = require("https");
const axios = require("axios");
const LRU = require("lru-cache");
const routes = require("./src/routes");
const path = require("path");

if (!PRODUCTION) {
  require("./src/setUpWebpackDevMiddleware")(app);
}

app.use("/", express.static(path.resolve(__dirname)));
app.use("/static", express.static(path.resolve(__dirname, "static")));

app.get(routes.get("index"), (req, res) => {
  res.write(headPartial);
  res.write(subwayLinesPartial);
  res.write(subwayMapPartial);
  res.write(footPartial);
  res.end();
});

app.get(routes.get("partials"), (req, res) => {
  const fileName = req.params.fileName;

  switch (fileName) {
    case "subwayLines.html":
      res.send(subwayLinesPartial);
      break;
    default:
      res.sendFile(path.resolve(__dirname, `../src/partials/${fileName}`));
      break;
  }
});

const apiCache = new LRU({
    max: 100,
    maxAge: 1000 * 60 * 5, // 5 minutes.
});
const apiClient = axios.create({
    baseURL: '',
    timeout: 10000,
});
const httpsAgent = new https.Agent({
  keepAlive: true
});
async function getSubwayLine(line) {
  const url = urls.subwayLine(line);
  const cachedResponse = apiCache.get(url);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await apiClient.request({
    httpsAgent,
    url
  });
  const parsedBody = formatData.formatSubwayLineData(networkResponse.data);
  if (parsedBody.length > 0) {
    apiCache.set(url, parsedBody);
  }

  return parsedBody;
}

async function getSubwayStation(line, station) {
  const url = urls.realTime(line, station);
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
  try {
    const data = await getSubwayLine(subwayLine);
    data.subwayLine = subwayLine;
    res.write(subwayStations(data));
    res.write(`<script src="./main.js"></script>`);
    res.write(footPartial);
  } catch(e) {
    console.error("Error getting subway line information");
    console.error(e);
    res.write("<p>Error fetching information</p>");
  }

  res.end();
});

app.get(routes.get("realTime"), async (req, res) => {
  const { subwayLine, subwayStation } = req.params;

  res.write(headPartial);
  res.write(`<h2>Real time info for ${subwayLine}</h2>`);

  try {
    const data = await getSubwayStation(subwayLine, subwayStation);
    res.write(realTime(data));
    res.write(footPartial);
  } catch(e) {
    console.error("Error getting realTime information");
    console.error(e);
    res.write("<p>Error fetching information</p>");
  }

  res.end();
});

const listener = app.listen(process.env.HOST || 3000, () => {
  console.log(`Server listening on ${listener.address().port}`);
});

module.exports = app;
