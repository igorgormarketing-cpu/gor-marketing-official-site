// Web Audio API Lego Sound Synthesizer
class LegoSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSnapClick(pitch = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(150 * pitch, now + 0.06);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch(e) {}
  }

  playBrickClick() {
    this.playSnapClick(1.2);
  }

  playClick() {
    this.playSnapClick(1.0);
  }

  playCelebrationJingle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.08));
        gain.gain.setValueAtTime(0.3, now + (idx * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + (idx * 0.08));
        osc.stop(now + (idx * 0.08) + 0.2);
      });
    } catch(e) {}
  }

  playRewardCheer() {
    this.playCelebrationJingle();
  }

  playCoinChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch(e) {}
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

window.legoSound = new LegoSoundEngine();
