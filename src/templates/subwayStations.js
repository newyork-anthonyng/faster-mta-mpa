function stationsTemplate(stations) {
  return stations.reduce((accumulated, current) => {
    const trainline = "trainline";
    // @TODO: Need trainline here
    return accumulated += `
    <li>
      <a href="/realtime/${trainline}/${current.id}">${current.name}</a>
    </li>
    `;
  }, "");
}

function subwayStations(data) {
  const result = data.reduce((accumulated, current) => {
    const borough = current.borough;

    return accumulated += `
    <button
      aria-controls="${borough}-panel"
      aria-selected="false"
      id="${borough}-tab"
      role="tab"
    >${borough}</button>
    <ul
      aria-labelledby="${borough}-tab"
      id="${borough}-panel"
      role="tabpanel"
    >
      ${stationsTemplate(current.stations)}
    </ul>
    `;
  }, "");

  return result;
}

module.exports = subwayStations;
