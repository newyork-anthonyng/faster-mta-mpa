const express = require("express");
const app = express();
const {
  headPartial,
  footPartial,
  subwayLinesPartial
} = require("./src/partials/index.js");

const routes = new Map([
  ["index", "/"]
]);

app.get(routes.get("index"), (req, res) => {
  res.write(headPartial);
  res.write(subwayLinesPartial);
  res.write(footPartial);
  res.end();
});

const listener = app.listen(process.env.HOST || 3000, () => {
  console.log(`Server listening on ${listener.address().port}`);
});

module.exports = app;
