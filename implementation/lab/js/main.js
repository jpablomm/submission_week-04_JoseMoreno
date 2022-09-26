d3.csv("data/cities.csv", (row) => {
  row.population = parseFloat(row.population);
  row.x = parseFloat(row.x);
  row.y = parseFloat(row.y);
  row.eu = row.eu === "true" ? true : false;
  return row;
})
  .then((data) => {
    return data.filter((row) => row.eu);
  })
  .then((filteredData) => {
    console.log(filteredData);
    const euCitiesCount = filteredData.length;
    d3.select("#viz-chart")
      .append("p")
      .text(`The number of EU Countries: ${euCitiesCount}`);

    const svg = d3
      .select("#viz-chart")
      .append("svg")
      .attr("width", "700px")
      .attr("height", "550px")
      .style("border", "1px solid black");

    const circles = svg
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => (d.population <= 1000000 ? "4px" : "8px"))
      .style("fill", "red")
      .on("mouseover", showDetail)
      .on("mouseout", hideDetail);

    svg
      .selectAll("text")
      .data(filteredData)
      .enter()
      .append("text")
      .text((d) => d.city)
      .classed("city-label", true)
      .attr("transform", (d) => `translate(${d.x + 5},${d.y - 10})`)
      .style("opacity", (d) => (d.population >= 1000000 ? 1 : 0))
      .style("fill", "black");
  });

function showDetail(e, d) {
  const [leftPos, topPos] = d3.pointer(e);
  d3.select("#detail-title").text(`Country: ${d.country}`);
  d3.select("#detail-paragraph").text(`Population: ${d.population}`);
  d3.select("#detail")
    .style("left", `${leftPos}px`)
    .style("top", `${topPos}px`);
  d3.select("#detail").classed("hidden", false);
}

function hideDetail() {
  d3.select("#detail").classed("hidden", true);
}
