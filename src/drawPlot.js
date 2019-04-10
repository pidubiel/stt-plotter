import * as d3 from "d3";

export default function drawPlot(data, name, xScale) {
  //document.querySelector('.container').append('p').textContent('Stroke Load')
  var margin = {top: 20, right: 20, bottom: 90, left: 50},
      margin2 = {top: 230, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom,
      height2 = 300 - margin2.top - margin2.bottom;

  // var margin = {top: 40, right: 40, bottom: 180, left: 100},
  // margin2 = {top: 560, right: 40, bottom: 60, left: 100},
  // width = 1200 - margin.left - margin.right,
  // height = 700 - margin.top - margin.bottom,
  // height2 = 700 - margin2.top - margin2.bottom;

  //add svg with margin !important
  //this is svg is actually group

  var svg = d3.select("#diagram_" + name).append("svg")
  .attr("width", width+margin.left+margin.right)
  .attr("height", height+margin.top+margin.bottom);

  if (name == 'Load-Stroke') {
    svg.append('text').attr('x', 160).attr('y', 15).text('Wykres Siły od Przemieszczenia (Load-Stroke)').attr('font-size', '15px').attr('fill', '#4677E8');
  } else {
    svg.append('text').attr('x', 160).attr('y', 15).text('Wykres Siły od Wydłużenia (Load-Extenstion)').attr('font-size', '15px').attr('fill', '#4677E8');
  }

  //svg.append('text').attr('x', 270).attr('y', 15).text(name).attr('font-size', '15px').attr('fill', 'orangered');

  var focus = svg.append("g")  //add group to leave margin for axis
      .attr("transform","translate("+margin.left+","+margin.top+")");
  var context = svg.append("g")
      .attr("transform","translate("+margin2.left+","+margin2.top+")");


  var dataset = data;
  //for each d, d[0] is the first num, d[1] is the second num
  //set y scale
  var yScale = d3.scaleLinear().range([0,height]).domain([d3.max(dataset,function(d){return d[1];})+0.02,d3.min(dataset,function(d){return d[1];})]);
  //add x axis
  var xScale = d3.scaleLinear().range([0,width]).domain([d3.min(dataset,function(d){return d[0];}),d3.max(dataset, function(d){return d[0];})]);//scaleBand is used for  bar chart
  var xScale2 = d3.scaleLinear().range([0,width]).domain([d3.min(dataset, function(d){return d[0];}),d3.max(dataset, function(d){return d[0];})]);
  var yScale2 = d3.scaleLinear().range([0,height2]).domain([d3.max(dataset,function(d){return d[1];}),d3.min(dataset, function(d){return d[1];})]);
  //sort x


  dataset.sort((a,b) => a[0]<b[0] ? -1 : 1);

  var line = d3.line()
      .x(function(d){return xScale(d[0]);})
      .y(function(d){return yScale(d[1]);})
      .curve(d3.curveBasis);//default is d3.curveLinear

  focus.append("path").attr("class","line").attr("d",line(dataset));

  var line2 = d3.line()
    .x(function(d){return xScale2(d[0]);})
    .y(function(d){return yScale2(d[1]);})
    .curve(d3.curveBasis);//default is d3.curveLinear
  context.append("path").attr("class","line").attr("d",line2(dataset));

  //add x and y axis
  var yAxis = d3.axisLeft(yScale).tickSize(-width);
  var yAxisGroup = focus.append("g").call(yAxis);


  var xAxis = d3.axisBottom(xScale).tickSize(-height);/*.tickFormat("");remove tick label*/
  var xAxisGroup = focus.append("g").call(xAxis).attr("transform", "translate(0,"+height+")");


  var xAxis2 = d3.axisBottom(xScale2);//no need to create grid
  var xAxisGroup2 = context.append("g").call(xAxis2).attr("transform","translate(0,"+height2+")")	



  //add zoom
  var zoom = d3.zoom()
      .scaleExtent([1,Infinity])// <1 means can resize smaller than  original size
      .translateExtent([[0,0],[width,height]])
      .extent([[0,0],[width,height]])//view point size
      .on("zoom",zoomed);
  svg.append("rect")
  .attr("class","zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

  //add brush
  //Brush must be added in a group
  var brush = d3.brushX()
      .extent([[0,0],[width,height2]])//(x0,y0)  (x1,y1)
      .on("brush end",brushed);//when mouse up, move the selection to the exact tick //start(mouse down), brush(mouse move), end(mouse up)

  context.append("g")
  .attr("class","brush")
  .call(brush)
  .call(brush.move,xScale2.range());


  function zoomed(){	
  /* focus.select(".line").attr("transform",d3.event.transform) will move the y position.
  Instead , you can use focus.select(".line").style("transform", "translate(" + d3.event.transform.x + "px," + 0 + "px) scale(" + d3.event.transform.k + ")");. But the width of line may be changed. Then the result will not be brush and zoom. Thus, it's better to use functions below*/

  /*
  Prerequisites
  range, domain, transform of zoom especially rescaleX.

  You should understand the visiual result of Brush + Zoom. Actually, Brush + Zoom will only move the position and extend the width of chart  along x axis visually.
  Then, the key is to change the x scale domain (input) when zoom occur. By this way, the char will be stretched or compress along x axis. If you cannot understand the meaning, please read details of range and domain of scale.

  How could we get the changing domain?
  Initially, we have two same x axis : xAxis and xAxis2. In the design, the xAxis2 is always unchanged while the xAxis can be changed by zoom or brush. We we can use d3.event.transform.rescaleX(xScale2).domain() to get the exact input of the location showing in the zooming aera and brush area. 

  Once we get the new input,
  In the zoomed function:
  1. For zooming area, we set the domain of zooming xScale to the new input. And recall the functions to add line and x axis 
  xScale.domain(d3.event.transform.rescaleX(xScale2).domain());
  focus.select(".line").attr("d",line(dataset));
  xAxisGroup.call(xAxis);//rescale x

  2. For Brush area, just get the output of this new input by xScale2
  context.select(".brush").call(brush.move, [x2(d3.event.transform.rescaleX(xScale2).domain()[0]),x2(d3.event.transform.rescaleX(xScale2).domain()[1])]);//easy to understand

  Or use api context.select(".brush").call(brush.move, xScale.range().map(d3.event.transform.invertX,d3.event.transform));
  */
  if(d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  xScale.domain(d3.event.transform.rescaleX(xScale2).domain());
  focus.select(".line").attr("d",line(dataset));
  xAxisGroup.call(xAxis);//rescale x
  console.log('xScale:', xScale);
  //brush area
  context.select(".brush").call(brush.move, [xScale2(d3.event.transform.rescaleX(xScale2).domain()[0]),xScale2(d3.event.transform.rescaleX(xScale2).domain()[1])]);
  //context.select(".brush").call(brush.move, [-58.313, -56]);
  }

  function brushed(){
  if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  /*1. For zooming, the same idea with zoomed function. Get the new input of xScale
  xScale.domain([xScale2.invert(d3.event.selection[0]),xScale2.invert(d3.event.selection[1])]);//easy to understand

  Or use api x.domain(d3.event.selection.map(xScale2.invert, xScale2));
  */
  //xScale.domain([-58.313, -56]);
  xScale.domain([xScale2.invert(d3.event.selection[0]),xScale2.invert(d3.event.selection[1])]);
  focus.select(".line").attr("d",line(dataset));
  xAxisGroup.call(xAxis);//rescale x
  }

  //add clip path to the svg
  svg.append("defs").append("clipPath").attr("id","clip")
  .append("rect").attr("width",width).attr("height",height);
  focus.select(".line").attr("clip-path","url(#clip)");
}