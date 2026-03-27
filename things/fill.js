async function fillThings() {
  const response = await fetch('./content.json');
  const items = await response.json();

  const thing_template = document.querySelector('#thing-template');

  const tools = items.tools;
  const tool_container = document.querySelector('#tools');

  const creators = items.creators;
  const creator_container = document.querySelector('#creators');
  
  const games = items.games;
  const game_container = document.querySelector('#games');
  const game_template = document.querySelector('#game-template');

  const anime = items.anime;
  const anime_container = document.querySelector('#anime');

  tools.forEach(item => {
    // 1. Clone the template
    const clone = thing_template.content.cloneNode(true);

    // 2. Fill the clone with data
    clone.querySelector('.thingimage').src = "/assets/img/tools/"+item.image;

    const desc = clone.querySelector('.thingdesc');
    if (item.desc) {
        let lines = item.desc.split("\n");
        lines.forEach(line => {
            desc.appendChild(document.createTextNode(line));
            desc.appendChild(document.createElement('br'));
        })
        desc.removeChild(desc.lastChild);
    }
    const title = clone.querySelector('.thingname');
    title.textContent = item.title;
    if (item.title_translation) {
        title.title = item.title_translation;
    }
    if (item.subtitle) {
        title.textContent += " ";
        const small = document.createElement('small');
        small.textContent = item.subtitle;
        const i = document.createElement('i');
        i.appendChild(small)
        title.appendChild(i);
    }
    if (item.links) {
        let links = clone.querySelector('.links');
        item.links.forEach(link => {
            let linkbtn = document.createElement('a');
            linkbtn.className = "thinglink";
            linkbtn.href = link.link;
            let icon = document.createElement('i');
            icon.className = link.class;
            linkbtn.appendChild(icon);
            links.appendChild(linkbtn);
        })
    }

    // 3. Add the clone to the CURRENT row, not the main container
    tool_container.appendChild(clone);
  });

  creators.forEach(item => {
    // 1. Clone the template
    const clone = thing_template.content.cloneNode(true);

    // 2. Fill the clone with data
    clone.querySelector('.thingimage').src = "/assets/img/creators/"+item.image;

    const desc = clone.querySelector('.thingdesc');
    if (item.desc) {
        let lines = item.desc.split("\n");
        lines.forEach(line => {
            desc.appendChild(document.createTextNode(line));
            desc.appendChild(document.createElement('br'));
        })
        desc.removeChild(desc.lastChild);
    }
    const title = clone.querySelector('.thingname');
    title.textContent = item.title;
    if (item.title_translation) {
        title.title = item.title_translation;
    }
    if (item.subtitle) {
        title.textContent += " ";
        const small = document.createElement('small');
        small.textContent = item.subtitle;
        const i = document.createElement('i');
        i.appendChild(small)
        title.appendChild(i);
    }
    if (item.links) {
        let links = clone.querySelector('.links');
        item.links.forEach(link => {
            let linkbtn = document.createElement('a');
            linkbtn.className = "thinglink";
            linkbtn.href = link.link;
            let icon = document.createElement('i');
            icon.className = link.class;
            linkbtn.appendChild(icon);
            links.appendChild(linkbtn);
        })
    }

    // 3. Add the clone to the CURRENT row, not the main container
    creator_container.appendChild(clone);
  });
  
  games.forEach(item => {
    // 1. Clone the template
    const clone = game_template.content.cloneNode(true);

    // 2. Fill the clone with data
    clone.querySelector('.gameimage').src = "/assets/img/games/"+item.image;

    const desc = clone.querySelector('.thingdesc');
    if (item.desc) {
        let lines = item.desc.split("\n");
        lines.forEach(line => {
            desc.appendChild(document.createTextNode(line));
            desc.appendChild(document.createElement('br'));
        })
        desc.removeChild(desc.lastChild);
    }
    const title = clone.querySelector('.thingname');
    title.textContent = item.title;
    if (item.title_translation) {
        title.title = item.title_translation;
    }
    if (item.subtitle) {
        title.textContent += " ";
        const small = document.createElement('small');
        small.textContent = item.subtitle;
        const i = document.createElement('i');
        i.appendChild(small)
        title.appendChild(i);
    }
    if (item.links) {
        let links = clone.querySelector('.links');
        item.links.forEach(link => {
            let linkbtn = document.createElement('a');
            linkbtn.className = "thinglink";
            linkbtn.href = link.link;
            let icon = document.createElement('i');
            icon.className = link.class;
            linkbtn.appendChild(icon);
            links.appendChild(linkbtn);
        })
    }

    // 3. Add the clone to the CURRENT row, not the main container
    game_container.appendChild(clone);
  });
  
  anime.forEach(item => {
    // 1. Clone the template
    const clone = game_template.content.cloneNode(true);

    // 2. Fill the clone with data
    clone.querySelector('.gameimage').src = "/assets/img/anime/"+item.image;

    const desc = clone.querySelector('.thingdesc');
    if (item.desc) {
        let lines = item.desc.split("\n");
        lines.forEach(line => {
            desc.appendChild(document.createTextNode(line));
            desc.appendChild(document.createElement('br'));
        })
        desc.removeChild(desc.lastChild);
    }
    const title = clone.querySelector('.thingname');
    title.textContent = item.title;
    if (item.title_translation) {
        title.title = item.title_translation;
    }
    if (item.subtitle) {
        title.textContent += " ";
        const small = document.createElement('small');
        small.textContent = item.subtitle;
        const i = document.createElement('i');
        i.appendChild(small)
        title.appendChild(i);
    }
    if (item.links) {
        let links = clone.querySelector('.links');
        item.links.forEach(link => {
            let linkbtn = document.createElement('a');
            linkbtn.className = "thinglink";
            linkbtn.href = link.link;
            let icon = document.createElement('i');
            icon.className = link.class;
            linkbtn.appendChild(icon);
            links.appendChild(linkbtn);
        })
    }

    // 3. Add the clone to the CURRENT row, not the main container
    anime_container.appendChild(clone);
  });
}

 document.addEventListener("DOMContentLoaded", function() {
    fillThings();
 })