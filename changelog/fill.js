const load_amount = 10;

let items = [];

let commit_template;
let commit_section_template;
let commit_scope_template;
let commit_container;
let load_commits_button;

let pages = [];

var index = 0;

async function fetchItems() {
	items = (await (await fetch('./content.json')).json()).reverse();
  pages = await (await fetch('../pages.json')).json();

	commit_template = document.getElementById('commit-template');
	commit_section_template = document.getElementById('commit-section-template');
	commit_scope_template = document.getElementById('commit-scope-template');
	commit_container = document.getElementById('commit-holder');
	load_commits_button = document.getElementById('load-commits-button');
}


async function fill() {
	load_commits_button.addEventListener('click', () => {
		addCommits();
	});
	addCommits();
}

async function addCommits() {
	for (let i = 0; i < load_amount; i++) {
		const commit = items[index];
		const clone = commit_template.content.cloneNode(true);

		clone.querySelector('#commit-name').innerHTML = marked.parse(commit.title);
		clone.querySelector('#commit-datetime').innerHTML = marked.parse(`#${items.length - index - 1} – %T(${commit.timestamp})[D MMM YYYY HH:mm:ss]{}`);
		if (commit.desc) {
      const span = document.createElement('span');
      span.classList = 'line';
      span.innerHTML = parse(commit.desc);
      clone.querySelector('#commit-desc').appendChild(span);
		}
		["additions", "changes", "fixes", "removals", "plans"].forEach(sectionName => {
			if (commit[sectionName]) {
        const section = commit[sectionName];
				const commit_section = commit_section_template.content.cloneNode(true);
				commit_section.classList += ` ${sectionName}`;
				const contents = commit_section.querySelector('#commit-section-contents');

				commit_section.querySelector('.divider-text').textContent = sectionName;
        
        ["general", "home", "about", "links", "things", "work", "credits", "changelog", "repository"].forEach(sectionScope => {
          if (section[sectionScope]) {
            const scope = section[sectionScope];
            const commit_scope = commit_scope_template.content.cloneNode(true);
            commit_scope.classList += ` ${sectionScope}`;

            commit_scope.querySelector('#commit-scope-name').textContent = sectionScope;
            const span = document.createElement('span');
            span.classList = 'line';
            span.innerHTML = parse(scope);
            commit_scope.appendChild(span);
            contents.appendChild(commit_scope);
          }
        })
				clone.querySelector('.commit').appendChild(commit_section);
			}
		});
		commit_container.insertBefore(clone, load_commits_button);
		const divider = document.createElement('div');
		divider.classList = 'divider';
		if (i < load_amount - 1 && index < items.length) commit_container.insertBefore(divider, load_commits_button);
		index++
		if (index === items.length) {
			load_commits_button.remove();
			break;
		}
	};
};