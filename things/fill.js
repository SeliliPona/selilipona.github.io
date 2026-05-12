let items = [];

async function fetchItems() {
  const response = await fetch('./content.json');
  items = await response.json();
}

async function fill() {
  const tools = items.tools;
  
  const creators = items.creators;
  
  const games = items.games;
  
  const anime = items.anime;

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
        
        const title = document.createElement('h1');
        if (item.name_tl) {
            const name = tlDfn(item.name_tl);
            name.textContent = item.name
            if (item.name_nanpa) name.style = 'font-family: nanpa';
            title.appendChild(name);
        } else title.append(document.createTextNode(item.name));
        title.classList = 'thingname';
        title.style = 'vertical-align: top;';
        if (item.creator) {
            title.append(document.createTextNode(" "));
            const small = document.createElement('small');
            small.classList = 'creator';
            small.textContent = "by ";
            if (item.creator_tl) {
                const creator = tlDfn(item.creator_tl);
                creator.textContent = item.creator;
                if (item.creator_nanpa) creator.style = 'font-family: nanpa';
                small.appendChild(creator)
            } else small.append(document.createTextNode(item.creator));
            title.appendChild(small);
        }
        clone.querySelector('.thingdesc').appendChild(title);
        if (item.desc) {
            const desc = document.createElement('p');
            desc.innerHTML = marked.parse(item.desc.join("\n"));
            clone.querySelector('.thingdesc').appendChild(desc);
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