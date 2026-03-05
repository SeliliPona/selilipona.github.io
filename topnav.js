/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleTopnav() {
  var x = document.getElementById("topnavstuff");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
} 