import { PROFILE_LINKS } from './config.js';
import { initializeLanyard } from './discord-presence.js';

document.addEventListener('DOMContentLoaded', () => {
    const c = document.getElementById('links-container');
    if (c) {
        c.innerHTML = PROFILE_LINKS.map(l =>
            `<li><a href="${l.url}"><img src="${l.icon}" alt="${l.name}"/> ${l.name}</a></li>`
        ).join('');
    }
    initializeLanyard();
});
