import { playClickTone } from '../audio/audio.js';

export function initCards(burst) {
    document.querySelectorAll('.memory-card').forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            const rect = card.getBoundingClientRect();
            burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
            playClickTone();
        });
    });
}

export function renderMemoryCards(cards) {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;

    grid.innerHTML = cards
        .map(
            (c, i) => `
        <div class="memory-card reveal reveal-delay-${(i % 3) + 1}">
            <div class="card-face card-front">
                <div class="card-icon">${c.icon}</div>
                <div class="card-title">${c.title}</div>
                <p class="card-text">${c.hint}</p>
            </div>
            <div class="card-face card-back">
                <p class="card-date">${c.date}</p>
                <p class="card-text">${c.text}</p>
            </div>
        </div>`
        )
        .join('');
}
