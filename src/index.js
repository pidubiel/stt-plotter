import $ from "jquery";
import drawPlot from "./drawPlot";
import splitText from "./splitText";
import parseRecord from "./parseRecord";
import exportData from "./exportData";
//import cutData from './cutData'

//NUMBER SPINNER-----------------------------------------------------------------------------
var numberSpinner = (function() {
  $(".number-spinner>.ns-btn>a").click(function() {
    var btn = $(this),
      oldValue = btn
        .closest(".number-spinner")
        .find("input")
        .val()
        .trim(),
      newVal = 0;

    if (btn.attr("data-dir") === "up") {
      newVal = parseInt(oldValue) + 1;
    } else {
      if (oldValue > 1) {
        newVal = parseInt(oldValue) - 1;
      } else {
        newVal = 1;
      }
    }
    btn
      .closest(".number-spinner")
      .find("input")
      .val(newVal);
  });
  $(".number-spinner>input").keypress(function(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
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

const cutData_beginLS = document.querySelector(".cut-data-beginLS");
const cutData_endLS = document.querySelector(".cut-data-endLS");
const cutData_beginLE = document.querySelector(".cut-data-beginLE");
const cutData_endLE = document.querySelector(".cut-data-endLE");

const cutAmountLS = document.querySelector("#cutLS");
const cutAmountLE = document.querySelector("#cutLE");

const resetLS = document.querySelector(".resetLS");
const resetLE = document.querySelector(".resetLE");

//Amounts of cutted values
let cuttedLS_B = 0;
let cuttedLS_E = 0;
let cuttedLE_B = 0;
let cuttedLE_E = 0;

let constraintsLS = [];
let constraintsLE = [];

const right_constraint_LE =
  document.getElementById("right_constraint_LE").value * 1;

//const reset = document.querySelector('.reset');
const graph = document.querySelectorAll(".plot");

function cutData(plotName, position, amount) {
  if (plotName == "ls" && position == "begin") {
    const right_constraint_LS =
      document.getElementById("right_constraint_LS").value * 1;
    arrayOfDataLS = arrayOfDataLS.slice(amount, arrayOfDataLS.length);
    for (let i = 0; i < cuttedLS_B; i++) {
      arrayOfData[i].stroke = 0;
    }
    //console.log(arrayOfData);
    console.log("right_Constraint_LS: ", right_constraint_LS);
    if (right_constraint_LS) {
      graph[0].innerHTML = "";
      graph[1].innerHTML = "";
      graph.innerHTML = "";
      drawPlot(arrayOfDataLS, "Load-Stroke", [
        constraintsLS[0],
        right_constraint_LS
      ]);
      drawPlot(arrayOfDataLE, "Load-Extension");
    } else {
      graph[0].innerHTML = "";
      graph[1].innerHTML = "";
      graph.innerHTML = "";
      drawPlot(arrayOfDataLS, "Load-Stroke", [constraintsLS[0], -59.6]);
      drawPlot(arrayOfDataLE, "Load-Extension");
    }

    //console.log(arrayOfDataLS.length);
  } else if (plotName == "ls" && position == "end") {
    for (
      let i = arrayOfData.length - cuttedLS_E;
      i <= arrayOfData.length - 1;
      i++
    ) {
      arrayOfData[i].stroke = 0;
    }
    arrayOfDataLS = arrayOfDataLS.slice(0, arrayOfDataLS.length - amount);
    graph[0].innerHTML = "";
    graph[1].innerHTML = "";
    graph.innerHTML = "";
    drawPlot(arrayOfDataLS, "Load-Stroke");
    drawPlot(arrayOfDataLE, "Load-Extension");
  } else if (plotName == "le" && position == "begin") {
    const right_constraint_LE =
      document.getElementById("right_constraint_LE").value * 1;
    for (let i = 0; i < cuttedLE_B; i++) {
      arrayOfData[i].extension = 0;
    }
    arrayOfDataLE = arrayOfDataLE.slice(amount, arrayOfDataLE.length);
    //graph[0].innerHTML = '';
    graph[1].innerHTML = "";
    graph.innerHTML = "";
    //drawPlot(arrayOfDataLS, 'Load-Stroke');
    //drawPlot(arrayOfDataLS, 'Load-Extension', [-0.049, -0.01264400659066603]);

    console.log("CONSTRAINTS_LE: ", constraintsLE[0], right_constraint_LE);
    drawPlot(arrayOfDataLE, "Load-Extension", [
      constraintsLE[0],
      right_constraint_LE
    ]);
    //drawPlot(arrayOfDataLE, 'Load-Extension');
  } else if (plotName == "le" && position == "end") {
    for (
      let i = arrayOfData.length - cuttedLE_E;
      i <= arrayOfData.length - 1;
      i++
    ) {
      arrayOfData[i].extension = 0;
    }
    arrayOfDataLE = arrayOfDataLE.slice(0, arrayOfDataLE.length - amount);
    graph[0].innerHTML = "";
    graph[1].innerHTML = "";
    graph.innerHTML = "";
    drawPlot(arrayOfDataLS, "Load-Stroke");
    drawPlot(arrayOfDataLE, "Load-Extension");
    //console.log('LE End:', arrayOfDataLE.length);
    //console.log(arrayOfDataLE[arrayOfDataLE.length-1]);
  }
}

fileInput.addEventListener(
  "change",
  function(e) {
    var input = event.target;

    document.querySelector(".loadFile_info").style.display = "none";
    document.querySelector(".showFullPlot").style.display = "inline-block";
    document.querySelector(".ls").style.display = "block";
    document.querySelector(".le").style.display = "block";
    document.querySelector(".btn__export").style.display = "inline-block";
    document.querySelector(".scale-block").style.display = "block";

    var reader = new FileReader();
    reader.onload = function() {
      //Hide file read from DOM
      document.getElementById("input").style.display = "none";
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

      const findMinMaxStroke = arrayLS => {
        const newArray = JSON.parse(JSON.stringify(arrayLS));
        newArray.forEach(element => (element.length = 1));
        const min = Math.min(...newArray.flat());
        const max = Math.max(...newArray.flat());
        const range = min - max;
        console.log("MIN/MAX: ", min, max);
        console.log("RANGE: ", Math.abs(range));
        //console.log("constraint MAX!: ", -(-min + range / 8));
        return [min, -(-min + range / 8)];
      };
      console.log("CONSTRAINTS LS: ", findMinMaxStroke(arrayOfDataLS));
      console.log("CONSTRAINTS LE: ", findMinMaxStroke(arrayOfDataLE));

      // constraintsLE[0] = arrayOfDataLE.slice(0, 1)[0][0];
      // constraintsLE[1] = constraintsLE[0] + 0.1 * Math.abs(constraintsLE[0]);

      constraintsLS = findMinMaxStroke(arrayOfDataLS);
      constraintsLE = findMinMaxStroke(arrayOfDataLE);
      //console.log("array: ", arrayOfData);
      //console.log("constraints LE: ", constraintsLE);
      //arrayOfDataLS.map(e => e.reverse());
      //arrayOfDataLE.map(e => e.reverse());
      //arrayOfDataLE.map((e,i) => e[2] = i);
      //arrayOfDataLE.sort();

      //console.log("arrayOfDataLS", arrayOfDataLS);

      //console.log('ArrayOfData: ', arrayOfData);
      //console.log('ArrayOfDataLS: ', arrayOfDataLS);
      //console.log('ArrayOfDataLE: ', arrayOfDataLE);

      //drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.023796]);
      drawPlot(arrayOfDataLS, "Load-Stroke");
      drawPlot(arrayOfDataLE, "Load-Extension");

      cutData_beginLS.addEventListener("click", () => {
        cuttedLS_B += parseInt(cutAmountLS.value);
        cutData("ls", "begin", cutAmountLS.value);
        console.log("Cutted LS_B: ", cuttedLS_B);
      });

      cutData_endLS.addEventListener("click", () => {
        cuttedLS_E += parseInt(cutAmountLS.value);
        cutData("ls", "end", cutAmountLS.value);
        console.log("Cutted LS_E: ", cuttedLS_E);
      });

      cutData_beginLE.addEventListener("click", () => {
        cuttedLE_B += parseInt(cutAmountLE.value);
        cutData("le", "begin", cutAmountLE.value);
        console.log("Cutted LE_B: ", cuttedLE_B);
      });

      cutData_endLE.addEventListener("click", () => {
        cuttedLE_E += parseInt(cutAmountLE.value);
        cutData("le", "end", cutAmountLE.value);
        console.log("Cutted LE_E: ", cuttedLE_E);
      });

      // reset.addEventListener('click', () => {
      //   graph[0].innerHTML = '';
      //   graph[1].innerHTML = '';
      //   drawPlot(arrayOfDataLS_raw, 'Load-Stroke');
      //   drawPlot(arrayOfDataLE_raw, 'Load-Extension');
      //   arrayOfDataLS = arrayOfDataLS_raw;
      //   arrayOfDataLE = arrayOfDataLE_raw;
      // })

      resetLS.addEventListener("click", () => {
        graph[0].innerHTML = "";
        drawPlot(arrayOfDataLS_raw, "Load-Stroke");
        arrayOfDataLS = arrayOfDataLS_raw;
        //TODO: Restore stroke values from arrayOfData
        for (let i = 0; i < arrayOfData.length; i++) {
          arrayOfData[i].stroke = arrayOfData_raw[i].stroke;
        }
        cuttedLS_B = 0;
        cuttedLS_E = 0;
      });

      resetLE.addEventListener("click", () => {
        graph[1].innerHTML = "";
        drawPlot(arrayOfDataLE_raw, "Load-Extension");
        arrayOfDataLE = arrayOfDataLE_raw;
        for (let i = 0; i < arrayOfData.length; i++) {
          arrayOfData[i].extension = arrayOfData_raw[i].extension;
        }
        cuttedLE_B = 0;
        cuttedLE_E = 0;
      });

      //Showing full plot
      document.querySelector(".showFullPlot").addEventListener("click", () => {
        graph[0].innerHTML = "";
        graph[1].innerHTML = "";
        drawPlot(arrayOfDataLS, "Load-Stroke");
        drawPlot(arrayOfDataLE, "Load-Extension");
      });

      //Scale All listener
      document.querySelector(".acceptScale").addEventListener("click", () => {
        const selectScale = document.getElementById("select-scale").value;
        if (!canceledOnce) {
          //Get value of scale
          const scaleValue = parseFloat(
            document.getElementById("scale-value").value
          );
          //TODO: Modify arrayOfData:
          if (selectScale === "Load") {
            arrayOfData.map(e => (e.load = e.load * scaleValue));
            arrayOfDataLS.map(e => (e[1] = e[1] * scaleValue));
            arrayOfDataLE.map(e => (e[1] = e[1] * scaleValue));
            //Rescale load
          } else if (selectScale === "Stroke") {
            //Rescale stroke
            arrayOfData.map(e => (e.stroke = e.stroke * scaleValue));
            arrayOfDataLS.map(e => (e[0] = e[0] * scaleValue));
          } else if (selectScale === "Extension") {
            //Rescale extension
            arrayOfData.map(e => (e.extension = e.extension * scaleValue));
            arrayOfDataLE.map(e => (e[0] = e[0] * scaleValue));
          } else if (selectScale === "Command") {
            //Rescale command
            arrayOfData.map(e => (e.command = e.command * scaleValue));
          } else if (selectScale === "Time") {
            //Rescale time
            arrayOfData.map(e => (e.time = e.time * scaleValue));
            console.log(arrayOfData);
          }
          /*
          arrayOfData.map(e => e.load = e.load + scaleValue * e.load);
          arrayOfData.map(e => e.extension = e.extension + scaleValue * e.extension);
          //console.log(arrayOfDataLS[0]);
          arrayOfDataLS.map(e => e[1] = e[1] + scaleValue * e[1]);
          arrayOfDataLE.map(e => e[1] = e[1] + scaleValue * e[1]);
          */
          //const OO = arrayOfDataLS.forEach(e => console.log(e[1] + e[1]));
          //console.log(arrayOfDataLS);
          graph[0].innerHTML = "";
          graph[1].innerHTML = "";
          //drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.3494177111703])
          drawPlot(arrayOfDataLS, "Load-Stroke");
          drawPlot(arrayOfDataLE, "Load-Extension");
          //canceledOnce = true;
        } else {
          alert(
            "Jeśli chcesz zmienić wartość skali - ponownie wczytaj wykres."
          );
        }
      });

      //Cancel Scale Operation
      document.getElementById("cancelScale").addEventListener("click", () => {
        graph[0].innerHTML = "";
        graph[1].innerHTML = "";
        arrayOfDataLS = arrayOfDataLS_raw;
        arrayOfDataLE = arrayOfDataLE_raw;
        //drawPlot(arrayOfDataLS, 'Load-Stroke', [-58.313, -57.3494177111703])
        drawPlot(arrayOfDataLS_raw, "Load-Stroke");
        drawPlot(arrayOfDataLE_raw, "Load-Extension");
      });

      //extrLS - minus
      document
        .querySelector("#btn_extrLS_minus")
        .addEventListener("click", () => {
          const right_constraint_LS =
            document.getElementById("right_constraint_LS").value * 1;
          const extrStep = parseFloat(
            document.getElementById("extr-value-LS").value
          );
          console.log(extrStep);
          console.log(arrayOfDataLS[0], arrayOfDataLS[1]);

          //arrayOfDataLS.unshift([-57.79, 0]);
          if (arrayOfDataLS[0][1] === 0) {
            arrayOfDataLS.shift();
            arrayOfDataLS.unshift([arrayOfDataLS[0][0] - extrStep, 0]);
          } else {
            arrayOfDataLS.unshift([arrayOfDataLS[0][0] - extrStep, 0]);
          }

          //arrayOfDataLS.map(e => e[0] = e[0] + 57.79);
          console.log(arrayOfDataLS);
          graph[0].innerHTML = "";
          drawPlot(arrayOfDataLS, "Load-Stroke", [
            constraintsLS[0],
            right_constraint_LS
          ]);
          //drawPlot(arrayOfDataLS, 'Load-Stroke');
          //Move pointer
        });

      //extrLS - plus
      document
        .querySelector("#btn_extrLS_plus")
        .addEventListener("click", () => {
          const right_constraint_LS =
            document.getElementById("right_constraint_LS").value * 1;
          const extrStep = parseFloat(
            document.getElementById("extr-value-LS").value
          );
          console.log(extrStep);
          console.log("BEFORE", arrayOfDataLS[0], arrayOfDataLS[1]);

          //arrayOfDataLS.unshift([-57.79, 0]);
          if (arrayOfDataLS[0][1] === 0) {
            arrayOfDataLS.shift();
            arrayOfDataLS.unshift([arrayOfDataLS[0][0], 0]);
            //arrayOfDataLS.unshift([(arrayOfDataLS[0][0] + extrStep), 0]);
            console.log(arrayOfDataLS[0]);
            console.log("TEST 1");
          } else {
            //arrayOfDataLS.unshift([(arrayOfDataLS[0][0] + extrStep), 0]);
            //arrayOfDataLS.unshift([arrayOfDataLS[0][0], 0]);
            arrayOfDataLS.unshift([-57.5, 0]);
            console.log("TEST 2");
          }
          console.log("AFTER", arrayOfDataLS[0], arrayOfDataLS[1]);

          //arrayOfDataLS.map(e => e[0] = e[0] + 57.79);
          //console.log(arrayOfDataLS);
          graph[0].innerHTML = "";
          drawPlot(arrayOfDataLS, "Load-Stroke", [
            constraintsLS[0],
            right_constraint_LS
          ]);
          //drawPlot(arrayOfDataLS, 'Load-Stroke');
          //Move pointer
        });

      document
        .querySelector("#btn_extrLS_plus")
        .addEventListener("click", () => {
          const extrStep = parseFloat(
            document.getElementById("extr-value-LS").value
          );
          console.log(extrStep);
        });

      //extrAcceptLS
      document.getElementById("extrAcceptLS").addEventListener("click", () => {
        const firstX_LS = arrayOfDataLS[0][0];
        arrayOfDataLS.map(e => (e[0] = e[0] + Math.abs(firstX_LS)));
        //arrayOfData.map(e => e.load = e.load + Math.abs(firstX_LS));
        graph[0].innerHTML = "";
        drawPlot(arrayOfDataLS, "Load-Stroke");
      });

      //extrLE
      document
        .querySelector("#btn_extrLE_minus")
        .addEventListener("click", () => {
          const right_constraint_LE =
            document.getElementById("right_constraint_LE").value * 1;
          const extrStep = parseFloat(
            document.getElementById("extr-value-LE").value
          );
          console.log(extrStep);
          console.log(arrayOfDataLE[0], arrayOfDataLE[1]);

          //arrayOfDataLS.unshift([-57.79, 0]);
          if (arrayOfDataLE[0][1] === 0) {
            arrayOfDataLE.shift();
            arrayOfDataLE.unshift([arrayOfDataLE[0][0] - extrStep, 0]);
          } else {
            arrayOfDataLE.unshift([arrayOfDataLE[0][0] - extrStep, 0]);
          }

          //arrayOfDataLS.map(e => e[0] = e[0] + 57.79);
          console.log(arrayOfDataLE);
          graph[1].innerHTML = "";
          //graph.innerHTML = "";
          drawPlot(arrayOfDataLE, "Load-Extension", [
            constraintsLE[0],
            right_constraint_LE
          ]);
          //drawPlot(arrayOfDataLS, 'Load-Stroke');
          //Move pointer
        });

      //extrAcceptLE
      document.getElementById("extrAcceptLE").addEventListener("click", () => {
        const firstX_LE = arrayOfDataLE[0][0];
        arrayOfDataLE.map(e => (e[0] = e[0] + Math.abs(firstX_LE)));
        //arrayOfData.map(e => e.load = e.load + Math.abs(firstX_LS));
        graph[1].innerHTML = "";
        drawPlot(arrayOfDataLE, "Load-Extension");
      });

      document
        .querySelector("#btn_extrLE_plus")
        .addEventListener("click", () => {
          const extrStep = parseFloat(
            document.getElementById("extr-value-LE").value
          );
          console.log(extrStep);
        });

      //Export All Data to .txt file
      document.querySelector(".exportData").addEventListener("click", () => {
        let lines = ["Load      Stroke      Extension     Command     Time"];
        //console.log('Original Array: ', arrayOfData_raw);
        //console.log('Edited Array: ', arrayOfData);
        //console.log("ArrayLS_Data: ", arrayOfDataLS);

        const arrayOfData_LS_copy = [...arrayOfDataLS];
        const arrayOfData_LE_copy = [...arrayOfDataLE];

        arrayOfData_LS_copy.forEach(el => {
          el[0] = parseFloat(parseFloat(el[0].toFixed(3)).toPrecision(4)); //stroke
          el[1] = parseFloat(parseFloat(el[1].toFixed(3)).toPrecision(4)); //load
        });

        arrayOfData_LE_copy.forEach(el => {
          el[0] = parseFloat(parseFloat(el[0].toFixed(3)).toPrecision(4)); //extension
          el[1] = parseFloat(parseFloat(el[1].toFixed(3)).toPrecision(4)); //load
        });

        console.log("ArrayLS_Data_COPY: ", arrayOfData_LS_copy);
        console.log("ArrayLE_Data_COPY: ", arrayOfData_LE_copy);

        console.log("Amount Of Cutted Values: ");
        console.log("---------------------------------------------");
        console.log("Cutted LS Begin: ", cuttedLS_B);
        console.log("Cutted LS End: ", cuttedLS_E);
        console.log("Cutted LE Begin: ", cuttedLE_B);
        console.log("Cutted LE End: ", cuttedLE_E);

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
          lines.push(
            `${element.load}     ${element.stroke}     ${
              element.extension
            }      ${element.command}      ${element.time}`
          );
        });

        //!!!_Prevent Download_!!!
        //exportData(lines.join("\n"), "Data.txt");
      });
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
    };
    reader.readAsText(input.files[0]);
  },
  false
);
