function lastUpdatedTemplate(lastUpdatedOn) {
    const date = new Date(+`${lastUpdatedOn}000`);

    return `<p class="subway__time">Subway time retrieved on ${date.toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit"
    })}</p>`;
}

function directionTemplate(direction) {
    if (direction.name === "") return "";

    return `
    <table class="table">
        <caption class="table---caption">${direction.name}</caption>
        <tr class="table--head-row">
            <th class="table--head">Subway</th>
            <th class="table--head">Minutes away</th>
            <th class="table--head">Destination</th>
        </tr>
        ${direction.times.map(subway => {
            return `<tr class="table--body-row">
                <td class="table--info">${subway.route}</td>
                <td class="table--info">${subway.minutes}</td>
                <td class="table--info">${subway.lastStation}</td>
            </tr>`;
        }).join("")}
    </table>
    `;
}

function realTime(data) {
    const { direction1, direction2, lastUpdatedOn, stationName } = data;
    if (data.message && data.message.messageType === 'ERROR') {
        return `
            <h1 class="realtime__header">${stationName}</h1>
            ${lastUpdatedTemplate(lastUpdatedOn)}
            <p class="realtime__error">${data.message.message}</p>
        `;
    }

    return `
        <h1 class="realtime__header js-station-name">${stationName}</h1>
        ${lastUpdatedTemplate(lastUpdatedOn)}
        <button class="js-favorite-button favorites__button">Favorite</button>
        ${directionTemplate(direction1)}
        ${directionTemplate(direction2)}
    `;
}

module.exports = realTime;