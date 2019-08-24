function titleCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function renderTabList(data) {
  return `
    <div role="tablist" class="tab--list">
      ${data.map((current, index) => {
        const borough = current.borough;

        return `
          <button
            aria-controls="${borough}-panel"
            aria-selected="${index === 0 ? "true" : "false"}"
            class="tab--button"
            id="${borough}-tab"
            role="tab"
            data-index="${index}"
          >${titleCase(borough)}</button>
        `;
      }).join("")}
    </div>
  `;
}

function renderTabPanels(data) {
  return data.reduce((accumulated, current, index) => {
    const borough = current.borough;

    return accumulated += `
      <ul
        aria-labelledby="${borough}-tab"
        id="${borough}-panel"
        role="tabpanel"
        class="tab--panel"
        ${index === 0 ? "" : "hidden"}
      >
        ${stationsTemplate(current.stations, data.subwayLine)}
      </ul>
    `;
  }, "");
}

function stationsTemplate(stations, subwayLine) {
  return stations.reduce((accumulated, current) => {
    return accumulated += `
    <li class="station__list-item">
      <a class="js-station-link station__link" href="/mta/subway/${subwayLine}/realTime/${current.id}">${current.name}</a>
    </li>
    `;
  }, "");
}

function subwayStations(data) {
  const tabList = renderTabList(data);
  const tabPanels = renderTabPanels(data);

  return `${tabList}${tabPanels}`;
}

module.exports = subwayStations;
