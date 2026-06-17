import { rand, onResize } from '../utils.js';
import { playClickTone } from '../audio/audio.js';

let ctx, canvas;
let car = { x: 0, y: 0, driving: false, speed: 0, headlight: 0 };
let houseWindows = [false, false, false, false, false, false];
let houseGlow = 0;
let roadY = 0;
let active = false;
let exhaust = [];
let buildings = [];

const COLORS = {
    pink: '#ff0080',
    cyan: '#00f5ff',
    purple: '#bf00ff',
};

export function initDreamScene(burst) {
    canvas = document.getElementById('dreamCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    onResize(resetScene);

    const obs = new IntersectionObserver(
        ([e]) => { active = e.isIntersecting; },
        { threshold: 0.25 }
    );
    const section = document.getElementById('dream');
    if (section) obs.observe(section);

    canvas.addEventListener('click', (e) => handleClick(e.clientX, e.clientY, burst));
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        handleClick(t.clientX, t.clientY, burst);
    }, { passive: false });

    document.getElementById('driveBtn')?.addEventListener('click', () => startDriving(burst));

    draw();
}

function resetScene() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    roadY = canvas.height * 0.78;
    car.x = canvas.width * 0.08;
    car.y = roadY - 18;
    car.driving = false;
    car.speed = 0;
    buildings = Array.from({ length: 10 }, (_, i) => ({
        x: (canvas.width / 10) * i + rand(-8, 8),
        w: rand(28, 55),
        h: rand(25, 90),
        lit: Math.random() > 0.4,
    }));
}

function startDriving(burst) {
    if (car.driving) return;
    car.driving = true;
    car.speed = 2.2;
    playClickTone();
    const rect = canvas.getBoundingClientRect();
    burst(rect.left + canvas.width * 0.15, rect.top + roadY, 12);
}

function handleClick(mx, my, burst) {
    const rect = canvas.getBoundingClientRect();
    const x = mx - rect.left;
    const y = my - rect.top;
    const hw = canvas.width * 0.38;
    const hx = canvas.width * 0.56;
    const hy = roadY - canvas.height * 0.52;

    // 点击汽车区域
    if (x >= car.x - 20 && x <= car.x + 90 && y >= car.y - 40 && y <= car.y + 20) {
        startDriving(burst);
        return;
    }

    // 点击房子区域
    if (x >= hx - 10 && x <= hx + hw + 10 && y >= hy - 20 && y <= roadY) {
        houseWindows = houseWindows.map(() => true);
        houseGlow = 1;
        playClickTone();
        burst(mx, my, 25);
        document.getElementById('dreamHint').textContent = '🏠 我们的家，亮灯啦！';
        return;
    }

    burst(mx, my, 8);
}

function drawRoad(w) {
    ctx.fillStyle = 'rgba(15, 5, 35, 0.9)';
    ctx.fillRect(0, roadY - 4, w, canvas.height - roadY + 20);

    ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.shadowColor = COLORS.cyan;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, roadY + 18);
    ctx.lineTo(w, roadY + 18);
    ctx.stroke();

    // 虚线
    ctx.strokeStyle = 'rgba(255, 0, 128, 0.5)';
    ctx.setLineDash([20, 16]);
    ctx.beginPath();
    ctx.moveTo(0, roadY + 18);
    ctx.lineTo(w, roadY + 18);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
}

function drawHouse() {
    const hw = canvas.width * 0.38;
    const hh = canvas.height * 0.48;
    const hx = canvas.width * 0.56;
    const hy = roadY - hh + 10;
    const glow = houseGlow * (0.6 + Math.sin(Date.now() * 0.003) * 0.15);

    // 地基光晕
    if (houseGlow > 0) {
        const g = ctx.createRadialGradient(hx + hw / 2, roadY, 0, hx + hw / 2, roadY, hw * 0.8);
        g.addColorStop(0, `rgba(255,0,128,${glow * 0.25})`);
        g.addColorStop(0.5, `rgba(0,245,255,${glow * 0.12})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(hx - 40, hy, hw + 80, hh + 60);
    }

    // 墙体
    ctx.fillStyle = 'rgba(20, 8, 45, 0.95)';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.shadowColor = COLORS.cyan;
    ctx.shadowBlur = houseGlow ? 20 : 10;
    ctx.fillRect(hx, hy + hh * 0.22, hw, hh * 0.78);
    ctx.strokeRect(hx, hy + hh * 0.22, hw, hh * 0.78);

    // 屋顶
    ctx.fillStyle = 'rgba(30, 10, 60, 0.95)';
    ctx.strokeStyle = COLORS.pink;
    ctx.beginPath();
    ctx.moveTo(hx - 12, hy + hh * 0.22);
    ctx.lineTo(hx + hw / 2, hy);
    ctx.lineTo(hx + hw + 12, hy + hh * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 窗户 2x3
    const winW = hw * 0.18;
    const winH = hh * 0.14;
    const cols = 3;
    const rows = 2;
    let wi = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const wx = hx + hw * 0.12 + c * (winW + hw * 0.1);
            const wy = hy + hh * 0.32 + r * (winH + hh * 0.1);
            const lit = houseWindows[wi];
            ctx.fillStyle = lit ? 'rgba(0,245,255,0.85)' : 'rgba(10,5,30,0.9)';
            ctx.strokeStyle = lit ? COLORS.cyan : 'rgba(191,0,255,0.4)';
            ctx.shadowColor = lit ? COLORS.cyan : 'transparent';
            ctx.shadowBlur = lit ? 15 : 0;
            ctx.fillRect(wx, wy, winW, winH);
            ctx.strokeRect(wx, wy, winW, winH);
            if (lit) {
                ctx.fillStyle = 'rgba(255,0,128,0.3)';
                ctx.fillRect(wx + 2, wy + 2, winW - 4, winH - 4);
            }
            wi++;
        }
    }

    // 大门
    const doorW = hw * 0.22;
    const doorH = hh * 0.28;
    const doorX = hx + hw / 2 - doorW / 2;
    const doorY = roadY - doorH;
    ctx.fillStyle = 'rgba(15, 5, 35, 0.95)';
    ctx.strokeStyle = COLORS.pink;
    ctx.shadowColor = COLORS.pink;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(doorX + doorW / 2, doorY, doorW / 2, Math.PI, 0);
    ctx.lineTo(doorX + doorW, doorY + doorH);
    ctx.lineTo(doorX, doorY + doorH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 门上心形
    ctx.shadowBlur = 18;
    ctx.fillStyle = COLORS.pink;
    drawHeart(doorX + doorW / 2, doorY + doorH * 0.55, 10);

    // 烟囱
    ctx.fillStyle = 'rgba(25, 10, 50, 0.95)';
    ctx.strokeStyle = COLORS.purple;
    ctx.shadowColor = COLORS.purple;
    ctx.shadowBlur = 8;
    ctx.fillRect(hx + hw * 0.75, hy + hh * 0.05, hw * 0.1, hh * 0.2);
    ctx.strokeRect(hx + hw * 0.75, hy + hh * 0.05, hw * 0.1, hh * 0.2);

    ctx.shadowBlur = 0;

    return { hx, hy, hw, hh };
}

function drawHeart(cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.3);
    ctx.bezierCurveTo(cx - s * 0.5, cy - s * 0.3, cx - s, cy + s * 0.1, cx, cy + s);
    ctx.bezierCurveTo(cx + s, cy + s * 0.1, cx + s * 0.5, cy - s * 0.3, cx, cy + s * 0.3);
    ctx.fill();
}

function drawCar() {
    const w = 72;
    const h = 32;
    const x = car.x;
    const y = car.y;

    // 车影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, roadY + 14, w * 0.45, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 排气粒子
    if (car.driving && Math.random() < 0.3) {
        exhaust.push({ x: x - 5, y: y + 14, life: 0, max: 25 });
    }
    exhaust.forEach((p) => {
        const a = 1 - p.life / p.max;
        ctx.beginPath();
        ctx.arc(p.x - p.life * 0.5, p.y, 4 * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,255,${a * 0.4})`;
        ctx.fill();
        p.life++;
    });
    exhaust = exhaust.filter((p) => p.life < p.max);

    // 车身
    ctx.fillStyle = 'rgba(15, 5, 35, 0.95)';
    ctx.strokeStyle = COLORS.pink;
    ctx.lineWidth = 2;
    ctx.shadowColor = COLORS.pink;
    ctx.shadowBlur = car.driving ? 18 : 10;

    ctx.beginPath();
    ctx.roundRect(x, y + 8, w, h - 8, 6);
    ctx.fill();
    ctx.stroke();

    // 车顶
    ctx.fillStyle = 'rgba(25, 10, 55, 0.95)';
    ctx.strokeStyle = COLORS.cyan;
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 8);
    ctx.lineTo(x + 26, y - 2);
    ctx.lineTo(x + 52, y - 2);
    ctx.lineTo(x + 58, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 车窗
    ctx.fillStyle = 'rgba(0,245,255,0.25)';
    ctx.fillRect(x + 28, y + 2, 22, 10);

    // 车轮
    ctx.shadowBlur = 0;
    [x + 16, x + 52].forEach((wx) => {
        ctx.fillStyle = '#111';
        ctx.strokeStyle = COLORS.cyan;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wx, y + h, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (car.driving) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.moveTo(wx, y + h);
            ctx.lineTo(wx + Math.cos(Date.now() * 0.02) * 6, y + h + Math.sin(Date.now() * 0.02) * 6);
            ctx.stroke();
        }
    });

    // 车灯
    car.headlight = car.driving ? 0.8 + Math.sin(Date.now() * 0.01) * 0.2 : 0.3;
    const beam = ctx.createLinearGradient(x + w, y + 16, x + w + 80, y + 16);
    beam.addColorStop(0, `rgba(0,245,255,${car.headlight * 0.6})`);
    beam.addColorStop(1, 'rgba(0,245,255,0)');
    ctx.fillStyle = beam;
    if (car.driving) ctx.fillRect(x + w - 2, y + 10, 80, 14);

    ctx.fillStyle = COLORS.cyan;
    ctx.shadowColor = COLORS.cyan;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x + w - 2, y + 18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function updateCar() {
    if (!car.driving) return;

    const targetX = canvas.width * 0.42;
    car.x += car.speed;

    if (car.x >= targetX) {
        car.x = targetX;
        car.driving = false;
        car.speed = 0;
        document.getElementById('dreamHint').textContent = '🚗 到家啦！点击大房子点亮灯光';
    }
}

function drawSkyline() {
    buildings.forEach((b) => {
        ctx.fillStyle = 'rgba(10, 3, 30, 0.6)';
        ctx.fillRect(b.x, roadY - b.h - 20, b.w, b.h);
        if (b.lit) {
            ctx.fillStyle = `rgba(255,0,128,${0.2 + Math.sin(Date.now() * 0.002 + b.x) * 0.15})`;
            ctx.fillRect(b.x + 5, roadY - b.h + 5, 5, 5);
        }
    });
}

function draw() {
    if (!canvas || !ctx) return requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 场景背景
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, 'rgba(3,0,20,0.95)');
    bg.addColorStop(0.5, 'rgba(8,0,40,0.9)');
    bg.addColorStop(1, 'rgba(15,0,50,0.85)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSkyline();
    drawRoad(canvas.width);
    drawHouse();
    updateCar();
    drawCar();

    if (active && !car.driving && car.x < canvas.width * 0.15) {
        // 提示箭头
        ctx.fillStyle = `rgba(255,0,128,${0.5 + Math.sin(Date.now() * 0.005) * 0.3})`;
        ctx.font = '14px sans-serif';
        ctx.fillText('👆 点我出发', car.x, car.y - 20);
    }

    requestAnimationFrame(draw);
}

export function resetDreamScene() {
    resetScene();
    houseWindows = houseWindows.map(() => false);
    houseGlow = 0;
}
