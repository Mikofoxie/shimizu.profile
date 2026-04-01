export const CONFIG = {
    LANYARD: {
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
    }
};

export const PROFILE_LINKS = [
    {
        name: "Twitter",
        url: "https://x.com/caelithimyc",
        icon: "./assets/img/x-logo.svg"
    },
    {
        name: "Youtube",
        url: "https://www.youtube.com/@caelithimyc",
        icon: "./assets/img/youtube.svg"
    },
    {
        name: "Telegram",
        url: "https://t.me/caelithimyc",
        icon: "./assets/img/telegram.svg"
    },
    {
        name: "Discord",
        url: "https://discordapp.com/users/684965357609549842",
        icon: "./assets/img/discord.svg"
    }
];
