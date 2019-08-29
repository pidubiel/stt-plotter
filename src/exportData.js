export default function exportData(text, filename) {
  var blob = new Blob([text], { type: "text/plain" });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  document.body.appendChild(a);
  a.download = filename;
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
  a.click();
}
