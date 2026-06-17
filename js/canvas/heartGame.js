import { $, rand, onResize } from '../utils.js';
import { playClickTone } from '../audio/audio.js';

let ctx, canvas;
let hearts = [];
let score = 0;
let active = false;

class GameHeart {
    constructor() {
        this.x = rand(35, canvas.width - 35);
        this.y = canvas.height + 35;
        this.size = rand(16, 32);
        this.speed = rand(1.6, 3.8);
        this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
        this.y -= this.speed;
        this.wobble += 0.055;
        this.x += Math.sin(this.wobble) * 1.8;
        return this.y > -45;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
        ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
        ctx.fillStyle = `rgba(255,${Math.floor(rand(85, 125))},${Math.floor(rand(135, 175))},0.88)`;
        ctx.shadowColor = 'rgba(255,100,150,0.55)';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();
    }
    hit(mx, my) {
        const rect = canvas.getBoundingClientRect();
        const x = mx - rect.left;
        const y = my - rect.top;
        return Math.hypot(this.x - x, this.y - y) < this.size * 1.2;
    }
}

export function initHeartGame(burst, onScore) {
    canvas = document.getElementById('heartCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    onResize(() => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    });

    const obs = new IntersectionObserver(
        ([e]) => { active = e.isIntersecting; },
        { threshold: 0.3 }
    );
    const section = $('interactive');
    if (section) obs.observe(section);

    canvas.addEventListener('click', (e) => {
        for (let i = hearts.length - 1; i >= 0; i--) {
            if (hearts[i].hit(e.clientX, e.clientY)) {
                hearts.splice(i, 1);
                score++;
                $('heartScore').textContent = score;
                onScore?.(score);
                burst(e.clientX, e.clientY, 16);
                playClickTone();
                break;
            }
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (active && Math.random() < 0.045) hearts.push(new GameHeart());
        hearts.forEach((h) => h.draw());
        hearts = hearts.filter((h) => h.update());
        requestAnimationFrame(draw);
    }
    draw();

    return {
        getScore: () => score,
    };
}
