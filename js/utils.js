export const $ = (id) => document.getElementById(id);
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a, b) => Math.random() * (b - a) + a;
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function onResize(callback) {
    window.addEventListener('resize', callback);
    callback();
}

export function observeReveal(selector = '.reveal', threshold = 0.15) {
    const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
        { threshold }
    );
    document.querySelectorAll(selector).forEach((el) => obs.observe(el));
    return obs;
}

export function observeSectionInView() {
    const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)),
        { threshold: 0.3 }
    );
    document.querySelectorAll('section').forEach((s) => obs.observe(s));
}
