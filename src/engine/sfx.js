// ================== звук ==================
const SFX = (() => {
  let ac = null, master = null, noiseBuf = null, roar = null, roarGain = null, muted = false;
  try { muted = localStorage.getItem('kak-eto-potushit-mute') === '1'; } catch (e) {}
  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC(); master = ac.createGain(); master.gain.value = muted ? 0 : .8; master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // гул огня
    const src = ac.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 250; lp.Q.value = .3;
    roarGain = ac.createGain(); roarGain.gain.value = 0; src.connect(lp).connect(roarGain).connect(master); src.start(); roar = lp;
  }
  const now = () => ac.currentTime;
  function env(g, t0, a, peak, dec) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + dec); }
  function noise(dur, type, f0, f1, peak, a = .01, q = 1, delay = 0) {
    if (!ac) return; const t = now() + delay, s = ac.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = .8 + Math.random() * .4;
    const fl = ac.createBiquadFilter(); fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain(); env(g, t, a, peak, dur); s.connect(fl).connect(g).connect(master); s.start(t, Math.random()); s.stop(t + a + dur + .05);
  }
  function tone(freq, dur, type = 'sine', peak = .2, delay = 0, f1 = null, a = .01) {
    if (!ac) return; const t = now() + delay, o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain(); env(g, t, a, peak, dur); o.connect(g).connect(master); o.start(t); o.stop(t + a + dur + .05);
  }
  return {
    init,
    get muted() { return muted; },
    toggle() { muted = !muted; try { localStorage.setItem('kak-eto-potushit-mute', muted ? '1' : '0'); } catch (e) {} if (master) master.gain.value = muted ? 0 : .8; return muted; },
    fire(level) { if (!ac) return; roarGain.gain.setTargetAtTime(Math.min(.16, level * .1), now(), .3); roar.frequency.setTargetAtTime(220 + Math.min(level, 2) * 120, now(), .4); },
    silence() { if (roarGain) roarGain.gain.setTargetAtTime(0, now(), .1); },
    click() { tone(520, .08, 'sine', .25, 0, 900); },
    whoosh() { noise(.35, 'bandpass', 300, 1800, .35, .05, 2); },
    splash() { noise(.55, 'lowpass', 2500, 300, .6, .005); for (let i = 0; i < 5; i++) tone(500 + Math.random() * 900, .06, 'sine', .12, .03 + i * .05, 1400 + Math.random() * 600); },
    thud() { noise(.3, 'lowpass', 600, 120, .6, .005); tone(110, .25, 'sine', .5, 0, 50); noise(.6, 'bandpass', 3000, 1500, .12, .05, .7, .08); },
    clank() { [820, 1230, 1960].forEach((f, i) => tone(f, .5 - i * .1, 'triangle', .18, 0)); tone(410, .3, 'square', .06); },
    hiss() { noise(1.1, 'highpass', 5000, 2500, .3, .05); },
    zap() { if (!ac) return; const t = now(), o = ac.createOscillator(), g = ac.createGain(); o.type = 'sawtooth'; for (let i = 0; i < 14; i++) o.frequency.setValueAtTime(50 + Math.random() * 180, t + i * .05);
      env(g, t, .01, .45, .75); o.connect(g).connect(master); o.start(t); o.stop(t + .85);
      for (let i = 0; i < 6; i++) noise(.06, 'highpass', 2500, 4000, .5, .002, 1, i * .1 + Math.random() * .05);
      tone(1800, .15, 'square', .12, 0, 300); noise(.5, 'lowpass', 900, 100, .7, .005); },
    unplug() { tone(1400, .04, 'square', .15); tone(220, .15, 'sine', .35, .03, 120); },
    spread() { noise(.7, 'lowpass', 200, 1400, .5, .15); tone(90, .6, 'sine', .3, 0, 160); },
    win() { [523, 659, 784, 1046].forEach((f, i) => { tone(f, .3, 'triangle', .25, i * .12); tone(f * 2, .2, 'sine', .06, i * .12); }); },
    star(i) { tone(880 * Math.pow(1.26, i), .5, 'sine', .25, 0); tone(1760 * Math.pow(1.26, i), .3, 'sine', .08, .02); },
    knob() { tone(900, .03, 'square', .12); tone(600, .05, 'square', .1, .06); tone(300, .12, 'sine', .25, .06, 200); },
    creak() { tone(180, .45, 'sawtooth', .05, 0, 260); noise(.4, 'bandpass', 600, 900, .12, .05, 4); tone(120, .15, 'sine', .3, .4, 80); },
    puff() { noise(.6, 'lowpass', 4000, 800, .45, .01); noise(.3, 'highpass', 3000, 2000, .15, .01); },
    cloth() { noise(.5, 'bandpass', 900, 300, .35, .08, 1.5); tone(90, .3, 'sine', .3, .35, 60); },
    flare() { noise(1, 'lowpass', 300, 3000, .7, .02); tone(70, .8, 'sine', .5, 0, 160); noise(.8, 'highpass', 2000, 5000, .25, .1, 1, .1); },
    blast() { noise(1.4, 'lowpass', 1800, 60, 1, .005); tone(55, 1, 'sine', .8, 0, 30); noise(.4, 'highpass', 2000, 800, .3, .005); },
    dial() { [0, 1, 2].forEach(i => tone(i === 0 ? 1336 : 1209, .09, 'sine', .18, i * .16)); tone(440, .5, 'sine', .12, .6); tone(480, .5, 'sine', .1, .6); },
    ding() { tone(1320, .5, 'sine', .25); tone(990, .7, 'sine', .2, .25); },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, .45, 'triangle', .25, i * .22, f * .97)); }
  };
})();
document.addEventListener('pointerdown', () => SFX.init(), { capture: true });
document.addEventListener('keydown', () => SFX.init(), { capture: true });
document.addEventListener('click', e => { if (e.target.closest('button')) SFX.click(); }, { capture: true });

