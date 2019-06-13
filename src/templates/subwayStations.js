function stationsTemplate(stations, subwayLine) {
  return stations.reduce((accumulated, current) => {
    return accumulated += `
    <li>
      <a href="/subway/${subwayLine}/realTime/${current.id}">${current.name}</a>
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
      ${stationsTemplate(current.stations, data.subwayLine)}
    </ul>
    `;
  }, "");

  return result;
}

module.exports = subwayStations;
