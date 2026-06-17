import { PENTATONIC } from '../config.js';

let audioCtx = null;
let isPlaying = false;
let bgNodes = [];

export function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export function isMusicPlaying() {
    return isPlaying;
}

export function toggleMusic(btn) {
    isPlaying = !isPlaying;
    btn?.classList.toggle('playing', isPlaying);

    if (isPlaying) {
        getAudioContext();
        startAmbient();
    } else {
        stopAmbient();
    }
}

function startAmbient() {
    const ctx = getAudioContext();
    const notes = [261.63, 329.63, 392.0, 523.25];

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;
        lfo.frequency.value = 0.08 + i * 0.04;
        lfoGain.gain.value = 2.5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        gain.gain.value = 0.012;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        lfo.start();
        bgNodes.push({ osc, lfo });
    });
}

function stopAmbient() {
    bgNodes.forEach(({ osc, lfo }) => {
        try { osc.stop(); lfo.stop(); } catch (_) { /* already stopped */ }
    });
    bgNodes = [];
}

export function playClickTone() {
    if (!audioCtx || !isPlaying) return;

    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.frequency.value = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    osc.type = 'sine';
    g.gain.setValueAtTime(0.12, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.55);
}

export function initAudio() {
    const btn = document.getElementById('musicBtn');
    btn?.addEventListener('click', () => toggleMusic(btn));
}
