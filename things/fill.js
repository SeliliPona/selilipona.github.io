async function fillThings() {
  const response = await fetch('./content.json');
  const items = await response.json();

  const tools = items.tools;
  
  const creators = items.creators;
  
  const games = items.games;
  
  const anime = items.anime;

  const thing_template = document.querySelector('#thing-template');

  function fillFrom(array) {
    const template = document.querySelector('#'+array.template)
    array.contents.forEach(item => {
        // 1. Clone the template
        const clone = template.content.cloneNode(true);

        // 2. Fill the clone with data
        let image = 'thingimage';
        if (array.template == "game-template") {
            image = 'gameimage';
        }
        clone.querySelector('.'+image).src = "/assets/img/"+array.path+"/"+item.image;
        const name = clone.querySelector('.thingname');
        name.textContent = item.name
        if (item.name_translation) {
            name.title = item.name_translation;
        }
        if (item.desc) {
            // replacing style tags until I can figure out how to get Marked working without breaking everything
            // there has to be a better way to do this but whatever
            const desc = item.desc
            .replace("<b>", "*").replace("</b>", "*")
            .replace("<u>", "*").replace("</u>", "*")
            .replace("<i>", "*").replace("</i>", "*");
            const thingdesc = clone.querySelector('.thingdesc')
            desc.split("\n").forEach(line => {
                thingdesc.appendChild(document.createTextNode(line));
                thingdesc.appendChild(document.createElement('br'));
            })
            thingdesc.removeChild(thingdesc.lastChild);
        }
        if (item.links) {
            item.links.forEach(link => {
                const button = document.createElement('a');
                button.classList = "thinglink";
                button.href = link.link;
                const icon = document.createElement('i');
                icon.classList = link.class;
                button.appendChild(icon);
                clone.querySelector('.links').appendChild(button);
            })
        }
        

        // 3. Add the clone to the container
        document.querySelector("#"+array.path).appendChild(clone);
    });
  };

  fillFrom(tools);
  fillFrom(creators);
  fillFrom(games);
  fillFrom(anime);
}

document.addEventListener("DOMContentLoaded", function() {
    fillThings();
})