import { lerp } from '../utils.js';

export function initCursor() {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cursor || !ring || window.matchMedia('(max-width: 768px)').matches) return;

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = `${mx}px`;
        cursor.style.top = `${my}px`;
    });

    (function tick() {
        rx = lerp(rx, mx, 0.12);
        ry = lerp(ry, my, 0.12);
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
        requestAnimationFrame(tick);
    })();

    const hoverTargets = 'button, .memory-card, canvas, .btn, .nav-dot';
    document.querySelectorAll(hoverTargets).forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });
}

export function initPreloader() {
    const loader = document.getElementById('preloader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 1600);
    });
}
