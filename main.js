setTimeout(() => {
    const main = document.querySelector('.main')
    main.style.opacity = 1
    main.style.filter = 'blur(0)'
}, 1000)

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart', e => e.preventDefault())
})


const stateMap = new Map();


const CONFIG = {
    WS_URL: 'wss://api.lanyard.rest/socket',
    USER_ID: '684965357609549842',
    RETRY_TIMEOUT: 1000,
    SELECTORS: {
        DOT: '#dot',
        STATUS: '#status'
    },
    STATUS_COLORS: {
        online: '#4b8',
        idle: '#fa1',
        dnd: '#f44',
        offline: '#778'
    }
};


function initializeWebSocket() {
    const ws = new WebSocket(CONFIG.WS_URL);
    
    ws.addEventListener('open', () => subscribeToUser(ws, CONFIG.USER_ID));
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('error', handleError);
    ws.addEventListener('close', handleReconnect);
    
    return ws;
}

function subscribeToUser(ws, userId) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userId }
        }));
    }
}


function handleMessage({ data }) {
    try {
        const parsedData = JSON.parse(data);
        
        if (!isValidPresenceData(parsedData)) return;
        
        updatePresenceUI(parsedData.d);
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

function handleError(error) {
    console.error('WebSocket error:', error);
    this.close();
}

function handleReconnect() {
    console.log('Attempting to reconnect...');
    setTimeout(initializeWebSocket, CONFIG.RETRY_TIMEOUT);
}


function isValidPresenceData({ t, d }) {
    return (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') && 
           d && 
           typeof d.discord_status === 'string';
}


function updatePresenceUI(data) {
    const status = formatStatus(data.discord_status);
    const color = CONFIG.STATUS_COLORS[data.discord_status];

    updateElementStyle(CONFIG.SELECTORS.DOT, 'backgroundColor', color);
    updateElementText(CONFIG.SELECTORS.STATUS, status);
}

function updateElementStyle(selector, property, value) {
    const element = document.querySelector(selector);
    if (!element || stateMap.get(`${selector}-${property}`) === value) return;

    element.style[property] = value;
    stateMap.set(`${selector}-${property}`, value);
}

function updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (!element || stateMap.get(selector) === text) return;

    element.textContent = text;
    stateMap.set(selector, text);
}

function formatStatus(status) {
    let setStatus = status.toLowerCase()

    return setStatus === 'dnd' ? 'Busy' : 
           setStatus === 'idle' ? 'Chilling' : 
           setStatus === 'online' ? 'Nice day' : capitalizeFirstLetter(status);
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function initializeLanyard() {
    try {
        initializeWebSocket();
    } catch (error) {
        console.error('Failed to initialize Lanyard:', error);
        setTimeout(initializeLanyard, CONFIG.RETRY_TIMEOUT);
    }
}

initializeLanyard();