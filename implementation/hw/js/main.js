/**
 * Loads buildings data, casts numeric variables, sort results
 * @returns {array} - sorted data
 */
async function loadCSVData() {
  const data = await d3
    .csv("data/buildings.csv", (row) => {
      row.height_m = parseFloat(row.height_m);
      row.height_ft = parseFloat(row.height_ft);
      row.height_px = parseFloat(row.height_px);
      row.floors = parseFloat(row.floors);
      row.completed = parseFloat(row.completed);
      return row;
    })
    .then((data) => {
      // sort data
      const sortedData = data.sort((a, b) => b.height_m - a.height_m);
      return sortedData;
    });

  return data;
}

/**
 * Creates bar chart with labels
 */
async function createVizualization() {
  const sortedData = await loadCSVData();
  const barHeight = 30;
  const barGap = barHeight + 20;
  const chartLeftmargin = 250;

  // create SVG element
  const svg = d3
    .select("#viz")
    .append("svg")
    .attr("height", "650px")
    .attr("width", "550px")
    .style("border-right", "1px solid black");

  // create bars
  const rectBars = svg
    .selectAll("rect")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("x", chartLeftmargin)
    .attr("y", (d, i) => 20 + barGap * i)
    .attr("height", barHeight)
    .attr("width", (d) => d.height_px)
    .attr("fill", "lightgrey");

  // building names labels
  const buildingLabels = svg
    .selectAll("text.building")
    .data(sortedData)
    .enter()
    .append("text")
    .classed("building", true)
    .text((d) => d.building)
    .attr(
      "transform",
      (d, i) => `translate(${chartLeftmargin - 10},${40 + barGap * i})`
    )
    .style("fill", "black")
    .style("text-anchor", "end")
    .on("click", showDetail);

  // building height labels
  const heightLabels = svg
    .selectAll("text.height-label")
    .data(sortedData)
    .enter()
    .append("text")
    .classed("height-label", true)
    .text((d) => d.height_m)
    .attr(
      "transform",
      (d, i) =>
        `translate(${chartLeftmargin - 5 + d.height_px}, ${40 + barGap * i})`
    )
    .style("text-anchor", "end");
}

/************************************/
/*  POPULATE HELPER FUNCTION  */
/**********************************/
function showDetail(event, datum) {
  console.log(datum);
  console.log(event);
  const { city, height_m, country, floors, completed, image } = datum;

  // update img path
  d3.select("#detail-img").attr("src", `img/${image}`);

  // update city
  d3.select("#detail-height").text(`${height_m}m`);

  // update city
  d3.select("#detail-city").text(`${city}`);

  // update country
  d3.select("#detail-country").text(`${country}`);

  // update floors
  d3.select("#detail-floors").text(`${floors}`);

  // update completed year
  d3.select("#detail-completed").text(`${completed}`);

  // update url path
}

createVizualization();
