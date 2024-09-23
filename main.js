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

function initializeLanyard() {
    const statusColors = {
        online: '#4b8',
        idle: '#fa1',
        dnd: '#f44',
        offline: '#778'
    };

    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    
    ws.addEventListener('open', () => subscribeToUser(ws, '684965357609549842'));
    ws.addEventListener('error', handleError);
    ws.addEventListener('close', handleReconnect);
    ws.addEventListener('message', ({ data }) => handlePresenceUpdate(data, statusColors));
}


function subscribeToUser(ws, userId) {
    const subscribeMessage = JSON.stringify({
        op: 2,
        d: { subscribe_to_id: userId }
    });
    ws.send(subscribeMessage);
}


function handleError() {
    console.error('WebSocket encountered an error. Closing connection.');
    this.close();
}


function handleReconnect() {
    setTimeout(initializeLanyard, 1000); 
}


function handlePresenceUpdate(data, statusColors) {
    const { t, d } = JSON.parse(data);

    
    if (t !== 'INIT_STATE' && t !== 'PRESENCE_UPDATE') return;

    
    updateElementStyle('#dot', 'backgroundColor', statusColors[d.discord_status]);

   
    const capitalizedStatus = capitalizeFirstLetter(d.discord_status);
    updateElementText('#status', capitalizedStatus);
}


function updateElementText(selector, text) {
    const element = document.querySelector(selector);
    if (!element) return;

    
    if (stateMap.get(selector) !== text) {
        element.textContent = text;
        stateMap.set(selector, text); 
    }
}


function updateElementStyle(selector, property, value) {
    const element = document.querySelector(selector);
    if (!element) return;

    
    if (stateMap.get(selector) !== value) {
        element.style[property] = value;
        stateMap.set(selector, value);
    }
}

function capitalizeFirstLetter(str) {
    if (str.toLowerCase() === 'dnd') return '\u{1F4BB} Learning or Working';
    return str.charAt(0).toUpperCase() + str.slice(1);
}


initializeLanyard();
