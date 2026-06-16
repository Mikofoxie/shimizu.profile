# SHIMIZU.PROFILE

## NAME

**shimizu.profile** — personal link-in-bio page with live Discord presence

## SYNOPSIS

```
index.html
```

## DESCRIPTION

Static single-page profile site. Zero build step, zero framework, zero dependencies.

Displays social links and real-time Discord status via **Lanyard WebSocket API**.

Features GPU-accelerated CSS animations (bubble particles, parallax background drift),
responsive layout with mobile-specific optimizations, and adaptive touch/hover UX.

## FILES

```
.
├── index.html                 main document, inline css
├── js/
│   ├── config.js              lanyard ws config, status color map
│   ├── discord-presence.js    websocket client, presence ui updates
│   └── main.js                entry point, avatar loader, animation control
└── assets/img/
    ├── background.webp        fullscreen background (208kb)
    ├── Shimizu_pfp.webp       avatar 2x (21kb)
    ├── Shimizu_pfp_224.webp   avatar 1x (13kb)
    ├── *.svg                  social platform icons
    └── favicon.ico            site icon
```

## DEPENDENCIES

None. Vanilla HTML/CSS/JS only.

**External services:**

- `api.lanyard.rest` — Discord presence via WebSocket
- `fonts.googleapis.com` — Open Sans 400/700

## ENVIRONMENT

Runs in any modern browser. No server-side logic required.

Serve with any static file server or open `index.html` directly.

## DEPLOYMENT

Hosted via **GitHub Pages** from the `master` branch.

```sh
git push origin master
```

## BUGS

Report issues at https://github.com/Mikofoxie/shimizu.profile/issues

## AUTHOR

**Caelith** (Shimizu) — <https://x.com/caelithimyc>

## LICENSE

Unlicensed. All rights reserved.
