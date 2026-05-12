let items = [];

async function fetchItems() {
  const response = await fetch('./content.json');
  items = await response.json();
}

async function fill() {
  items.forEach(block => {
    const main = document.createElement('main');
    main.classList = 'paragraph';
    main.innerHTML = marked.parse(block.join("\n"));
    document.body.insertBefore(main, document.querySelector('.footer'))
  });
}