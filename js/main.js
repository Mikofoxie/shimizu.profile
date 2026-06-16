import { initializeLanyard } from './discord-presence.js';

const initAvatarLoader = () => {
    const pfp = document.getElementById('pfp');
    if (!pfp) return;

    const removeLoader = () => pfp.classList.remove('pfp-loading');
    
    if (pfp.complete) {
        removeLoader();
        return;
    }
    
    pfp.addEventListener('load', removeLoader, { once: true });
    pfp.addEventListener('error', removeLoader, { once: true });
};

const initAnimationControl = () => {
    const bubbles = document.querySelector('.bubbles');
    if (!bubbles) return;

    document.addEventListener('visibilitychange', () => {
        bubbles.classList.toggle('paused', document.hidden);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initializeLanyard();
    initAvatarLoader();
    initAnimationControl();
});
