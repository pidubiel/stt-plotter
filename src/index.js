import drawPlot from './drawPlot';
import splitText from './splitText';
import parseRecord from './parseRecord'
import parseLoad from './parseLoad'
//import cutData from './cutData'

//NUMBER SPINNER-----------------------------------------------------------------------------
var numberSpinner = (function() {
  $('.number-spinner>.ns-btn>a').click(function() {
    var btn = $(this),
      oldValue = btn.closest('.number-spinner').find('input').val().trim(),
      newVal = 0;

    if (btn.attr('data-dir') === 'up') {
      newVal = parseInt(oldValue) + 1;
    } else {
      if (oldValue > 1) {
        newVal = parseInt(oldValue) - 1;
      } else {
        newVal = 1;
      }
    }
    btn.closest('.number-spinner').find('input').val(newVal);
  });
  $('.number-spinner>input').keypress(function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  });
})();
//------------------------------------------------------------------------------------------

const fileInput = document.querySelector('input[type="file"]');



let arrayOfData = [];
let arrayOfDataLS = []; //load - stroke
let arrayOfDataLE = []; //load - extension

const cutData_beginLS = document.querySelector('.cut-data-beginLS');
const cutData_endLS = document.querySelector('.cut-data-endLS');
const cutData_beginLE = document.querySelector('.cut-data-beginLE');
const cutData_endLE = document.querySelector('.cut-data-endLE');

const cutAmountLS = document.querySelector('#cutLS');
const cutAmountLE = document.querySelector('#cutLE');

const resetLS = document.querySelector('.resetLS');
const resetLE = document.querySelector('.resetLE');

//const reset = document.querySelector('.reset');
const graph = document.querySelectorAll('.plot');

function cutData(plotName, position, amount) {
  if(plotName == 'ls' && position == 'begin') {
    arrayOfDataLS = arrayOfDataLS.slice(amount, arrayOfDataLS.length);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');
    console.log(arrayOfDataLS.length);
  } else if(plotName == 'ls' && position == 'end') {
    arrayOfDataLS = arrayOfDataLS.slice(0, arrayOfDataLS.length - amount);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');
  } else if(plotName == 'le' && position == 'begin') {
    arrayOfDataLE = arrayOfDataLE.slice(amount, arrayOfDataLE.length);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');
  } else if(plotName == 'le' && position == 'end') {
    arrayOfDataLE = arrayOfDataLE.slice(0, arrayOfDataLE.length - amount);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');
    console.log('LE End:', arrayOfDataLE.length);
    console.log(arrayOfDataLE[arrayOfDataLE.length-1]);
  }
}

fileInput.addEventListener('change', function(e) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){

    var text = reader.result; //String from input file
    const data = splitText(text);

    const arrayOfDataLS_raw = arrayOfDataLS;
    const arrayOfDataLE_raw = arrayOfDataLE;

    for (let i = 0; i < data.length; i++) {
      arrayOfData.push(parseRecord(data[i]));
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfDataLS.push(parseLoad(arrayOfData[i], 'stroke'));
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfDataLE.push(parseLoad(arrayOfData[i], 'extension'));
    }

    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');

    cutData_beginLS.addEventListener('click', () => {
      cutData('ls', 'begin', cutAmountLS.value);
    });
    
    cutData_endLS.addEventListener('click', () => {
      cutData('ls', 'end', cutAmountLS.value);
    });

    cutData_beginLE.addEventListener('click', () => {
      cutData('le', 'begin', cutAmountLE.value)
    });
    
    cutData_endLE.addEventListener('click', () => {
      cutData('le', 'end', cutAmountLE.value)
    });

    // reset.addEventListener('click', () => {
    //   graph[0].innerHTML = '';
    //   graph[1].innerHTML = '';
    //   drawPlot(arrayOfDataLS_raw, 'Load-Stroke');
    //   drawPlot(arrayOfDataLE_raw, 'Load-Extension');
    //   arrayOfDataLS = arrayOfDataLS_raw;
    //   arrayOfDataLE = arrayOfDataLE_raw;
    // })

    resetLS.addEventListener('click', () => {
      graph[0].innerHTML = '';
      drawPlot(arrayOfDataLS_raw, 'Load-Stroke');
      arrayOfDataLS = arrayOfDataLS_raw;
    });

    resetLE.addEventListener('click', () => {
      graph[1].innerHTML = '';
      drawPlot(arrayOfDataLE_raw, 'Load-Extension');
      arrayOfDataLE = arrayOfDataLE_raw;
    });

    function download(text, filename){
      var blob = new Blob([text], {type: "text/plain"});
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    }
    
    download("this is the file", "text.txt");

    document.querySelector('.exportLE_data').addEventListener('click', () => {
      console.log('Dane LE: ', arrayOfDataLE);
    })

  }
  reader.readAsText(input.files[0]);
}, false);




