let items = [];

async function fetchItems() {
  const response = await fetch('./content.json');
  items = await response.json();
}

async function fill() {
  const template = document.getElementById('link-template');
  
  items.forEach(group => {
    group.forEach(item => {
        // 1. Clone the template
        const clone = template.content.cloneNode(true);

        // 2. Fill the clone with data
        const icon = clone.querySelector('#visual').appendChild(document.createElement('i'));
        icon.classList = item.icon;

        const title = document.createTextNode(" "+item.name);
        clone.querySelector('#visual').append(title);

        clone.querySelector('.link').href = item.link;
        

        // 3. Add the clone to the container
        document.body.insertBefore(clone, document.querySelector('.footer'))
    });
    document.body.insertBefore(document.createElement('br'), document.querySelector('.footer'))
  })
  document.body.lastChild.remove()
}