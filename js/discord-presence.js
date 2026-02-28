import { CONFIG } from './config.js';

let ws;

export function initializeLanyard() {
    if (ws) return;

    ws = new WebSocket(CONFIG.LANYARD.WS_URL);

    ws.onopen = () => {
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
        setTimeout(initializeLanyard, CONFIG.LANYARD.RETRY_TIMEOUT);
    };
}

function updateUI(status) {
    const elDot = document.querySelector(CONFIG.LANYARD.SELECTORS.DOT);
    const elStatus = document.querySelector(CONFIG.LANYARD.SELECTORS.STATUS);

    if (!elDot || !elStatus) return;

    elDot.classList.remove('loading');

    const label = status === 'dnd' ? 'Busy'
        : status === 'idle' ? 'Chilling'
            : status === 'online' ? 'Nice day'
                : 'Sleeping';

    elDot.style.backgroundColor = CONFIG.LANYARD.STATUS_COLORS[status] || CONFIG.LANYARD.STATUS_COLORS.offline;
    elStatus.textContent = label;
}
