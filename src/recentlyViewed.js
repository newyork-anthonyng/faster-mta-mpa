const LOCAL_STORAGE_KEY = `faster-mta-recently-viewed`;

function filterDuplicateStations(stationsList) {
    const duplicateChecker = [];

    return stationsList.filter(({ stationName }) => {
        if (duplicateChecker.indexOf(stationName) > -1) {
            return false;
        } else {
            duplicateChecker.push(stationName);
            return true;
        }
    });
}

function saveRecentlyViewedStation(stationName, hash) {
    let stationsList = [{ stationName, hash }];

    const original = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (original) {
        const _parsedOriginal = JSON.parse(original);
        stationsList = stationsList.concat(_parsedOriginal);
        stationsList = filterDuplicateStations(stationsList);
    }
    stationsList = stationsList.slice(0, 3);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stationsList));
}

function getRecentlyViewedStations() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
}

function removeFavoriteStation(stationName, hash) {
    const original = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (original) {
        const _parsedOriginal = JSON.parse(original);
        const index = _parsedOriginal.findIndex(favorite => {
            return favorite.stationName === stationName &&
                favorite.hash === hash;
        });
        if (index > -1) {
            const updatedFavoritesList = [
                ..._parsedOriginal.slice(0, index),
                ..._parsedOriginal.slice(index + 1)
            ];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedFavoritesList));
        }
    }
}

export {
    saveRecentlyViewedStation,
    getRecentlyViewedStations,
    removeFavoriteStation
}