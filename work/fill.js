async function fillThings() {
  const response = await fetch('./content.json');
  const items = await response.json();

  const arts = items.arts;
  const art_container = document.querySelector('#drawings');
  const art_template = document.querySelector('#drawing-template');

  const albums = items.albums;
  const album_container = document.querySelector('#songs');
  const album_template = document.querySelector('#album-template');
  const song_template = document.querySelector('#song-template');

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
    clone.querySelector('.image').src = "/assets/img/drawings/"+item.image;

    const title = clone.querySelector('.title');
    title.textContent = item.title;
    // checking if the art has a translated title
    if (item.translation) {
        title.title = item.translation;
    }
    clone.querySelector('.date').textContent = item.date;
    clone.querySelector('.desc').textContent = item.desc;

    // 3. Add the clone to the main container
    artRow.appendChild(clone);
  });

  let album;
  
albums.forEach(item => {
    // 1. Clone the template
    album = album_template.content.cloneNode(true);

    // 2. Fill the clone with data
    const path = item.path;
    const dropdown_content = album.querySelector(".dropdown-content");
    dropdown_content.id = path;
    if (item.desc) {
        // replacing style tags until I can figure out how to get Marked working without breaking everything
        // there has to be a better way to do this but whatever
        const desc = item.desc
        .replace("<b>", "*").replace("</b>", "*")
        .replace("<u>", "*").replace("</u>", "*")
        .replace("<i>", "*").replace("</i>", "*");
        const thingdesc = album.querySelector('.desc');
        desc.split("\n").forEach(line => {
            thingdesc.appendChild(document.createTextNode(line));
            thingdesc.appendChild(document.createElement('br'));
        })
        thingdesc.removeChild(thingdesc.lastChild);
    }
    const dropbtn = album.querySelector('.dropbtn');
    dropbtn.id = "_"+path;
    dropbtn.textContent = item.title;
    if (item.subtitle) {
        dropbtn.textContent += " ";
        const small = document.createElement('small');
        small.textContent = item.subtitle;
        dropbtn.appendChild(small);
    }
    dropbtn.addEventListener("click", function() {toggleDropdown(path)});

    item.songs.forEach(song => {
        // 1. Clone the template
        const songClone = song_template.content.cloneNode(true);

        // 2. Fill the clone with data
        songClone.querySelector('.songimage').src="/assets/img/songs/"+song.image;
        const title = songClone.querySelector('.songtitle');
        const name = document.createElement('a');
        name.textContent = song.title;
        if (song.fairfax) { // this is for songs with characters that aren't in Fredoka
            name.style = "font-family: fairfax;";
        } else if (song.nanpa) { // this is for songs with Toki Pona titles
            name.style = "font-family: nanpa;";
        }
        if (song.title_translation) {
            name.title = song.title_translation;
        }
        title.appendChild(name);
        // these are separated because some song titles are non-English
        // (so they get translations in hover text) but have secondary English
        // that is separate from the non-English
        if (song.subtitle) {
            const subtitle = document.createElement('a');
            subtitle.textContent = " "+song.subtitle;
            title.appendChild(subtitle);
        }
        if (song.artist) {
            title.appendChild(document.createTextNode(" "));
            const i = document.createElement('i');
            const small = document.createElement('small');
            small.textContent = "by ";
            const artist = document.createElement('a');
            artist.textContent = song.artist;
            if (song.artist_translation) {
                artist.title = song.artist_translation;
            }
            small.appendChild(artist);
            i.appendChild(small);
            title.appendChild(i);
        }
        title.appendChild(document.createElement('br'));

        const audio = document.createElement('audio');
        audio.controls = true;
        const source = document.createElement('source');
        source.class = "file";
        source.src = "/assets/audio/"+path+"/"+song.file
        audio.appendChild(source);
        title.appendChild(audio);

        dropdown_content.appendChild(songClone)

        if (song.desc) {
            // replacing style tags until I can figure out how to get Marked working without breaking everything
            // there has to be a better way to do this but whatever
            const desc = song.desc
            .replace("<b>", "*").replace("</b>", "*")
            .replace("<u>", "*").replace("</u>", "*")
            .replace("<i>", "*").replace("</i>", "*");
            desc.split("\n").forEach(line => {
                dropdown_content.appendChild(document.createTextNode(line));
                dropdown_content.appendChild(document.createElement('br'));
            })
            dropdown_content.removeChild(dropdown_content.lastChild);
        }
    })

    // 3. Add the clone to the main container
    album_container.appendChild(album);
  });
}

 document.addEventListener("DOMContentLoaded", function() {
    fillThings();
 })