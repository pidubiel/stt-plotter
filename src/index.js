import $ from "jquery";
import drawPlot from './drawPlot';
import splitText from './splitText';
import parseRecord from './parseRecord'
import exportData from './exportData'
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

let canceledOnce = false;

let arrayOfData = [];
let arrayOfData_raw = [];
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

//Amounts of cutted values
let cuttedLS_B = 0;
let cuttedLS_E = 0;
let cuttedLE_B = 0;
let cuttedLE_E = 0;

//const reset = document.querySelector('.reset');
const graph = document.querySelectorAll('.plot');

function cutData(plotName, position, amount) {
  if(plotName == 'ls' && position == 'begin') {
    arrayOfDataLS = arrayOfDataLS.slice(amount, arrayOfDataLS.length);
    for(let i = 0; i < cuttedLS_B ; i++) {
      arrayOfData[i].stroke = 0; 
    }
    //console.log(arrayOfData);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.3494177111703]);
    drawPlot(arrayOfDataLE, 'Load-Extension');
    //console.log(arrayOfDataLS.length);
  } else if(plotName == 'ls' && position == 'end') {
    for(let i = ((arrayOfData.length) - cuttedLS_E); i <= (arrayOfData.length - 1); i++) {
      arrayOfData[i].stroke = 0; 
    }
    arrayOfDataLS = arrayOfDataLS.slice(0, arrayOfDataLS.length - amount);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');
  } else if(plotName == 'le' && position == 'begin') {
    for(let i = 0; i < cuttedLE_B ; i++) {
      arrayOfData[i].extension = 0; 
    }
    arrayOfDataLE = arrayOfDataLE.slice(amount, arrayOfDataLE.length);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    //drawPlot(arrayOfDataLS, 'Load-Extension', [-0.049, -0.01264400659066603]);
    drawPlot(arrayOfDataLE, 'Load-Extension', [-0.049, 0]);
    //drawPlot(arrayOfDataLE, 'Load-Extension');
  } else if(plotName == 'le' && position == 'end') {
    for(let i = ((arrayOfData.length) - cuttedLE_E); i <= (arrayOfData.length - 1); i++) {
      arrayOfData[i].extension =  0; 
    }
    arrayOfDataLE = arrayOfDataLE.slice(0, arrayOfDataLE.length - amount);
    graph[0].innerHTML = '';
    graph[1].innerHTML = '';
    graph.innerHTML = '';
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');
    //console.log('LE End:', arrayOfDataLE.length);
    //console.log(arrayOfDataLE[arrayOfDataLE.length-1]);
  }
}

fileInput.addEventListener('change', function(e) {
  var input = event.target;

  document.querySelector('.loadFile_info').style.display = 'none';
  document.querySelector('.showFullPlot').style.display = 'inline-block';
  document.querySelector('.ls').style.display = 'block';
  document.querySelector('.le').style.display = 'block';
  document.querySelector('.btn__export').style.display = 'inline-block';
  document.querySelector('.scale-block').style.display = 'block';

  var reader = new FileReader();
  reader.onload = function(){

    //console.log('READER: ', reader);
    var text = reader.result; //String from input file
    const data = splitText(text)[0];
    const arrayOfDataLS_raw = [];
    const arrayOfDataLE_raw = [];

    for (let i = 0; i < data.length; i++) {
      arrayOfData.push(parseRecord(data[i]));
      arrayOfData_raw.push(parseRecord(data[i]));
    }

    for (let i = 0; i < data.length; i++) {
      arrayOfDataLS.push([arrayOfData[i].stroke, arrayOfData[i].load]);
      arrayOfDataLS_raw.push([arrayOfData[i].stroke, arrayOfData[i].load]);
    }
    //console.log('First check: ', arrayOfDataLE);
    for (let i = 0; i < data.length; i++) {
      arrayOfDataLE.push([arrayOfData[i].extension, arrayOfData[i].load]);
      arrayOfDataLE_raw.push([arrayOfData[i].extension, arrayOfData[i].load]);
    }
    //arrayOfDataLS.map(e => e.reverse());
    //arrayOfDataLE.map(e => e.reverse());
    //arrayOfDataLE.map((e,i) => e[2] = i);
    //arrayOfDataLE.sort();

    //console.log('ArrayOfData: ', arrayOfData);
    //console.log('ArrayOfDataLS: ', arrayOfDataLS);
    //console.log('ArrayOfDataLE: ', arrayOfDataLE);

    //drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.023796]);
    drawPlot(arrayOfDataLS, 'Load-Stroke');
    drawPlot(arrayOfDataLE, 'Load-Extension');

    cutData_beginLS.addEventListener('click', () => {
      cuttedLS_B += parseInt(cutAmountLS.value);
      cutData('ls', 'begin', cutAmountLS.value);
      console.log('Cutted LS_B: ', cuttedLS_B);
    });
    
    cutData_endLS.addEventListener('click', () => {
      cuttedLS_E += parseInt(cutAmountLS.value);
      cutData('ls', 'end', cutAmountLS.value);
      console.log('Cutted LS_E: ', cuttedLS_E);
    });

    cutData_beginLE.addEventListener('click', () => {
      cuttedLE_B += parseInt(cutAmountLE.value);
      cutData('le', 'begin', cutAmountLE.value);
      console.log('Cutted LE_B: ', cuttedLE_B);
    });
    
    cutData_endLE.addEventListener('click', () => {
      cuttedLE_E += parseInt(cutAmountLE.value);
      cutData('le', 'end', cutAmountLE.value);
      console.log('Cutted LE_E: ', cuttedLE_E);
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
      //TODO: Restore stroke values from arrayOfData
      for(let i = 0; i < arrayOfData.length; i++) {
        arrayOfData[i].stroke = arrayOfData_raw[i].stroke
      }
      cuttedLS_B = 0;
      cuttedLS_E = 0;
    });

    resetLE.addEventListener('click', () => {
      graph[1].innerHTML = '';
      drawPlot(arrayOfDataLE_raw, 'Load-Extension');
      arrayOfDataLE = arrayOfDataLE_raw;
      for(let i = 0; i < arrayOfData.length; i++) {
        arrayOfData[i].extension = arrayOfData_raw[i].extension
      }
      cuttedLE_B = 0;
      cuttedLE_E = 0;
    });

    //Showing full plot
    document.querySelector('.showFullPlot').addEventListener('click', () => {
      graph[0].innerHTML = '';
      graph[1].innerHTML = '';
      drawPlot(arrayOfDataLS, 'Load-Stroke');
      drawPlot(arrayOfDataLE, 'Load-Extension');
    });

    //Scale All listener
    document.querySelector('.acceptScale').addEventListener('click', () => {
        if(!canceledOnce) {
          //Get value of scale
          const scaleValue = parseFloat(document.getElementById('scale-value').value);
          //TODO: Modify arrayOfData: 
          arrayOfData.map(e => e.load = e.load + scaleValue * e.load);
          arrayOfData.map(e => e.extension = e.extension + scaleValue * e.extension);
          //console.log(arrayOfDataLS[0]);
          arrayOfDataLS.map(e => e[1] = e[1] + scaleValue * e[1]);
          arrayOfDataLE.map(e => e[1] = e[1] + scaleValue * e[1]);
          //const OO = arrayOfDataLS.forEach(e => console.log(e[1] + e[1]));
          //console.log(arrayOfDataLS);
          graph[0].innerHTML = '';
          graph[1].innerHTML = '';
          //drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.3494177111703])
          drawPlot(arrayOfDataLS, 'Load-Stroke');
          drawPlot(arrayOfDataLE, 'Load-Extension');
          canceledOnce = true;
        } else {
          alert('Jeśli chcesz zmienić wartość skali - ponownie wczytaj wykres.');
        }

    });

    //Cancel Scale Operation
    document.getElementById('cancelScale').addEventListener('click', () => {
      console.log('siema');
      graph[0].innerHTML = '';
      graph[1].innerHTML = '';
      arrayOfDataLS = arrayOfDataLS_raw;
      arrayOfDataLE = arrayOfDataLE_raw;
      //drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.3494177111703])
      drawPlot(arrayOfDataLS_raw, 'Load-Stroke');
      drawPlot(arrayOfDataLE_raw, 'Load-Extension');
    });

    //Export All Data to .txt file
    document.querySelector('.exportData').addEventListener('click', () => {

      let lines = ['Load      Stroke      Extension     Command     Time'];
      console.log('Original Array: ', arrayOfData_raw);
      console.log('Edited Array: ', arrayOfData);

      const exportDataset = arrayOfData.map(element => {
        //Make a string with equal spacing... 
        // let tableOfData = [];
        // tableOfData[0] = element.load;
        // tableOfData[30] = element.stroke;
        // tableOfData[60] = element.extension;
        // tableOfData[90] = element.command;
        // tableOfData[120] = element.time;
        // tableOfData.join('');
        // lines.push(tableOfData);
        lines.push(`${element.load}     ${element.stroke}     ${element.extension}      ${element.command}      ${element.time}`);
      });
      exportData(lines.join('\n'), 'Data.txt');
    })
    /*
    document.querySelector('.exportLS_data').addEventListener('click', () => {
      //console.log(arrayOfDataLS.join('           '));
      let LS_recordLine = [];
      //console.log(arrayOfDataLS);
      for(let i = 0; i < arrayOfDataLS.length - 1; i++) {
        let load;
        load = `-${(Math.abs(arrayOfDataLS[i][0]).toPrecision(5)).toString()}`;
        LS_recordLine.push(arrayOfDataLS[i][1].toPrecision(4) + '          ' + load);
        //LS_recordLine.push(arrayOfDataLS[i][1] + '          ' + arrayOfDataLS[i][0]);
      }
      // const LS_txt = arrayOfDataLS.map(element => {

      // });
      //console.log(splitText(text)[1].concat(arrayOfDataLS[0]));
      exportData(splitText(text)[1].concat(LS_recordLine.join('\n')), "Load-Stroke.txt");
    });

    document.querySelector('.exportLE_data').addEventListener('click', () => {
      //console.log(arrayOfDataLS.join('           '));
      let LE_recordLine = [];
      for(let i = 0; i < arrayOfDataLE.length - 1; i++) {
        // let load;
        // load = `-${(Math.abs(arrayOfDataLE[i][0]).toPrecision(4)).toString()}`;
        //LS_recordLine.push(arrayOfDataLS[i][0] + '          ' + arrayOfDataLS[i][1]);
        LE_recordLine.push(arrayOfDataLE[i][1] + '                          ' + arrayOfDataLE[i][0]);
      }
      //console.log('ArrayLE: ', arrayOfDataLE);
      // const LS_txt = arrayOfDataLS.map(element => {

      // });
      //console.log(splitText(text)[1].concat(arrayOfDataLS[0]));
      exportData(splitText(text)[1].concat(LE_recordLine.join('\n')), "Load-Extension.txt");
    });
    */

  }
  reader.readAsText(input.files[0]);
}, false);




