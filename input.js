

function setColor() {
  let x = document.body;
  let y = document.getElementById('page-1');
  x.style.backgroundColor = x.style.backgroundColor == "lightblue" ? "pink" : 
  "lightblue";
  y.style.backgroundColor = y.style.backgroundColor == "pink" ? "lightblue" : "pink";
}

  export default setColor;
