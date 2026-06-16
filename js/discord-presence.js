import { CONFIG } from './config.js';

let ws = null;
let retryTimeout = 1000;
let heartbeatInterval = null;
let isPageVisible = true;

const elDot = document.querySelector(CONFIG.LANYARD.SELECTORS.DOT);
const elStatus = document.querySelector(CONFIG.LANYARD.SELECTORS.STATUS);

const LABELS = {
    dnd: 'Busy',
    idle: 'Chilling',
    online: 'Nice day',
    offline: 'Sleeping'
};

export function initializeLanyard() {
    if (ws || !elDot || !elStatus || !isPageVisible) return;

    ws = new WebSocket(CONFIG.LANYARD.WS_URL);

    ws.onopen = () => {
        retryTimeout = 1000;
        ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: CONFIG.LANYARD.USER_ID }
        }));
    };

    ws.onmessage = ({ data }) => {
        try {
            const payload = JSON.parse(data);
            const { op, t, d } = payload;

            if (op === 1) {
                heartbeatInterval = setInterval(() => {
                    if (ws?.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 3 }));
                    }
                }, d.heartbeat_interval);
            }

            if ((t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') && d?.discord_status) {
                updateUI(d.discord_status);
            }
        } catch (err) {
            console.warn("Lanyard data corrupted, packet dropped.");
        }
    };

    ws.onerror = () => ws.close();

    ws.onclose = () => {
        cleanup();
        if (isPageVisible) {
            setTimeout(initializeLanyard, retryTimeout);
            retryTimeout = Math.min(retryTimeout * 1.5, 30000);
        }
    };
}

function cleanup() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
    if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws = null;
    }
}

function updateUI(status) {
    elDot.className = "dot";
    elDot.style.backgroundColor = CONFIG.LANYARD.STATUS_COLORS[status] || CONFIG.LANYARD.STATUS_COLORS.offline;
    elStatus.textContent = LABELS[status] || LABELS.offline;
}
document.addEventListener("visibilitychange", () => {
    isPageVisible = document.visibilityState === 'visible';
    if (isPageVisible) {
        initializeLanyard();
        return;
    }
    if (!ws) return;
    const socket = ws;
    cleanup();
    socket.close();
});
