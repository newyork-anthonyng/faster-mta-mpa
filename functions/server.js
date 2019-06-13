module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\nconst app = express();\nconst {\n  headPartial,\n  footPartial,\n  subwayLinesPartial\n} = __webpack_require__(/*! ./src/partials/index.js */ \"./src/partials/index.js\");\nconst {\n  subwayStations,\n  realTime\n} = __webpack_require__(/*! ./src/templates/index.js */ \"./src/templates/index.js\");\nconst https = __webpack_require__(/*! https */ \"https\");\nconst axios = __webpack_require__(/*! axios */ \"axios\");\nconst LRU = __webpack_require__(/*! lru-cache */ \"lru-cache\");\n\nconst routes = new Map([\n  [\"subway\", \"/subway/:subwayLine\"],\n  [\"realTime\", \"/subway/:subwayLine/realTime/:subwayStation\"],\n  [\"index\", \"/\"]\n]);\n\napp.get(routes.get(\"index\"), (req, res) => {\n  res.write(headPartial);\n  res.write(subwayLinesPartial);\n  res.write(footPartial);\n  res.end();\n});\n\nconst apiCache = new LRU({\n    max: 100,\n    maxAge: 1000 * 60 * 5, // 5 minutes.\n});\nconst SUBWAY_STATION_URL = \"http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getStationsByLine\";\nconst REALTIME_URL = \"http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getTime\";\nconst apiClient = axios.create({\n    baseURL: '',\n    timeout: 10000,\n});\nconst httpsAgent = new https.Agent({\n  keepAlive: true\n});\nasync function getSubwayLine(line) {\n  const url = `${SUBWAY_STATION_URL}/${line}`;\n  const cachedResponse = apiCache.get(url);\n  if (cachedResponse) {\n    return cachedResponse;\n  }\n\n  const networkResponse = await apiClient.request({\n    httpsAgent,\n    url\n  });\n\n  const data = networkResponse.data;\n  let parsedBody = [];\n  try {\n    parsedBody = JSON.parse(data);\n    apiCache.set(url, parsedBody);\n  } catch(e) {\n    console.error(`Error getting subway line information at ${url}`);\n    console.error(e);\n  }\n\n  return parsedBody;\n}\n\nasync function getSubwayStation(line, station) {\n  const url = `${REALTIME_URL}/${line}/${station}`;\n  const networkResponse = await apiClient.request({\n    httpsAgent,\n    url\n  });\n\n  const data = networkResponse.data;\n  return data;\n}\n\napp.get(routes.get(\"subway\"), async (req, res) => {\n  const subwayLine = req.params.subwayLine;\n  res.write(headPartial);\n  res.write(`<h2>${subwayLine}</h2>`);\n  const data = await getSubwayLine(subwayLine);\n  data.subwayLine = subwayLine;\n  res.write(subwayStations(data));\n  res.write(footPartial);\n  res.end();\n});\n\napp.get(routes.get(\"realTime\"), async (req, res) => {\n  const { subwayLine, subwayStation } = req.params;\n\n  res.write(headPartial);\n  res.write(`<h2>Real time info for ${subwayLine}</h2>`);\n  const data = await getSubwayStation(subwayLine, subwayStation);\n  res.write(realTime(data));\n  res.write(footPartial);\n  res.end();\n});\n\nconst listener = app.listen(process.env.HOST || 3000, () => {\n  console.log(`Server listening on ${listener.address().port}`);\n});\n\nmodule.exports = app;\n\n\n//# sourceURL=webpack:///./server.js?");

/***/ }),

/***/ "./src/partials/index.js":
/*!*******************************!*\
  !*** ./src/partials/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const subwayLinesPartial = __webpack_require__(/*! ./subwayLines.js */ \"./src/partials/subwayLines.js\");\n\nconst headPartial = `\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>MTA - Real-time Subway</title>\n    <meta name=\"Description\" content=\"Get real time MTA subway times\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <meta name=\"theme-color\" content=\"#223266\">\n  </head>\n  <body>\n    <h1><a href=\"/\">MTA Subway Time</a></h1>\n`;\n\nconst footPartial = `\n</body>\n</html>\n`;\n\nmodule.exports = {\n  headPartial,\n  footPartial,\n  subwayLinesPartial\n};\n\n\n//# sourceURL=webpack:///./src/partials/index.js?");

/***/ }),

/***/ "./src/partials/subwayLines.js":
/*!*************************************!*\
  !*** ./src/partials/subwayLines.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const SUBWAY_LINES = [\n    { name: 1, color: \"#d65345\" },\n    { name: 2, color: \"#d65345\" },\n    { name: 3, color: \"#d65345\" },\n    { name: 4, color: \"#547e51\" },\n    { name: 5, color: \"#547e51\" },\n    { name: 6, color: \"#547e51\" },\n    { name: 7, color: \"#974c90\" },\n    { name: \"A\", color: \"#397ebf\" },\n    { name: \"C\", color: \"#397ebf\" },\n    { name: \"E\", color: \"#397ebf\" },\n    { name: \"G\", color: \"#a4bf22\" },\n    { name: \"B\", color: \"#e38f46\" },\n    { name: \"D\", color: \"#e38f46\" },\n    { name: \"F\", color: \"#e38f46\" },\n    { name: \"M\", color: \"#e38f46\" },\n    { name: \"J\", color: \"#9f632e\" },\n    { name: \"Z\", color: \"#9f632e\" },\n    { name: \"L\", color: \"#999999\" },\n    { name: \"S\", color: \"#999999\" },\n    { name: \"N\", color: \"#fbdb48\" },\n    { name: \"R\", color: \"#fbdb48\" },\n    { name: \"Q\", color: \"#fbdb48\" }\n];\n\nconst subwayLinesPartial = SUBWAY_LINES.reduce((accumulated, subway) => {\n  return accumulated += `\n  <li>\n    <div style=\"width: 20px; height: 20px; display: inline-block; background-color: ${subway.color}\"></div>\n    <a href=\"/subway/${subway.name}\">${subway.name}</a>\n  </li>\n  `;\n}, \"\");\n\nmodule.exports = subwayLinesPartial;\n\n\n//# sourceURL=webpack:///./src/partials/subwayLines.js?");

/***/ }),

/***/ "./src/templates/index.js":
/*!********************************!*\
  !*** ./src/templates/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const subwayStations = __webpack_require__(/*! ./subwayStations.js */ \"./src/templates/subwayStations.js\");\nconst realTime = __webpack_require__(/*! ./realTime.js */ \"./src/templates/realTime.js\");\n\nmodule.exports = {\n  subwayStations,\n  realTime\n};\n\n\n//# sourceURL=webpack:///./src/templates/index.js?");

/***/ }),

/***/ "./src/templates/realTime.js":
/*!***********************************!*\
  !*** ./src/templates/realTime.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function lastUpdatedTemplate(lastUpdatedOn) {\n    const date = new Date(+`${lastUpdatedOn}000`);\n\n    return `<p>Subway time retrieved on ${date.toLocaleTimeString()}`;\n}\n\nfunction directionTemplate(direction) {\n    if (direction.name === \"\") return \"\";\n\n    return `\n    <table>\n        <caption>${direction.name}</caption>\n        <tr>\n            <th>Subway line</th>\n            <th>Minutes away</th>\n            <th>Destination</th>\n        </tr>\n        ${direction.times.map(subway => {\n            return `<tr>\n                <td>${subway.route}</td>\n                <td>${subway.minutes}</td>\n                <td>${subway.lastStation}</td>\n            </tr>`;\n        }).join(\"\")}\n    </table>\n    `;\n}\n\nfunction realTime(data) {\n    const { direction1, direction2, lastUpdatedOn, stationName } = data;\n\n    return `\n        <h1>${stationName}</h1>\n        ${lastUpdatedTemplate(lastUpdatedOn)}\n        ${directionTemplate(direction1)}\n        ${directionTemplate(direction2)}\n    `;\n}\n\nmodule.exports = realTime;\n\n//# sourceURL=webpack:///./src/templates/realTime.js?");

/***/ }),

/***/ "./src/templates/subwayStations.js":
/*!*****************************************!*\
  !*** ./src/templates/subwayStations.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function stationsTemplate(stations, subwayLine) {\n  return stations.reduce((accumulated, current) => {\n    return accumulated += `\n    <li>\n      <a href=\"/subway/${subwayLine}/realTime/${current.id}\">${current.name}</a>\n    </li>\n    `;\n  }, \"\");\n}\n\nfunction subwayStations(data) {\n  const result = data.reduce((accumulated, current) => {\n    const borough = current.borough;\n\n    return accumulated += `\n    <button\n      aria-controls=\"${borough}-panel\"\n      aria-selected=\"false\"\n      id=\"${borough}-tab\"\n      role=\"tab\"\n    >${borough}</button>\n    <ul\n      aria-labelledby=\"${borough}-tab\"\n      id=\"${borough}-panel\"\n      role=\"tabpanel\"\n    >\n      ${stationsTemplate(current.stations, data.subwayLine)}\n    </ul>\n    `;\n  }, \"\");\n\n  return result;\n}\n\nmodule.exports = subwayStations;\n\n\n//# sourceURL=webpack:///./src/templates/subwayStations.js?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"https\");\n\n//# sourceURL=webpack:///external_%22https%22?");

/***/ }),

/***/ "lru-cache":
/*!****************************!*\
  !*** external "lru-cache" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lru-cache\");\n\n//# sourceURL=webpack:///external_%22lru-cache%22?");

/***/ })

/******/ });