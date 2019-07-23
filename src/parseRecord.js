//This function returns parsed line of data from data.txt
export default function parseRecord(dataStringLine) {
  //console.log("DataStringLine: ", dataStringLine.split(" "));
  if (dataStringLine.split(" ")[4]) {
    var record = {
      load: Number(dataStringLine.split(" ")[0].replace(",", ".")),
      stroke: Number(dataStringLine.split(" ")[1].replace(",", ".")),
      extension: Number(dataStringLine.split(" ")[2].replace(",", ".")),
      command: Number(dataStringLine.split(" ")[3].replace(",", ".")),
      time: Number(dataStringLine.split(" ")[4].replace(",", "."))
    };
  } else {
    var record = {
      load: Number(dataStringLine.split("\t")[0].replace(",", ".")),
      stroke: Number(dataStringLine.split("\t")[1].replace(",", ".")),
      extension: Number(dataStringLine.split("\t")[2].replace(",", ".")),
      command: Number(dataStringLine.split("\t")[3].replace(",", ".")),
      time: Number(dataStringLine.split("\t")[4])
    };
  }

  return record;
}
