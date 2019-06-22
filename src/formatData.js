export function formatSubwayLineData(data) {
  let parsedBody = [];
  try {
    parsedBody = JSON.parse(data);
  } catch(e) {
    console.error("Error parsing subway line data");
    console.error(response);
    console.error(e);
  }

  return parsedBody;
}