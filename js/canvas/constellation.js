import { $, rand, onResize } from '../utils.js';
import { playClickTone } from '../audio/audio.js';

let ctx, canvas;
let points = [];
let links = [];
let dragging = null;
let connectedCount = 0;

const heartShape = [];
for (let t = 0; t < Math.PI * 2; t += 0.28) {
    heartShape.push({
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    });
}

function initPoints() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 45;

    points = heartShape.map((p, i) => ({
        id: i,
        x: cx + p.x * scale * 0.88,
        y: cy + p.y * scale * 0.88,
        lit: false,
        pulse: Math.random() * Math.PI * 2,
    }));
    links = [];
    connectedCount = 0;
    const el = $('starCount');
    if (el) el.textContent = '0';
}

function getStarAt(mx, my) {
    const rect = canvas.getBoundingClientRect();
    const x = mx - rect.left;
    const y = my - rect.top;
    return points.find((s) => Math.hypot(s.x - x, s.y - y) < 20);
}

function linkExists(a, b) {
    return links.some((l) => (l.a === a.id && l.b === b.id) || (l.a === b.id && l.b === a.id));
}

function lightStar(star, burst, x, y) {
    if (star.lit) return;
    star.lit = true;
    connectedCount++;
    $('starCount').textContent = connectedCount;
    burst?.(x, y, 10);
    playClickTone();
}

export function initConstellation(burst) {
    canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    onResize(initPoints);

    canvas.addEventListener('mousedown', (e) => {
        dragging = getStarAt(e.clientX, e.clientY);
        if (dragging) lightStar(dragging, burst, e.clientX, e.clientY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const target = getStarAt(e.clientX, e.clientY);
        if (target && target !== dragging && !linkExists(dragging, target)) {
            links.push({ a: dragging.id, b: target.id });
            lightStar(target, burst, e.clientX, e.clientY);
        }
    });

    canvas.addEventListener('mouseup', () => { dragging = null; });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        dragging = getStarAt(t.clientX, t.clientY);
        if (dragging) lightStar(dragging, burst, t.clientX, t.clientY);
    }, { passive: false });

    canvas.addEventListener('touchend', () => { dragging = null; });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        links.forEach((l) => {
            const a = points[l.a];
            const b = points[l.b];
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, 'rgba(255, 0, 128, 0.55)');
            grad.addColorStop(1, 'rgba(191, 0, 255, 0.45)');
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        points.forEach((s) => {
            s.pulse += 0.035;
            const glow = s.lit ? 0.75 + Math.sin(s.pulse) * 0.25 : 0.35;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.lit ? 7 : 4, 0, Math.PI * 2);
            ctx.fillStyle = s.lit ? `rgba(255, 0, 128, ${glow})` : 'rgba(255,255,255,0.35)';
            if (s.lit) {
                ctx.shadowColor = '#ff0080';
                ctx.shadowBlur = 18;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(draw);
    }
    draw();
}

export function getStarCount() {
    return connectedCount;
}
