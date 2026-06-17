import { $ } from '../utils.js';
import { CONFIG } from '../config.js';

export function initScroll() {
    const progressBar = $('progressBar');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - innerHeight;
        const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = `${pct}%`;

        let current = '';
        sections.forEach((s) => {
            if (scrollY >= s.offsetTop - innerHeight * 0.5) current = s.id;
        });
        navDots.forEach((d) => d.classList.toggle('active', d.dataset.target === current));
    });

    navDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            $(dot.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 渲染导航
    const nav = $('navDots');
    if (nav && nav.children.length === 0) {
        CONFIG.nav.forEach((item, i) => {
            const btn = document.createElement('button');
            btn.className = `nav-dot${i === 0 ? ' active' : ''}`;
            btn.dataset.label = item.label;
            btn.dataset.target = item.id;
            nav.appendChild(btn);
        });
    }
}
