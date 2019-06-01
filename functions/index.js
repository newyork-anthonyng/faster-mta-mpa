const functions = require("firebase-functions");
// server.js compiled by webpack
const app = require("./server.js");

console.log("app", app);
exports.mta = functions.https.onRequest(app);
