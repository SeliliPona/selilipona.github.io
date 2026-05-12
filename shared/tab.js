function setUrl(text, buttonId) {
		window.location.hash = text;
		if (buttonId) {
			const btn = document.getElementById(buttonId);
			if (btn) (btn.click());
		}
}
function getUrl() {
		return window.location.hash;
}

function initUrl() {
	let url = getUrl();
		if (url != "") {
			setUrl("");
			setUrl(url);
			if (window.location.pathname == "/work/") {
				goTo(url.split('/').length-1);
			}
		} else {
			// setUrl(tabName);
		}

}

// all of this tab shit is from W3Schools
function tab(evt, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
			setUrl(tabName);

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

}
// this greedy asshole wants to run first bc it's all self-important and shit
// so we wrap it in a fancy event listener that somehow cures it of ADHD
 document.addEventListener("DOMContentLoaded", async function() {
	console.log('dom loaded')
  await fetchItems();
	initUrl(await makeCommon());
	// all that work just to make a page open by default
 })