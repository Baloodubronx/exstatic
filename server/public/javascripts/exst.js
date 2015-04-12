var isTyping = false;

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
