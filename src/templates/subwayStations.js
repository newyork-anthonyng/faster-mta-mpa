function renderTabList(data) {
  return `
    <div role="tablist">
      ${data.map((current, index) => {
        const borough = current.borough;

        return `
          <button
            aria-controls="${borough}-panel"
            aria-selected="${index === 0 ? "true" : "false"}"
            id="${borough}-tab"
            role="tab"
            data-index="${index}"
          >${borough}</button>
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
    <li>
      <a class="js-station-link" href="/mta/subway/${subwayLine}/realTime/${current.id}">${current.name}</a>
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
