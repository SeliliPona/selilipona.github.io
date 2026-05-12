let scrolls = [
	0,
	0,
    0
];

let hash = "";
let currentStep = 1;
let prevStep;

function goTo(nextStep) {
	if (currentStep < 3) scrolls[currentStep-1] = window.scrollY;
	console.log(`scrolls[${currentStep-1}] = ${scrolls[currentStep-1]}`)
  if (nextStep === currentStep || nextStep < 1 || nextStep > 3) return;
  
  window.scrollTo({top: scrolls[nextStep-1] || 0, behavior: "smooth"});

  const currentView = document.getElementById(`view-${currentStep}`);
  const nextView = document.getElementById(`view-${nextStep}`);

  if (nextStep > currentStep) {
	// Moving Forward: Current goes Left, Next comes from Right
	currentView.className = 'view left'; 
	nextView.className = 'view active';
	console.log('movefor', currentStep, nextStep)
  } else {
	// Moving Backward: Current goes Right, Next comes from Left
	currentView.className = 'view right';
	nextView.className = 'view active';
	scrolls[currentStep-1] = 0;
	console.log('moveback', currentStep, nextStep)
  }
  prevStep = currentStep;
  currentStep = nextStep;
}
window.addEventListener('hashchange', () => {
	let newHash = window.location.hash;
	console.log("new hash: "+newHash)
	let oldFrags = hash.split('/').length;
	let newFrags = newHash.split('/').length;
	// if something was added to it
	if (newFrags > oldFrags) {
		if (currentStep != 2) clearSubpage(currentStep);
		goTo(currentStep+1);
		initSubpage(newHash);
		console.log("add")
	}
	// if something was removed from it
	else if (newFrags < oldFrags) {
		clearSubpage(currentStep);
		goTo(currentStep-(oldFrags-newFrags));
		// initSubpage(newHash);
		console.log('remove')
	}
	hash = newHash;

});
var oldPage = "";
function clearSubpage() {
	if (currentStep === 1) return;
	const view = document.getElementById(`view-${currentStep}`);

	var container = view.querySelector('#album-page-container');
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	if (currentStep === 2) {
		var songholder = view.querySelector('.albumsongholder');
		while (songholder.firstChild) {
			songholder.removeChild(songholder.firstChild);
		}
	}
}
async function initSubpage(path, step) {
	const view = document.getElementById(`view-${step || currentStep}`);
	var container = view.querySelector('#album-page-container');
	let frags = path.replace('#','').split('/');
	let thisPage = frags.pop();


	const pathlinks = view.querySelector('#pathlinks');
	pathlinks.textContent="";
	hash = "";
	frags.forEach(text => {
		hash += text;
		const link = document.createElement('a');
		const title = document.createElement('span');
		title.textContent=text;
		// add the title to the link
		link.appendChild(title);
		link.href = "javascript:void(0);";
		const currentHash = hash;
		link.addEventListener("click", function() {
			setUrl(currentHash, currentHash == "songs" && 'button-songs');
		})
		link.classList = "pathlink";
		pathlinks.appendChild(link);
		const sep = document.createElement('span');
		sep.textContent="/";
		pathlinks.appendChild(sep);
		hash+="/";
	});
	const current = document.createElement('span');
	current.textContent=thisPage;
	pathlinks.appendChild(current);

	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	if (albums.length == 0) await fetchItems();
	let page;
	const needToLoad = document.getElementById('view-2').querySelector('#album-page-container').children.length == 0;
	if (frags.length == 1) {
		page = await buildAlbumPage(thisPage);
		container.appendChild(page);
	} else {
		page = await buildSongPage(`${frags[frags.length-1]}/${thisPage}`)
		container.appendChild(page);
		if (needToLoad) await initSubpage(`#${frags.join('/')}`, 2);
	}
	oldPage=page
}