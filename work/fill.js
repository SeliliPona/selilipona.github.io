/*
	legend for work/content.json (in LuaCATS format):

	@class tl: [string?, string?] # romanization and translation for something
	
	@class workContent
	@field arts art[]
	@field albums album[]

	@class art
	@field image string # the path to the image file, relative to /assets/img/drawings/
	@field title string # name of the drawing
	@field date string # when the art was made, in this Unix format: %d %h %Y
	@field desc string? # optional description of the art

	@class album
	@field title string # name of the album
	@field subtitle string? # secondary part of the name
	@field desc string? # optional description of the album
	@field path string # path to get songs from, relative to /assets/audio/
	@field image string? # optional art for the album
	@field count integer? use this number instead of actual track count for calculations
	@field songs song[]
	@field nanpa boolean? # use nasin nanpa instead of Fredoka for the album title, overrides fairfax
	@field fairfax boolean? # use Fairfax HD instead of Fredoka for the album title

	@class song
	@field title string # name of the song
	@field title_tl tl? : Shiontaun no Tēma · Lavender Town Theme
	@field nanpa boolean? # use nasin nanpa instead of Fredoka for the song title, overrides fairfax
	@field fairfax boolean? # use Fairfax HD instead of Fredoka for the song title
	@field subtitle string? # secondary part of the name
	@field subtitle_tl tl?
	@field loop [number, number]? 0: time to loop back to; 1: point to switch to loop file
	@field artist string? # original artist of the song if not Selili
	@field artist_tl string? # translation of the original artist's name
	@field file string # path to the audio, relative to album.path
	@field image string? # art for this song, defaults to album.image
	@field desc string? # optional description of the song
*/

let items = [];
let arts;
let art_container;
let art_template;

let albums = [];
let album_container;
let album_template;
const album_page = document.getElementById('album-page');
let song_template;

let stats;

async function fetchItems() {
	const response = await fetch('./content.json');
	const statResponse = await fetch('/assets/audio/stats.json');
	items = await response.json();
	stats = await (statResponse.json());

	arts = items.arts;
	art_container = document.querySelector('#drawings');
	art_template = document.querySelector('#drawing-template');

	albums = items.albums;
	album_container = document.querySelector('#songs');
	album_template = document.querySelector('#album-template');
	song_template = document.querySelector('#song-template');

	return new Promise((resolve) => {
		console.log('fetch promise resolved')
		resolve();
	});
}

async function fill() {
	let artRow;

	arts.forEach((item, index) => {
		// Every 4 items (index 0, 4, 8...), create a new row div
		if (index % 4 === 0) {
			artRow = document.createElement('div');
			artRow.classList.add('artrow');
			art_container.appendChild(artRow);
		}

		// 1. Clone the template
		const clone = art_template.content.cloneNode(true);

		// 2. Fill the clone with data
		clone.querySelector('.image').src = "/assets/img/drawings/" + item.image;

		const title = document.createElement('h3');
		title.classList = 'title'
		if (item.nanpa) {
			title.style = 'font-family: nanpa;';
		} else {
			title.style = 'font-family: fredoka;';
		}
		title.textContent = item.title;
		// checking if the art has a translated title
		if (item.title_tl) {
			const tl = tlDfn(item.title_tl);
			tl.appendChild(title);
			clone.querySelector('.content').insertBefore(tl, clone.getElementById('date'));
		} else {
			clone.querySelector('.content').insertBefore(title, clone.getElementById('date'));
		}
		clone.querySelector('.date').textContent = item.date;
		clone.querySelector('.desc').innerHTML = marked.parse(item.desc.join("\n"));

		// 3. Add the clone to the main container
		artRow.appendChild(clone);
	});

	let album, albumRow;
	albums.forEach((item, index) => {
		// Every fourth item (index 0, 4, 8...), create a new row div
		if (index % 4 === 0) {
			albumRow = document.createElement('div');
			albumRow.classList.add('albumrow');
			album_container.appendChild(albumRow);
		}

		// 1. Clone the template
		album = album_template.content.cloneNode(true);

		// 2. Fill the clone with data
		const path = item.path;

		const albumbtn = album.querySelector('.albumbtn');
		album.querySelector('.albumart').src = "/assets/img/albums/" + item.image;
		albumbtn.id = '_' + path;
		const title = document.createElement('h2');
		title.classList = "albumbtntitle";
		title.textContent = item.title;
		if (item.subtitle) {
			title.textContent += " ";
			const small = document.createElement('small');
			small.textContent = item.subtitle;
			title.appendChild(small);
		}
		albumbtn.appendChild(title);
		albumbtn.addEventListener("click", function () {
			setUrl("songs/" + item.path);
		});

		// 3. Add the clone to the main container
		albumRow.appendChild(album);
	});
}

// get the display name, subtitle, and translated name and subtitle of something
// eg "songs/picotale/Bonetrousle.wav" => ["Bonetrousle"]
//		"drawings/lon li nasa" => ["󱤬󱤧󱤾", null, "lon li nasa • existence is weird"]
function getDisplayName(path) {
	let frags = path.split('/');
	let out = ["", "", "", ""];
	if (frags[0] == "#drawings") {
		items.arts.forEach(art => {
			if (art.image == frags[1]) {
				out[0] = art.title;
				if (art.translation) {
					out[2] = art.translation;
				}
				console.log("out: " + out)
				return out[0], out[1], out[2], out[3];
			}
		})
	} else if (frags[0] == "#songs") {
		items.albums.forEach(album => {
			if (album.path == frags[1]) {
				// if this is a song, not an album
				if (frags[2]) {
					album.songs.forEach(song => {
						if (song.files[0][0] == frags[2]) {
							out[0] = song.title;
							if (song.subtitle) {
								out[1] = song.subtitle;
							}
							if (song.title_translation) {
								out[2] = song.title_translation;
							}
							if (song.subtitle_translation) {
								out[3] = song.subtitle_translation;
							}
							return out[0], out[1], out[2], out[3];
						}
					})
				} else {
					out[0] = album.title;
					if (album.subtitle) {
						out[1] = album.subtitle;
					}
					if (album.title_translation) {
						out[2] = album.title_translation;
					}
					if (album.subtitle_translation) {
						out[3] = album.subtitle_translation;
					}
					return out[0], out[1], out[2], out[3];
				}
			}
		})
	}
}

// given an album's path (ie iah1), construct the info page for it
async function buildAlbumPage(path) {
	let duration = 0;
	let metastring = [];
	let album = albums.find(a => a.path === path)

	// set up metastring
	if (album.date) {
		metastring.push(album.date)
	}
	const songcount = album.songs.length;
	if (songcount == 1) {
		metastring.push("1 song")
	} else {
		metastring.push(album.songs.length + " songs")
	}
	const clone = document.getElementById('album-page').content.cloneNode(true);

	const img = clone.querySelector('.albumpageart')
	img.src = "/assets/img/albums/" + album.image;

	const title = clone.querySelector('.albumtitle');
	const name = document.createElement('a');
	name.textContent = album.title;
	if (album.title_translation) {
		name.title = album.title_translation;
	};
	title.appendChild(name);
	if (album.subtitle) {
		const space = document.createElement('a');
		space.textContent = " ";
		title.appendChild(space);
		const subtitle = document.createElement('small');
		subtitle.textContent = album.subtitle;
		if (album.subtitle_translation) {
			subtitle.title = album.subtitle_translation;
		}
		title.appendChild(subtitle);
	}
	if (album.nanpa) title.style = "font-family: nanpa;";
	else if (album.fairfax) title.style = "font-family: fairfax;";

	if (album.desc) {
		clone.querySelector('.albumdesc').innerHTML = marked.parse(album.desc.join('\n'));
	}

	// TODO: export all songs to mp3 and wav and make different zips for each
	const zipPath = `/assets/audio/${album.path}/${album.title.replace(/\s+/g, '_')}.zip`;
	const albumStats = stats[album.path][zipPath];

	const dlClone = document.getElementById('download-template').content.cloneNode(true);

	dlClone.querySelector('#download-icon').classList = 'fa-solid fa-download';

	dlClone.querySelector('.download-title').textContent = "audio";
	const date = new Date(albumStats.mtime).toLocaleDateString('en-GB', {
		'dateStyle': 'medium'
	});
	dlClone.querySelector('.download-info').textContent = `${date} • ${albumStats.format} • ${filesize(albumStats.size)}`;

	dlClone.querySelector('.download-chip').addEventListener(onclick, function () {
		downloadAlbum(album.path);
	})

	clone.querySelector('.download-container').appendChild(dlClone);

	const albummeta = clone.querySelector('.albummeta');

	const songholder = document.querySelector('.albumsongholder')

	let songRow;
	album.songs.forEach((song, index) => {
		if (index % 2 == 0) {
			songRow = document.createElement('div');
			songRow.classList.add('songrow');
			songholder.appendChild(songRow);
		}
		const songClone = song_template.content.cloneNode(true);
		songClone.querySelector('.songthing').addEventListener('click', function () {
			const songPath = song.files[0][0].slice(0, song.files[0][0].lastIndexOf('.'));
			setUrl(`songs/${album.path}/${songPath}`);
		});

		const num = songClone.querySelector('.songnumber')
		if (!album.unnumbered) {
			num.textContent = index + 1
		}

		const img = songClone.querySelector('.songimage')
		if (song.image) {
			img.src = "/assets/img/songs/" + song.image;
		} else {
			img.src = "/assets/img/albums/" + album.image;
		}

		const title = songClone.querySelector('.songtitle');
		const name = document.createElement('span');
		name.textContent = song.title;
		if (song.nanpa) { name.style = "font-family: nanpa;" }
		else if (song.fairfax) { name.style = "font-family: fairfax;" }
		if (song.title_tl) {
			const tl = tlDfn(song.title_tl);
			tl.appendChild(name);
			title.append(tl);
		} else {
			title.appendChild(name);
		}
		if (song.subtitle) {
			const space = document.createElement('span');
			space.textContent = " ";
			title.appendChild(space);
			const subtitle = document.createElement('small');
			subtitle.textContent = song.subtitle;
			if (song.subtitle_tl) {
				const tl = tlDfn(song.subtitle_tl);
				tl.appendChild(subtitle);
				title.append(tl);
			} else {
				title.appendChild(subtitle);
			}
		}
		if (song.artist) {
			title.appendChild(document.createElement('br'));
			const artist = document.createElement('small');
			artist.classList = 'songartist';
			const pencil = document.createElement('i');
			pencil.classList = 'fa-solid fa-pencil';
			if (song.link) {
				pencil.classList += ' songlink'
				pencil.style = 'z-index: 5;';
				const a = document.createElement('a');
				a.href = song.link;
				a.appendChild(pencil);
				artist.appendChild(a);
			} else {
				artist.appendChild(pencil);
			}
			artist.append(document.createTextNode(" "));
			const artistName = document.createElement('span');
			artistName.textContent = song.artist;
			if (song.artist_tl) {
				const tl = tlDfn(song.artist_tl);
				tl.appendChild(artistName);
				artist.append(tl);
			} else {
				artist.appendChild(artistName);
			}
			title.appendChild(artist);
		} else title.appendChild(document.createElement('br'));
		// get duration and add it to total duration
		const songDuration = stats[album.path][song.files[0][0]].duration;
		duration += songDuration;
		title.appendChild(document.createElement('br'));
		const durationText = document.createElement('span');
		const files = song.files.length + (song.source ? 1 : 0);
		durationText.classList = 'songduration'
		durationText.textContent = secToTime(songDuration) + ` • ${files} file${files > 1 ? "s" : ""}`;
		title.appendChild(durationText)
		albummeta.textContent = metastring.join(" • ") + " • " + secToTime(duration);
		album.songs[index].duration = songDuration;

		songRow.appendChild(songClone);
	})
	return clone;
}
// given a song's path (ie iah1/iah), construct the info page for it
async function buildSongPage(path) {
	const paths = path.split('/');
	const albumPath = paths[0];
	const songPath = paths[1];
	console.log("got paths:", albumPath, songPath)

	let metastring = [];

	const album = albums.find(a => a.path === albumPath);
	const song = album.songs.find(s => s.files[0][0].slice(0, s.files[0][0].lastIndexOf('.')) === songPath);
	const songPrimaryFile = song.files[0][0]
	const songStats = stats[album.path][songPrimaryFile];

	// set up metastring
	const date = song.date || album.date;
	if (date) metastring.push(date);
	metastring.push(secToTime(songStats.duration));
	metastring.push(album.unnumbered ? "from ｢" : `#${album.songs.findIndex((s) => s === song) + 1} on ｢`);


	const clone = document.getElementById('album-page').content.cloneNode(true);

	const img = clone.querySelector('.albumpageart')
	img.src = "/assets/img/" + (song.image ? `songs/${song.image}` : `albums/${album.image}`);

	const title = clone.querySelector('.albumtitle');
	const name = document.createElement('span');
	name.textContent = song.title;
	if (song.title_tl) {
		const tl = tlDfn(song.title_tl);
		tl.appendChild(name);
		title.appendChild(tl);
	} else {
		title.appendChild(name);
	}
	if (song.subtitle) {
		const space = document.createElement('span');
		space.textContent = " ";
		title.appendChild(space);
		const subtitle = document.createElement('small');
		subtitle.textContent = song.subtitle;
		if (song.subtitle_tl) {
			const tl = tlDfn(song.subtitle_tl[0], song.subtitle_tl[1]);
			tl.appendChild(subtitle);
			title.appendChild(tl);
		} else {
			title.appendChild(subtitle);
		}
	}
	if (song.nanpa) title.style = "font-family: nanpa;";
	else if (song.fairfax) title.style = "font-family: fairfax;";

	if (song.artist) {
		const artist = document.createElement('h2');
		artist.classList = 'songartist';
		const pencil = document.createElement('i');
		pencil.classList = 'fa-solid fa-pencil';
		if (song.link) {
			pencil.classList += ' songlink'
			pencil.style = 'z-index: 5;';
			const a = document.createElement('a');
			a.href = song.link;
			a.appendChild(pencil);
			artist.appendChild(a);
		} else {
			artist.appendChild(pencil);
		}
		artist.append(document.createTextNode(" "));
		const artistName = document.createElement('span');
		artistName.textContent = song.artist;
		if (song.artist_tl) {
			const tl = tlDfn(song.artist_tl);
			tl.appendChild(artistName);
			artist.append(tl);
		} else {
			artist.appendChild(artistName);
		}
		clone.querySelector('.albumpage').insertBefore(artist, clone.querySelector('.albumdesc'));
	}

	const desc = clone.querySelector('.albumdesc');
	desc.classList += ' songdesc';
	if (song.desc) {
		desc.innerHTML = marked.parse(song.desc.join("\n"));
	} else {
		desc.innerHTML = marked.parse("*(no description added)*");
	}

	function makeDl(file) {
		const dlClone = document.getElementById('download-template').content.cloneNode(true);

		dlClone.querySelector('#download-icon').classList = 'fa-solid fa-download';

		dlClone.querySelector('.download-title').textContent = file[1];
		const date = new Date(songStats.mtime).toLocaleDateString('en-GB', {
			'dateStyle': 'medium'
		});
		let format = songStats.format || file[0].slice(file[0].lastIndexOf('.') + 1).toUpperCase();
		dlClone.querySelector('.download-info').textContent = `${date} • ${format} • ${filesize(songStats.size)}`;

		dlClone.querySelector('.download-chip').addEventListener('click', function () {
			if (file[1] === "source") downloadFile(file[0], file[0].slice(file[0].lastIndexOf('/') + 1));
			else downloadSong(song, album);
		})

		clone.querySelector('.download-container').appendChild(dlClone);
	}

	if (song.files) {
		song.files.forEach(file => {
			makeDl(file);
		})
	}
	if (song.source) {
		console.log(`adding source from ${song.source.length === 1 ? `/assets/source/${song.source[0]}` : `/assets/source/${songPath}.zip`}`)
		makeDl([song.source.length === 1 ? `/assets/source/${song.source[0]}` : `/assets/source/${songPath}.zip`, "source"]);
	}

	const songmeta = clone.querySelector('.albummeta');
	songmeta.textContent = metastring.pop();
	const albumTitle = document.createTextNode(album.title);
	if (album.title_tl) {
		const tl = tlDfn(album.title_tl);
		tl.append(albumTitle);
		songmeta.append(tl);
	} else {
		songmeta.append(albumTitle);
	}
	if (album.subtitle) {
		songmeta.append(document.createTextNode(" "));
		const albumSubtitle = document.createElement('small');
		albumSubtitle.textContent = album.subtitle;
		if (album.subtitle_tl) {
			const tl = tlDfn(album.subtitle_tl);
			tl.append(albumSubtitle);
			songmeta.append(tl);
		} else {
			songmeta.append(albumSubtitle);
		}
	}
	songmeta.append(document.createTextNode("｣ • "));
	songmeta.append(document.createTextNode(metastring.join(" • ")));

	const audio = document.createElement('audio');
	audio.controls = true;
	const src = `/assets/audio/${album.path}/${song.files[0][0]}`;
	audio.src = src;
	/*if (song.loop) {
		audio.setAttribute('normal', `/assets/audio/${album.path}/${song.files[0][0]}`);
		let loopFile = song.files[0][0].split('.').join('-loop.');
		audio.setAttribute('loop', `/assets/audio/${album.path}/${loopFile}`);
		audio.addEventListener('play', function() {
			const isLoopFile = audio.src === loopFile;
			if (!isLoopFile && audio.loop && audio.currentTime < song.loop[1]) {
				audio.src = loopFile;
			}
		});
	}*/
	clone.querySelector('.albumpage').insertBefore(audio, songmeta);

	return clone;
}

// modified from https://stackoverflow.com/a/34647636
// song: song object; used for checking cache
// src: if not cached, get new duration from this file
// cb: call this function with the duration
async function getSongDuration(song, src, cb) {
	if (song.duration) {
		console.log(`duration already exists for file ${src}, calling cb with it: ${song.duration}`);
		return new Promise((resolve) => {
			resolve()
			if (cb) cb(song.duration);
		});
	} else {
		console.log(`duration doesn't exist for file ${src}, fetching...`)
		const prom = new Promise(function (resolve) {
			var audio = new Audio(src);
			audio.addEventListener("loadedmetadata", function () {
				console.log(`got duration for file ${src}, calling cb with it: ${audio.duration}`);
				song.duration = audio.duration;
				if (cb) cb(audio.duration);
			});
		});
	}
}

function secToTime(time) {
	const min = parseInt(time / 60);
	const sec = time % 60;
	return min + ":" + (sec < 10 ? "0" : "") + parseInt(sec);
}