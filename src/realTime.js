import {
    saveRecentlyViewedStation as saveFavoriteStation,
    getRecentlyViewedStations as getFavoriteStation,
    removeFavoriteStation
} from "./recentlyViewed";

const $favorite = document.querySelector(".js-favorite-button");
const favoritedStations = getFavoriteStation() || [];
const currentPath = window.location.href;

let isFavorited = false;
if (favoritedStations.some(item => {
    return item.hash === currentPath;
})) {
    $favorite.classList.add("favorite--favorited");
    $favorite.textContent = `Favorited`;
    isFavorited = true;
}

const stationName = document.querySelector(".js-station-name").textContent;
$favorite.addEventListener("click", function() {
    if (isFavorited) {
        removeFavoriteStation(stationName, currentPath);
        $favorite.classList.remove("favorite--favorited");
        $favorite.textContent = `Favorite`;
    } else {
        saveFavoriteStation(stationName, currentPath);
        $favorite.classList.add("favorite--favorited");
        $favorite.textContent = `Favorited`;
    }

    isFavorited = !isFavorited;
});