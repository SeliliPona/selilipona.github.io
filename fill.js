/*
    legend for pages.json (in LuaCATS format):
    
    @class buttons button[]

    @class button
    @field sitelen string # Toki Pona title of the page in Sitelen Pona
    @field roman string # romanized Toki Pona title of the page
    @field trans string # direct translation of Toki Pona title
    @field english string # English title of the page
    @field desc string # short description of the page
    @field link string # subpage to link to, relative to https://selilipona.github.io
*/

let items = [];

async function fetchItems() {
    const response = await fetch('pages.json');
    items = await response.json();
}

async function fill() {
    const button_container = document.querySelector('#button-container');
    const button_template = document.querySelector('#button-template');

    items.forEach((button) => {
        if (button.link === "") {
            return;
        }
        // 1. Clone the template
        const clone = button_template.content.cloneNode(true);

        // 2. Fill the clone with data
        const span = clone.querySelector('.tl');
        span.setAttribute('data-roman', button.roman);
        span.setAttribute('data-trans', button.trans);
        
        const h1 = clone.querySelector('#title'); // Select directly from clone
        h1.textContent = button.sitelen;

        clone.querySelector('.subtitle').textContent = button.english;
        clone.querySelector('.stretched-link').href = "/" + button.link;
        
        // 3. Append DIRECTLY to the container, not a row
        button_container.appendChild(clone);
    });
}