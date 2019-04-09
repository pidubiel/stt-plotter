export default function parseLoad(dataObject, typeOfPlot) {
  let coordinates = [];
  coordinates.push(dataObject[`${typeOfPlot}`]);
  coordinates.push(dataObject.load);
  return coordinates
}