function lastUpdatedTemplate(lastUpdatedOn) {
    const date = new Date(+`${lastUpdatedOn}000`);

    return `<p>Subway time retrieved on ${date.toLocaleTimeString()}`;
}

function directionTemplate(direction) {
    if (direction.name === "") return "";

    return `
    <table>
        <caption>${direction.name}</caption>
        <tr>
            <th>Subway line</th>
            <th>Minutes away</th>
            <th>Destination</th>
        </tr>
        ${direction.times.map(subway => {
            return `<tr>
                <td>${subway.route}</td>
                <td>${subway.minutes}</td>
                <td>${subway.lastStation}</td>
            </tr>`;
        }).join("")}
    </table>
    `;
}

function realTime(data) {
    const { direction1, direction2, lastUpdatedOn, stationName } = data;

    return `
        <h1>${stationName}</h1>
        ${lastUpdatedTemplate(lastUpdatedOn)}
        ${directionTemplate(direction1)}
        ${directionTemplate(direction2)}
    `;
}

module.exports = realTime;