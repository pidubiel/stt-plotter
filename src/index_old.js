var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    //console.log(reader.result.substring(0, 200));

    // break the textblock into an array of lines
    var lines = text.split('\n');
    // remove one line, starting at the first position
    lines.splice(0,14);
    // join the array back into a single string
    var newtext = lines.join('\n');
    var data = newtext.split('\n'); //first line of data [0]
    data = data.slice(0,-1); //removing blank line element

    let arrayOfData = [];

    //This function returns parsed line of data from data.txt
    function parseRecord(dataStringLine) {
      var record = {
        load: (Number(dataStringLine.split(" ")[0].replace(",","."))),
        stroke: (Number(dataStringLine.split(" ")[1].replace(",","."))),
        extension: (Number(dataStringLine.split(" ")[2].replace(",","."))),
        command: (Number(dataStringLine.split(" ")[3].replace(",","."))),
        time: (Number(dataStringLine.split(" ")[4].replace(",",".")))
      }
      return record
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfData.push(parseRecord(data[i]));
    }

    console.log(arrayOfData);

    let loadStroke = [];
    let loadExtension = [];

    for (let i = 0; i < arrayOfData.length; i++) {
      let record = {
        xVal: arrayOfData[i].stroke,
        yVal: arrayOfData[i].load
      }
      loadStroke.push(record);
    }

    for (let i = 0; i < arrayOfData.length; i++) {
      let record = {
        xVal: arrayOfData[i].extension,
        yVal: arrayOfData[i].load
      }
      loadExtension.push(record);
    }

    console.log(loadExtension);

    // for (let i = 0; i < arrayOfData; i++) {
    //   let record = {
    //     xVal: dataInput[i].stroke,
    //     yVal: dataInput[i].load
    //   }
    //   data.push(loadCommand);
    // }


    function drawPlot(dataInput) {
      var margin = {
        top: 30,
        right: 20,
        bottom: 30,
        left: 50
      };
      var width = 600 - margin.left - margin.right;
      var height = 270 - margin.top - margin.bottom;
      
      
      var x = d3.scale.linear().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);
      
      var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);
      
      var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);
      
      var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.xVal);
        })
        .y(function (d) {
            return y(d.yVal);
        });
      
      var svg = d3.select(".plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var data = dataInput;
 
      // Scale the range of the data
      x.domain(d3.extent(data, function (d) {
        return d.xVal;
      }));
      y.domain([0, d3.max(data, function (d) {
        return d.yVal;
      })]);
      
      svg.append("path") // Add the valueline path.
      .attr("d", valueline(data));
      
      svg.append("g") // Add the X Axis
      .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      
      svg.append("g") // Add the Y Axis
      .attr("class", "y axis")
        .call(yAxis);
    }

    drawPlot(loadStroke);
    drawPlot(loadExtension);

  };
  reader.readAsText(input.files[0]);
};




