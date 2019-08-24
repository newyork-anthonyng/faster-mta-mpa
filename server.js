const express = require("express");
const router = express.Router();
const app = express();

const headPartial = require("./src/partials/head.html");
const homeHeadPartial = require("./src/partials/homeHead.html");
const stationsHeadPartial = require("./src/partials/stationsHead.html");
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

const PROD_URL = PRODUCTION ? "" : "/mta"
app.use(`${PROD_URL}/`, express.static(path.resolve(__dirname)));
app.use(`${PROD_URL}/static`, express.static(path.resolve(__dirname, "static")));

router.get(routes.get("index"), (req, res) => {
  res.write(headPartial);
  res.write(homeHeadPartial);
  res.write(subwayLinesPartial);
  res.write(subwayMapPartial);
  res.write(`<script src="/mta/home.js"></script>`);
  res.write(footPartial);
  res.end();
});

router.get(routes.get("partials"), (req, res) => {
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

router.get(routes.get("subway"), async (req, res) => {
  const subwayLine = req.params.subwayLine;
  res.write(headPartial);
  res.write(stationsHeadPartial);
  res.write(`<h2 class="subwayName__header">${subwayLine}</h2>`);
  try {
    const data = await getSubwayLine(subwayLine);
    data.subwayLine = subwayLine;
    res.write(subwayStations(data));
    res.write(`<script src="/mta/main.js"></script>`);
    res.write(footPartial);
  } catch(e) {
    console.error("Error getting subway line information");
    console.error(e);
    res.write("<p>Error fetching information</p>");
  }

  res.end();
});

router.get(routes.get("realTime"), async (req, res) => {
  const { subwayLine, subwayStation } = req.params;

  res.write(headPartial);
  res.write(`
  <nav class="breadcrumbs">
    <ul class="breadcrumbs__list">
        <li class="breadcrumbs__list-item">
            <a class="breadcrumbs__link" href="/mta">Home</a>
            <span class="breadcrumbs__arrow">></span>
        </li>
        <li class="breadcrumbs__list-item">
            <a class="breadcrumbs__link" href="/mta/subway/${subwayLine}">${subwayLine}</a>
            <span class="breadcrumbs__arrow">></span>
        </li>
    </ul>
  </nav>
`);

  try {
    const data = await getSubwayStation(subwayLine, subwayStation);
    res.write(realTime(data));
    res.write(`<script src="/mta/realTime.js"></script>`);
    res.write(footPartial);
  } catch(e) {
    console.error("Error getting realTime information");
    console.error(e);
    res.write("<p>Error fetching information</p>");
  }

  res.end();
});

router.get("/api/subway/:subwayLine", async (req, res) => {
  const subwayLine = req.params.subwayLine;
  const data = await getSubwayLine(subwayLine);

  res.json(data);
});

router.get("/api/realtime/:subwayLine/:subwayStation", async (req, res) => {
  const subwayLine = req.params.subwayLine;
  const subwayStation = req.params.subwayStation;
  const data = await getSubwayStation(subwayLine, subwayStation);

  res.json(data);
});

if (!PRODUCTION) {
  app.use("/mta", router);
} else {
  // Firebase mounts our app on "/mta"
  app.use("/", router);
}

const listener = app.listen(process.env.HOST || 3000, () => {
  console.log(`Server listening on ${listener.address().port}`);
});

module.exports = app;
