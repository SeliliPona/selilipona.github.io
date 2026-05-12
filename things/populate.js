fetch('./content.json')
.then(response => {
    if (!response.ok) {
    throw new Error('failed to get json; Network response was not ok');
    }
    return response.json();
})
.then(data => createShit(data))
.catch(error => console.error('Error fetching JSON:', error));

function createShit(content, path) {
    const toolcreator = document.getElementById("toolcreator")
    const creatorcreator = document.getElementById("creatorcreator")
    const gamecreator = document.getElementById("gamecreator")
    const animecreator = document.getElementById("animecreator")
    for (const key in content.tools) {
        let tabThing = makeTabThing(content.tools[key], path)
        document.body.insertBefore(tabThing, toolcreator)
        document.body.removeChild(toolcreator);
    }
}
function makeTabThing(tabThing, path) {
    let name = tabThing.name;
    if (tabThing.subtitle != null) {
        name += " <small>" + tabThing.subtitle + "</small>"
    }

    let createElement = document.createElement;

    let newTabThing = createElement("main");

    let newImg = createElement("img");
        addAttribute(newImg, "src", "../assets/img/" + path + "/" + tabThing.image);
        addAttribute(newImg, "class", "thingimage");
    newTabThing.appendChild(newImg)

    let newH1 = createElement("h1");
        addAttribute(newH1, "class", "thingname");
        addAttribute(newH1, "style", "vertical-align: top;")
        newH1.textContent = name;

    let newSpan = createElement("span")
        .appendChild(newH1)
        .append("<br>" + tabThing.description)

    let newDiv = createElement("div")
        .appendChild(newSpan);
        addAttribute(newDiv, "style", "padding-right: 25px; padding-left: 25px");
    newTabThing.appendChild(newDiv);

    let newLinkDiv = createElement("div");
        for (const key in tabThing.links) {
            let newLinkI = createElement("i");
                addAttribute(newLinkI, "class", tabThing.links[key].class);

            let newLinkA = createElement("a")
                .appendChild(newLinkI);
                addAttribute(newLinkA, "class", "thinglink");
                addAttribute(newLinkA, "href", tabThing.links[key].link);
        }
    newTabThing.appendChild(newLinkDiv);

    return newTabThing;
}

function addAttribute(node, name, value) {
    let newAttribute = document.createAttribute(name);
    newAttribute.value = value;
    node.setAttributeNode(newAttribute)
}