    //This function returns parsed line of data from data.txt
    export default function parseRecord(dataStringLine) {
      var record = {
        load: (Number(dataStringLine.split(" ")[0].replace(",","."))),
        stroke: (Number(dataStringLine.split(" ")[1].replace(",","."))),
        extension: (Number(dataStringLine.split(" ")[2].replace(",","."))),
        command: (Number(dataStringLine.split(" ")[3].replace(",","."))),
        time: (Number(dataStringLine.split(" ")[4].replace(",",".")))
      }
      return record
    }