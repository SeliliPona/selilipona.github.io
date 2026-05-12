/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleTopnav() {
	var x = document.getElementById("topnav");
	// Only allow toggling the 'responsive' (open) state if we are in 'collapsed-mode'
	if (x.classList.contains("collapsed-mode")) {
		x.classList.toggle("responsive");
	}
}

function handleOverflow() {
	const nav = document.getElementById("topnav");
	if (!nav) return;

	// 1. Temporarily remove classes to measure natural "un-collapsed" height
	nav.classList.remove("collapsed-mode", "responsive");

	// 2. Check if the height suggests it has wrapped to two rows
	// (Using 60 as a threshold since your links are ~55px tall)
	const isOverflowing = nav.offsetHeight > 60;

	if (isOverflowing) {
		nav.classList.add("collapsed-mode");
	} else {
		nav.classList.remove("collapsed-mode");
	}
}

// make translation tooltip, topnav, header, comment, and footer for page
async function makeCommon() {
	const tl = document.createElement('div');
	tl.id = 'tl-tooltip';
	tl.classList = 'tooltip-hidden';

	const tlRoman = document.createElement('span');
	tlRoman.classList = 'tl-roman';
	tl.appendChild(tlRoman);

	const br = document.createElement('br');
	br.id = 'tl-break';
	tl.appendChild(br);

	const tlTrans = document.createElement('span');
	tlTrans.classList = 'tl-trans';
	tl.appendChild(tlTrans);


	const pn = location.pathname;
	const current = pn == "/" ? "" : pn.substring(1, pn.length - 1);

	// create topnav
	const response = await fetch('/pages.json');
	const items = await response.json();

	let topnav = document.createElement('nav');
	topnav.classList = 'topnav';
	topnav.id = 'topnav';

	let currentPage;

	items.forEach(page => {
		const link = document.createElement('a');
		if (page.link == current) {
			link.classList = "active";
			currentPage = page;
		} else {
			link.href = "/" + page.link;
		}
		if (page.link == "") { // special case for home
			const img = document.createElement('img');
			img.classList = "topnavicon";
			img.src = "/assets/img/selili-min.png";
			img.alt = "pixel art drawing of Selili";
			link.appendChild(img);
		} else {
			link.textContent = page.english;
		}
		topnav.appendChild(link);
	});
	// mobile open button
	const toggle = document.createElement('a');
	toggle.href = 'javascript:void(0);';
	toggle.classList = 'toggle';
	toggle.addEventListener('click', toggleTopnav)

	const container = document.createElement('div');
	container.classList = 'icon-container';

	const dots = document.createElement('span');
	dots.classList = 'dots';
	dots.textContent = '•••';
	container.appendChild(dots);

	const close = document.createElement('span');
	close.classList = 'close';
	close.textContent = "✕";
	container.appendChild(close);

	toggle.appendChild(container);
	topnav.appendChild(toggle);

	// create header
	const main = document.createElement('main');

	const hero = document.createElement('header');
	hero.classList = 'hero';

	const row = document.createElement('div');
	row.classList = 'row';

	const span = document.createElement('span');
	span.classList = 'tl';
	span.setAttribute('data-roman', currentPage.roman);
	span.setAttribute('data-trans', currentPage.trans);

	const h1 = document.createElement('h1');
	if (currentPage.link == "") { // because home has special linebreaking
		h1.append(document.createTextNode("󱤪󱥍󱤑"));
		h1.appendChild(document.createElement('br'));

		const cartouche = document.createElement('span');
		cartouche.classList = 'cartouche';
		cartouche.textContent = "󱦐󱥠󱤊󱤤󱤎󱥼󱤏󱦑";
		h1.appendChild(cartouche);
	} else {
		h1.textContent = currentPage.sitelen;
	}
	span.appendChild(h1);
	row.appendChild(span);
	hero.appendChild(row);

	const subtitle = document.createElement('p');
	subtitle.classList = 'subtitle';
	subtitle.textContent = currentPage.english;
	hero.appendChild(subtitle);

	const subsubtitle = document.createElement('p');
	subsubtitle.classList = 'subsubtitle';
	subsubtitle.textContent = currentPage.desc;
	hero.appendChild(document.createElement('i')).appendChild(subsubtitle);

	main.appendChild(hero);


	// create comment
	if (currentPage.comment) {
		const commentMain = document.createElement('main');
		const commentP = commentMain.appendChild(document.createElement('p'));
		commentP.classList = 'subsubtitle';
		commentP.textContent = currentPage.comment;

		if (currentPage.comment_mobile) {
			commentMain.classList = 'desktop-only';
			const mobileMain = document.createElement('main');
			mobileMain.classList = 'mobile-only';
			const mobileP = mobileMain.appendChild(document.createElement('p'));
			mobileP.classList = 'subsubtitle';
			mobileP.textContent = currentPage.comment_mobile;

			if (currentPage.body) {
				const body = document.getElementById(currentPage.body);
				body.insertBefore(mobileMain, body.firstChild);
			} else {
				document.body.insertBefore(mobileMain, document.body.firstChild);
			}
		}

		if (currentPage.body) {
			const body = document.getElementById(currentPage.body);
			body.insertBefore(commentMain, body.firstChild);
		} else {
			document.body.insertBefore(commentMain, document.body.firstChild);
		}
	}

	// create footer
	
	const clResponse = await fetch('/changelog/content.json');
	const version = (await clResponse.json()).length - 1;

	const footer = document.createElement('footer');
	footer.className = 'footer';

	const signature = document.createElement('img');
	signature.src = '/assets/img/signature.png';
	footer.appendChild(signature);

	const quote = document.createElement('h2');
	quote.className = 'footer-quote';
	const quotes = [
		"your future is whatever you make it, so make it a good one", // Emmett Brown, ｢Back to the Future Part III｣
		"in the end, it was just too fucking good to regret", // Evil Neuro - ｢BOOM｣
		"I don't need anybody, anybody, anybody", // SnowBlood - ｢Crazy Fuckin' Robot Body｣
		"boom", // Evil Neuro - ｢BOOM｣
		"heart", // Neuro-sama
		"no, we're on the internet, although I can't imagine Hell being much worse", // Emmett Brown, ｢Back to the Future Part II｣ (modified)
		"do you think your car is just as submissive and breedable as you are?", // https://youtu.be/mfOj0HDL4ac&t=25119s
		"eggs", // https://youtu.be/n-Nr6eSvNbM&t=5926s
		"very home", // Papyrus, ｢UNDERTALE｣
		"be excellent to each other", // Bill S Preston, ｢Bill & Ted's Excellent Adventure｣
		"this website is not suitable for children or those who are easily disturbed", // ｢Doki Doki Literature Club!｣ (modified)
		"texcock mextails", // meme
		"(well, okay, you can touch it. just be gentle.)", // Mr “Ant” Tenna, ｢DELTARUNE｣
		"won't you be my neighbor?", // Fred Rogers - ｢Won't You Be My Neigbor?｣
		"snuke (snake nuke)", // https://x.com/EvilNeuroAI/status/2041660669221544107
		"filtered", // Neuro-sama
		"Greater Dog wants some marijuana", // https://youtu.be/vfYYkn9C_mc?t=8205
		"you'll be safe in the magical world of Omegle", // https://youtu.be/2ybvriJM_Co&t=2856s
		"the 2020 Dodge Charger is a four-door", // https://youtu.be/e3wSvSnRGBQ&t=1264s
		"execution", // Mili - ｢world.execute(me);｣
		"reading footer text fills you with determination", // ｢UNDERTALE｣
		"insert cash or select payment type", // self-checkout machines
		"you are the player", // Julian Gough, ｢End Poem｣ 
		"you... I found you...again...", // Neuro-sama - ｢LIFE｣
		"“I have a dream—” objection!" // https://youtu.be/mMC4KLuTonw?t=609
	];
	quote.innerHTML = marked.parse(`*${quotes[Math.floor(Math.random() * Math.floor(quotes.length))]}*`);
	footer.append(quote);

	const copyright = document.createElement('div');
	copyright.classList = 'footer-name';
	const icon = document.createElement('img');
	icon.src = '/assets/img/selili-128x.png';
	copyright.appendChild(icon);
	const name = document.createElement('span');
	name.textContent = "© 2026 Selili";
	copyright.appendChild(name);
	footer.append(copyright);

	const details = document.createElement('nav');
	details.className = 'footer-details';
	const verText = document.createElement('span');
	verText.textContent = `site version ${version}`;
	details.appendChild(verText);
	const repoLink = document.createElement('a');
	repoLink.textContent = "repository";
	repoLink.href = 'https://github.com/SeliliPona/selilipona.github.io';
	repoLink.target = '_blank';
	details.appendChild(repoLink);
	footer.appendChild(details);

	const license = document.createElement('span');
	license.className = 'footer-details';
	license.textContent = "licensed under the ";
	const licenseLink = document.createElement('a');
	licenseLink.textContent = "GNU Affero General Public License";
	licenseLink.href = "https://gnu.org/licenses";
	licenseLink.target = '_blank';
	license.append(licenseLink, ".");

	footer.appendChild(license);

	// add to page
	document.body.insertBefore(tl, document.body.firstChild);
	if (currentPage.body) {
		const body = document.getElementById(currentPage.body);
		body.insertBefore(main, body.firstChild);
	} else {
		document.body.insertBefore(main, document.body.firstChild);
	}
	document.body.insertBefore(topnav, document.body.firstChild);
	document.body.appendChild(footer);

	const navElement = document.getElementById("topnav");
	const resizeObserver = new ResizeObserver(() => {
		handleOverflow();
	});
	resizeObserver.observe(document.body); // Watch body size changes

	// Initial check
	handleOverflow();

	//construct page
	initTl();
	fill();
}

function tlDfn(tl) {
	const dfn = document.createElement('dfn');
	dfn.classList = "tl";
	dfn.setAttribute('data-roman', tl[0] || "");
	dfn.setAttribute('data-trans', tl[1] || "");
	return dfn;
}