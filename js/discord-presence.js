import { CONFIG } from './config.js';

let ws;
let retryTimeout = 1000;

export function initializeLanyard() {
    if (ws) return;

    ws = new WebSocket(CONFIG.LANYARD.WS_URL);

    ws.onopen = () => {
        retryTimeout = 1000;
        ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: CONFIG.LANYARD.USER_ID }
        }));
    };

    ws.onmessage = ({ data }) => {
        const { t, d } = JSON.parse(data);
        if ((t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') && d?.discord_status) {
            updateUI(d.discord_status);
        }
    };

    ws.onerror = () => ws.close();

    ws.onclose = () => {
        ws = null;
        setTimeout(initializeLanyard, retryTimeout);
        retryTimeout = Math.min(retryTimeout * 1.5, 30000);
    };
}

function updateUI(status) {
    const elDot = document.querySelector(CONFIG.LANYARD.SELECTORS.DOT);
    const elStatus = document.querySelector(CONFIG.LANYARD.SELECTORS.STATUS);

    if (!elDot || !elStatus) return;

    elDot.classList.remove('loading');

    const LABELS = {
        dnd: 'Busy',
        idle: 'Chilling',
        online: 'Nice day',
        offline: 'Sleeping'
    };
    const label = LABELS[status] || LABELS.offline;

    elDot.style.backgroundColor = CONFIG.LANYARD.STATUS_COLORS[status] || CONFIG.LANYARD.STATUS_COLORS.offline;
    elStatus.textContent = label;
}
