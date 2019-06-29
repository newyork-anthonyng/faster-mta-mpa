const SUBWAY_LINES = [
    { name: 1, color: "#d65345" },
    { name: 2, color: "#d65345" },
    { name: 3, color: "#d65345" },
    { name: 4, color: "#547e51" },
    { name: 5, color: "#547e51" },
    { name: 6, color: "#547e51" },
    { name: 7, color: "#974c90" },
    { name: "A", color: "#397ebf" },
    { name: "C", color: "#397ebf" },
    { name: "E", color: "#397ebf" },
    { name: "G", color: "#a4bf22" },
    { name: "B", color: "#e38f46" },
    { name: "D", color: "#e38f46" },
    { name: "F", color: "#e38f46" },
    { name: "M", color: "#e38f46" },
    { name: "J", color: "#9f632e" },
    { name: "Z", color: "#9f632e" },
    { name: "L", color: "#999999" },
    { name: "S", color: "#999999" },
    { name: "N", color: "#fbdb48" },
    { name: "R", color: "#fbdb48" },
    { name: "Q", color: "#fbdb48" }
];

const subwayLinesPartial = SUBWAY_LINES.reduce((accumulated, subway) => {
  return accumulated += `
  <li>
    <div style="width: 20px; height: 20px; display: inline-block; background-color: ${subway.color}"></div>
    <a href="/mta/subway/${subway.name}">${subway.name}</a>
  </li>
  `;
}, "");

module.exports = `<ul>${subwayLinesPartial}</ul>`;
