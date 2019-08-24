import { getRecentlyViewedStations } from "./recentlyViewed";

const $container = document.querySelector(".js-recently-viewed");
const stations = getRecentlyViewedStations();
if (stations) {
    const $html = stations.map(station => {
        return `<li class="favorites__list-item"><a class="favorites__link" href="${station.hash}">${station.stationName}</a></li>`;
    });
    $container.innerHTML = `<ul class="favorites__list">${$html.join("")}</ul>`;
}