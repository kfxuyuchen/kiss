import { onResize } from '../utils.js';

let stars = [];
let ctx, canvas;
let meshPhase = 0;

export function initBackground() {
    canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    onResize(() => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        stars = Array.from({ length: 300 }, () => ({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            r: Math.random() * 2 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.03 + 0.008,
            depth: Math.random(),
            hue: Math.random() > 0.7 ? (Math.random() > 0.5 ? 320 : 185) : 0,
        }));
    });

    draw();
}

function drawMesh() {
    meshPhase += 0.004;
    const w = canvas.width;
    const h = canvas.height;

    const blobs = [
        { x: 0.2 + Math.sin(meshPhase) * 0.08, y: 0.3, c: '255,0,128', r: 0.45 },
        { x: 0.8 + Math.cos(meshPhase * 0.7) * 0.06, y: 0.6, c: '0,245,255', r: 0.4 },
        { x: 0.5 + Math.sin(meshPhase * 0.5) * 0.1, y: 0.8, c: '191,0,255', r: 0.35 },
    ];

    blobs.forEach((b) => {
        const grad = ctx.createRadialGradient(
            w * b.x, h * b.y, 0,
            w * b.x, h * b.y, w * b.r
        );
        grad.addColorStop(0, `rgba(${b.c}, 0.12)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    });
}

function draw() {
    ctx.fillStyle = '#030014';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMesh();

    stars.forEach((s) => {
        s.twinkle += s.speed;
        const alpha = 0.12 + s.depth * 0.55 + Math.sin(s.twinkle) * 0.28;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.5 + s.depth), 0, Math.PI * 2);
        if (s.hue) {
            ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${alpha})`;
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 6;
        } else {
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
}

export function initGrain() {
    const grain = document.getElementById('grainCanvas');
    if (!grain) return;
    const gctx = grain.getContext('2d');

    onResize(() => {
        grain.width = innerWidth;
        grain.height = innerHeight;
        const img = gctx.createImageData(grain.width, grain.height);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 255;
            img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
            img.data[i + 3] = 28;
        }
        gctx.putImageData(img, 0, 0);
    });
}
