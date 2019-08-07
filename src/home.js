import { getRecentlyViewedStations } from "./recentlyViewed";

const $container = document.querySelector(".js-recently-viewed");
const stations = getRecentlyViewedStations();
if (stations) {
    const $html = stations.map(station => {
        return `<li><a href="${station.hash}">${station.stationName}</a></li>`;
    });
    $container.innerHTML = `<ul>${$html.join("")}</ul>`;
}