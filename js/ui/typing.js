import { $, rand } from '../utils.js';
import { CONFIG } from '../config.js';

export function initTyping() {
    const { phrases } = CONFIG.hero;
    const el = $('typedText');
    if (!el) return;

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function loop() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(loop, 2200);
                return;
            }
            setTimeout(loop, 110);
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(loop, 450);
                return;
            }
            setTimeout(loop, 55);
        }
    }
    loop();
}

export function initLetter(onComplete) {
    const { content, signature } = CONFIG.letter;
    let started = false;

    const obs = new IntersectionObserver(
        (entries) => {
            if (!entries[0].isIntersecting || started) return;
            started = true;

            let i = 0;
            const letterEl = $('letterText');
            const signEl = $('letterSign');

            function typeChar() {
                if (i < content.length) {
                    letterEl.textContent += content[i];
                    i++;
                    setTimeout(typeChar, rand(28, 75));
                } else {
                    signEl.style.transition = 'opacity 1.2s ease';
                    signEl.style.opacity = '1';
                    onComplete?.();
                }
            }
            typeChar();
        },
        { threshold: 0.45 }
    );

    const section = $('letter');
    if (section) obs.observe(section);
}
