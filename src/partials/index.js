const subwayLinesPartial = require("./subwayLines.js");

const headPartial = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>MTA - Real-time Subway</title>
    <meta name="Description" content="Get real time MTA subway times">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#223266">
  </head>
  <body>
    <h1>MTA Subway Time</h1>
`;

const footPartial = `
<script>
  console.log("Foot partial loaded at", Date.now());
</script>
</body>
</html>
`;

module.exports = {
  headPartial,
  footPartial,
  subwayLinesPartial
};
