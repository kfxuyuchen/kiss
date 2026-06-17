import { onResize } from '../utils.js';

let stars = [];
let ctx, canvas;

export function initBackground() {
    canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    onResize(() => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        stars = Array.from({ length: 280 }, () => ({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            r: Math.random() * 1.8 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.025 + 0.008,
            depth: Math.random(),
        }));
    });

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 渐变背景
    const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
    );
    grad.addColorStop(0, 'rgba(20, 8, 40, 0.4)');
    grad.addColorStop(1, 'rgba(6, 3, 15, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((s) => {
        s.twinkle += s.speed;
        const alpha = 0.15 + s.depth * 0.5 + Math.sin(s.twinkle) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.5 + s.depth), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
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
            img.data[i + 3] = 30;
        }
        gctx.putImageData(img, 0, 0);
    });
}
