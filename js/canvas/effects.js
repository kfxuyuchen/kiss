import { rand, onResize } from '../utils.js';

let ctx, canvas;
let particles = [];
let roses = [];
let fireworks = [];

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = rand(-5, 5);
        this.vy = rand(-5, 5);
        this.size = rand(2, 5);
        this.hue = hue ?? rand(320, 360);
        this.life = 0;
        this.maxLife = rand(45, 85);
        this.gravity = 0.06;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.life++;
        return this.life < this.maxLife;
    }
    draw() {
        const a = 1 - this.life / this.maxLife;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${a})`;
        ctx.fill();
    }
}

class Rose {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size ?? rand(25, 48);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = rand(-0.02, 0.02);
        this.hue = rand(328, 360);
        this.life = 0;
        this.maxLife = 320;
        this.petals = Math.floor(rand(6, 10));
    }
    update() {
        this.life++;
        this.rotation += this.rotSpeed;
        return this.life < this.maxLife;
    }
    draw() {
        const p = this.life / this.maxLife;
        const fadeIn = Math.min(p * 8, 1);
        const fadeOut = p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
        const sz = this.size * (0.4 + p * 0.6) * fadeIn * fadeOut;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.45)`;
        ctx.shadowBlur = 22;

        for (let i = 0; i < this.petals; i++) {
            const angle = (i * Math.PI * 2) / this.petals;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let t = 0; t <= Math.PI; t += 0.12) {
                const r = sz * (0.2 + 0.8 * Math.sin(t * 2.5));
                ctx.lineTo(Math.cos(t + angle) * r, Math.sin(t + angle) * r * 0.6);
            }
            ctx.closePath();
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sz);
            g.addColorStop(0, `hsla(${this.hue}, 90%, 55%, 0.9)`);
            g.addColorStop(1, `hsla(${this.hue}, 70%, 35%, 0.15)`);
            ctx.fillStyle = g;
            ctx.fill();
        }
        ctx.restore();
    }
}

class Firework {
    constructor(x, y) {
        this.particles = [];
        const hue = rand(300, 360);
        for (let i = 0; i < 90; i++) {
            const angle = rand(0, Math.PI * 2);
            const speed = rand(2, 9);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: hue + rand(-25, 25),
                life: 0,
                maxLife: rand(65, 110),
                size: rand(2, 4.5),
            });
        }
    }
    update() {
        this.particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.045;
            p.vx *= 0.98;
            p.life++;
        });
        this.particles = this.particles.filter((p) => p.life < p.maxLife);
        return this.particles.length > 0;
    }
    draw() {
        this.particles.forEach((p) => {
            const a = 1 - p.life / p.maxLife;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${a})`;
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 10;
            ctx.fill();
        });
        ctx.shadowBlur = 0;
    }
}

export function burst(x, y, count = 20) {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
    for (let i = 0; i < 5; i++) roses.push(new Rose(x + rand(-30, 30), y + rand(-30, 30)));
}

export function launchFireworks(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            fireworks.push(new Firework(rand(innerWidth * 0.15, innerWidth * 0.85), rand(innerHeight * 0.15, innerHeight * 0.65)));
        }, i * 280);
    }
}

export function initEffects() {
    canvas = document.getElementById('fxCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    onResize(() => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => p.draw());
        particles = particles.filter((p) => p.update());
        roses.forEach((r) => r.draw());
        roses = roses.filter((r) => r.update());
        fireworks.forEach((f) => f.draw());
        fireworks = fireworks.filter((f) => f.update());
        requestAnimationFrame(draw);
    }
    draw();

    return { burst, launchFireworks };
}
