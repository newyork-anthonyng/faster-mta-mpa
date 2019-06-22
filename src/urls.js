const SUBWAY_STATION_URL = "http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getStationsByLine";
const REALTIME_URL = "http://traintimelb-367443097.us-east-1.elb.amazonaws.com/getTime";

export function subwayLine(line) {
    return `${SUBWAY_STATION_URL}/${line}`;
}

export function realTime(line, station) {
  return `${REALTIME_URL}/${line}/${station}`;
}
