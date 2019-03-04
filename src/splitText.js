export default function splitText(txt) {

  // break the textblock into an array of lines
  var lines = txt.split('\n');
  // remove one line, starting at the first position
  lines.splice(0,14);
  // join the array back into a single string
  var newtext = lines.join('\n');
  var data = newtext.split('\n'); //first line of data [0]
  data = data.slice(0,-1); //removing blank line element
  return data
}