let items = [];

async function fetchItems() {
  const response = await fetch('./content.json');
  items = await response.json();
}

async function fill() {
  items.forEach(block => {
    const main = document.createElement('main');
    main.classList = 'paragraph';
    block.forEach(line => {
        // let line = l;
        if (typeof line == "object") {
            // console.log("found group: "+l)
            line = line.join("\n");
        }
        const span = document.createElement('span');
        span.classList = 'line';
        span.innerHTML = marked.parse(line);
        main.appendChild(span);
    })
    // main.innerHTML = marked.parse(block.join("\n"));
    document.body.insertBefore(main, document.querySelector('.footer'))
  });
}