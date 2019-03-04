import drawPlot from './drawPlot';
import splitText from './splitText';

const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', function(e) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){

    var text = reader.result; //String from input file
    const data = splitText(text);

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
    let arrayOfDataLS = []; //load - stroke
    let arrayOfDataLE = []; //load - extension

    const arrayOfDataLS_raw = arrayOfDataLS;
    const arrayOfDataLE_raw = arrayOfDataLE;

    function parseStrokeLoad(dataObject) {
      let coordinates = [];
      coordinates.push(dataObject.stroke);
      coordinates.push(dataObject.load);
      return coordinates
    }

    function parseExtensionLoad(dataObject) {
      let coordinates = [];
      coordinates.push(dataObject.extension);
      coordinates.push(dataObject.load)
      return coordinates
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfData.push(parseRecord(data[i]));
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfDataLS.push(parseStrokeLoad(arrayOfData[i]));
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfDataLE.push(parseExtensionLoad(arrayOfData[i]));
    }
    console.log(arrayOfDataLE);
    let xScale_domain;

    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');


    const cut_data_beginLS = document.querySelector('.cut-data-beginLS');
    const cut_data_endLS = document.querySelector('.cut-data-endLS');

    const cut_data_beginLE = document.querySelector('.cut-data-beginLE');
    const cut_data_endLE = document.querySelector('.cut-data-endLE');

    const reset = document.querySelector('.reset');
    const graph = document.querySelectorAll('.plot');
    console.log(graph);

    console.log(arrayOfDataLE, 'LE');
    console.log(arrayOfDataLS, 'LS');

    function cut_data(plotName, position) {
      if(plotName == 'ls' && position == 'begin') {
        arrayOfDataLS = arrayOfDataLS.slice(10, arrayOfDataLS.length);
        graph[0].innerHTML = '';
        graph[1].innerHTML = '';
        graph.innerHTML = '';
        drawPlot(arrayOfDataLS, 'Load-Stroke', xScale_domain);
        drawPlot(arrayOfDataLE, 'Load-Extension');
      } else if(plotName == 'ls' && position == 'end') {
        arrayOfDataLS = arrayOfDataLS.slice(0, arrayOfDataLS.length - 10);
        graph[0].innerHTML = '';
        graph[1].innerHTML = '';
        graph.innerHTML = '';
        drawPlot(arrayOfDataLS, 'Load-Stroke');
        drawPlot(arrayOfDataLE, 'Load-Extension');
      } else if(plotName == 'le' && position == 'begin') {
        arrayOfDataLE = arrayOfDataLE.slice(10, arrayOfDataLE.length);
        graph[0].innerHTML = '';
        graph[1].innerHTML = '';
        graph.innerHTML = '';
        drawPlot(arrayOfDataLS, 'Load-Stroke');
        drawPlot(arrayOfDataLE, 'Load-Extension');
      } else if(plotName == 'le' && position == 'end') {
        arrayOfDataLE = arrayOfDataLE.slice(0, arrayOfDataLE.length - 10);
        graph[0].innerHTML = '';
        graph[1].innerHTML = '';
        graph.innerHTML = '';
        drawPlot(arrayOfDataLS, 'Load-Stroke');
        drawPlot(arrayOfDataLE, 'Load-Extension');
      }
    }

    // cut_data_begin.addEventListener('click', () => {
    //   arrayOfDataLS = arrayOfDataLS.slice(10, arrayOfDataLS.length);
    //   graph.innerHTML = '';
    //   drawPlot(arrayOfDataLS, 'Load-Stroke');
    //   drawPlot(arrayOfDataLE, 'Load-Extension');
    // })

    cut_data_beginLS.addEventListener('click', () => cut_data('ls', 'begin'));
    cut_data_endLS.addEventListener('click', () => cut_data('ls', 'end'));

    cut_data_beginLE.addEventListener('click', () => cut_data('le', 'begin'));
    cut_data_endLE.addEventListener('click', () => cut_data('le', 'end'));

    reset.addEventListener('click', () => {
      graph[0].innerHTML = '';
      graph[1].innerHTML = '';
      drawPlot(arrayOfDataLS_raw, 'Load-Stroke');
      drawPlot(arrayOfDataLE_raw, 'Load-Extension');
      arrayOfDataLS = arrayOfDataLS_raw;
      arrayOfDataLE = arrayOfDataLE_raw;
    })

  }
  reader.readAsText(input.files[0]);
}, false);

// var openFile = function(event) {

// };


