function randomData(samples) {
  var data = [];

  for (i = 1; i < samples; i++) {
    data.push({
      x: i,
      y: d3.randomUniform(i, i+5)()
    });
  }

  data.sort(function(a, b) {
    return a.x - b.x;
  })
  return data;
}

var data = randomData(50);

var zoom = d3.zoom().on('zoom', zoomed);

/*********************** Plot Below *********************/
var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};
width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Linear Scales
var xScale = d3.scaleLinear()
  .range([0, width])
  .domain(d3.extent(data, function(d) {
    return d.x;
  })).nice();

var yScale = d3.scaleLinear()
  .range([height, 0])
  .domain(d3.extent(data, function(d) {
    return d.y;
  })).nice();

var xAxis = d3.axisBottom().scale(xScale).ticks(12),
  yAxis = d3.axisLeft().scale(yScale).ticks(12 * height / width);

var plotLine = d3.line()
  .curve(d3.curveMonotoneX)
  .x(function(d) {
    return xScale(d.x);
  })
  .y(function(d) {
    return yScale(d.y);
  });

var svg = d3.select("#plot").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
  
svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
  .call(xAxis);

svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("class", "y axis")
  .call(yAxis);
  
var line = svg.append("g").append("path")
				.attr("clip-path", "url(#clip)")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data([data])
        .attr("d", plotLine)
        .attr("stroke", "brown")
        .attr("stroke-width", "2")
        .attr("fill", "none");

svg.call(zoom);

/****************** Zoom Function ********************************/
function zoomed() {
        // Update Scales
        let new_yScale = d3.event.transform.rescaleY(yScale);
        let new_xScale = d3.event.transform.rescaleX(xScale);
        
        // re-scale axes and gridlines during zoom
        svg.select(".y.axis").transition()
            .duration(50)
            .call(yAxis.scale(new_yScale));

        svg.select(".x.axis").transition()
            .duration(50)
            .call(xAxis.scale(new_xScale));

        // re-draw line
        plotLine = d3.line()
          	.curve(d3.curveMonotoneX)
            .x(function (d) {
                return new_xScale(d.x);
            })
            .y(function (d) {
                return new_yScale(d.y);
            });

        line.attr("d", plotLine);
    }

/********************* Reset Function ****************************/
d3.select("#reset").on('click', resetted);

function resetted() {
  svg.transition()
  	.duration(750)
    .call(zoom.transform, d3.zoomIdentity);
}

/****************** Add Data Below *******************************/
d3.select("#update").on('click', update);

function update() {

    data = randomData(50);

    xScale.domain(d3.extent(data, function(d) {
      return d.x;
    })).nice();
    
    yScale.domain(d3.extent(data, function(d) {
      return d.y;
    })).nice();

    line.datum(data)
      .transition().duration(750)
      .attr("d", plotLine)
      .style("fill", "none")
      .style("stroke-width", "2px")
      .style("stroke", "brown");
  }
/****************** Update Scales Below **************************/

d3.select("#logScale").on("click", updateScale);
d3.select("#linearScale").on("click", updateScale);

function updateScale() {

	if(this.id === 'logScale') {
  	yScale = d3.scaleLog();
  } else {
  	yScale = d3.scaleLinear();
  }

	// Change to log scale  
	yScale.range([height, 0])
  .domain(d3.extent(data, function(d) {
  	return d.y;
  })).nice();
  
  let t = d3.zoomTransform( svg.node());
  let new_yScale = t.rescaleY(yScale); 
  let new_xScale = t.rescaleX(xScale);
  
 plotLine = d3.line()
      .curve(d3.curveMonotoneX)
      .x(function (d) {
          return new_xScale(d.x);
      })
      .y(function (d) {
          return new_yScale(d.y);
      });

  line.transition()
    .duration(1000)
    .attr("d", plotLine);

  yAxis.scale(new_yScale);

  svg.transition().duration(1000).select('.y.axis').call(yAxis);
};