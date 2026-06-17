import { CONFIG } from './config.js';
import { observeReveal, observeSectionInView } from './utils.js';
import { initCursor, initPreloader } from './ui/cursor.js';
import { initScroll } from './ui/scroll.js';
import { initTyping, initLetter } from './ui/typing.js';
import { initCards, renderMemoryCards } from './ui/cards.js';
import { initAudio, playClickTone } from './audio/audio.js';
import { initBackground, initGrain } from './canvas/background.js';
import { initEffects, burst, launchFireworks } from './canvas/effects.js';
import { initConstellation, getStarCount } from './canvas/constellation.js';
import { initHeartGame } from './canvas/heartGame.js';
import { initDreamScene } from './canvas/dreamScene.js';

function bindContent() {
    document.title = CONFIG.title;

    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.innerHTML = CONFIG.hero.subtitle.replace('\n', '<br>');

    const heroBtn = document.getElementById('heroBtn');
    if (heroBtn) heroBtn.querySelector('span').textContent = CONFIG.hero.buttonText;

    const finaleSubtitle = document.getElementById('finaleSubtitle');
    if (finaleSubtitle) finaleSubtitle.innerHTML = CONFIG.finale.subtitle.replace('\n', '<br>');

    const finaleTitle = document.getElementById('finaleTitle');
    if (finaleTitle) finaleTitle.textContent = CONFIG.finale.title;

    const fireworkBtn = document.getElementById('fireworkBtn');
    if (fireworkBtn) fireworkBtn.textContent = CONFIG.finale.buttonText;

    const signEl = document.getElementById('letterSign');
    if (signEl) signEl.textContent = CONFIG.letter.signature;

    const dreamHint = document.getElementById('dreamHint');
    if (dreamHint) dreamHint.textContent = CONFIG.dream.hint;

    const driveBtn = document.getElementById('driveBtn');
    if (driveBtn) driveBtn.textContent = CONFIG.dream.driveButton;

    renderMemoryCards(CONFIG.memories.cards);
}

function bindInteractions() {
    document.getElementById('heroBtn')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 32);
        playClickTone();
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('button, .memory-card, canvas, .nav-dot, .btn')) return;
        burst(e.clientX, e.clientY, 14);
    });

    document.getElementById('fireworkBtn')?.addEventListener('click', () => {
        launchFireworks(6);
        playClickTone();
    });
}

function updateStats(score) {
    const starEl = document.getElementById('statStars');
    const heartEl = document.getElementById('statHearts');
    if (starEl) starEl.textContent = getStarCount();
    if (heartEl) heartEl.textContent = score;
}

function init() {
    bindContent();
    initPreloader();
    initCursor();
    initScroll();
    initAudio();
    initBackground();
    initGrain();
    initEffects();
    initConstellation(burst);
    initDreamScene(burst);
    initHeartGame(burst, updateStats);
    initCards(burst);
    initTyping();
    initLetter();

    observeReveal();
    observeSectionInView();
    bindInteractions();

    // 定时同步统计数据
    setInterval(() => updateStats(parseInt(document.getElementById('heartScore')?.textContent || '0', 10)), 1000);
}

document.addEventListener('DOMContentLoaded', init);
