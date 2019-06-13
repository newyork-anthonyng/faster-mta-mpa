const subwayLinesPartial = require("./subwayLines.js");

const headPartial = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>MTA - Real-time Subway</title>
    <meta name="Description" content="Get real time MTA subway times">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#223266">
  </head>
  <body>
    <h1><a href="/">MTA Subway Time</a></h1>
`;

const footPartial = `
</body>
</html>
`;

module.exports = {
  headPartial,
  footPartial,
  subwayLinesPartial
};
