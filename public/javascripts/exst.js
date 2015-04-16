var isTyping = false;
var myCodeMirror = {}
document.addEventListener("DOMContentLoaded", function(event) {
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('textarea'));
});


function markIt() {
  if (!isTyping) {
    document.getElementById('resultzone').innerHTML =
      marked(document.getElementById('textarea').value);
    isTyping = true;

    setInterval(
      function () {
        isTyping = false;
      }, 1000
    );
  }
}


function unMarkIt() {
  document.getElementById('resultzone').value =
    marked(document.getElementById('textarea').value);
  isTyping = true;

  setInterval(
    function () {
      isTyping = false;
    }, 1000
  );
}
