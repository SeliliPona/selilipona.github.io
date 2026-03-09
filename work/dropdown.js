var previousDd = null
var previousDdBtn = null

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleDropdown(dropdown) {
    var dd = document.getElementById(dropdown);
    var ddbtn = document.getElementById("_"+dropdown)
    if (dropdown == previousDd) {
        dd.className = "dropdown-content";
        ddbtn.className = "dropbtn"
        previousDd = null;
    } else {
        if (previousDd != null) {
            document.getElementById(previousDd).className = "dropdown-content";
        }
        dd.className += " show";
        ddbtn.className += " open"
        previousDd = dropdown;
    }
}

// Get the modal
var modal = document.getElementsByClassName("modal")[0];
console.log(modal == null)

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function showModal(image) {
    console.log(modal.className)
  modal.className += " show";
  modalImg.src = "../assets/img/drawings/" + image + ".png";
  captionText.innerHTML = image;
}

// Get the <span> element that closes the modal
var span = document.getElementById("closeButton");

// When the user clicks on <span> (x), close the modal
function closeModal() {
    modal.className = "modal";
  modal.style.display = "none";
} 