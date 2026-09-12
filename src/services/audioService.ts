// Web Audio API Synthesizer for Authentic Bengali Dhaak Beats, Conch (Shankha), and Mandir Bell

class PujoAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play an authentic deep Dhaak bass drum tone (heavy earthen thud)
  private playDhaakBass(time: number, accent: boolean = false) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = accent ? 82 : 72; // Deep resonant Dhaak skin tone
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.18);

    gain.gain.setValueAtTime(accent ? 0.8 : 0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  // Play the sharp wood-stick slap on the smaller Dhaak drum rim (কাঠি-র ঘা)
  private playKathiRim(time: number, volume: number = 0.3) {
    if (!this.ctx) return;

    // High pitched snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, time);
    osc.frequency.exponentialRampToValueAtTime(180, time + 0.04);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // Play metallic Kashor Ghanta (gong resonance) accompanying Dhaak
  private playKashor(time: number) {
    if (!this.ctx) return;

    const freqs = [840, 1260, 1680];
    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.08 / (i + 1), time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.7);
    });
  }

  // Traditional Bengali 8-beat Dhaak rhythm cycle:
  // Step 0: Heavy Bass (DHA) + Kashor
  // Step 1: Kathi slap (TI)
  // Step 2: Bass (DHA)
  // Step 3: Double slap (TI-NA)
  // Step 4: Heavy Accent Bass (DHA-RA) + Kashor
  // Step 5: Fast Kathi (KITI)
  // Step 6: Bass (DHA)
  // Step 7: Flourish slap (TA)
  private scheduleRhythm() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const step = this.currentStep % 8;

    switch (step) {
      case 0:
        this.playDhaakBass(now, true);
        this.playKashor(now);
        break;
      case 1:
        this.playKathiRim(now, 0.35);
        break;
      case 2:
        this.playDhaakBass(now, false);
        this.playKathiRim(now + 0.06, 0.2);
        break;
      case 3:
        this.playKathiRim(now, 0.4);
        break;
      case 4:
        this.playDhaakBass(now, true);
        this.playKashor(now);
        break;
      case 5:
        this.playKathiRim(now, 0.25);
        this.playKathiRim(now + 0.07, 0.3);
        break;
      case 6:
        this.playDhaakBass(now, false);
        break;
      case 7:
        this.playKathiRim(now, 0.45);
        break;
    }

    this.currentStep++;
    // Interval between sixteenth beats (~160ms = ~94 BPM festival tempo)
    const nextStepTime = 160; 
    this.timerId = window.setTimeout(() => this.scheduleRhythm(), nextStepTime);
  }

  // Toggle Dhaak on/off
  public toggleDhaak(): boolean {
    this.initContext();
    if (this.isPlaying) {
      this.stopDhaak();
      return false;
    } else {
      this.startDhaak();
      return true;
    }
  }

  public startDhaak() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.scheduleRhythm();
  }

  public stopDhaak() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Play auspicious Conch (Shankha Dhwani - শঙ্খধ্বনি)
  public playConch() {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Characteristic swelling pitch of conch shell blow
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(285, now + 0.6);
    osc.frequency.linearRampToValueAtTime(270, now + 1.6);
    osc.frequency.exponentialRampToValueAtTime(160, now + 2.4);

    // Soft resonant filter to give natural acoustic horn timbre
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.linearRampToValueAtTime(950, now + 0.8);
    filter.frequency.linearRampToValueAtTime(500, now + 2.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
    gain.gain.linearRampToValueAtTime(0.3, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  // Play Mandir Ghanta (temple brass bell)
  public playTempleBell() {
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const frequencies = [587, 880, 1174, 1760]; // D5 harmonic chime

    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    });
  }
}

export const pujoAudio = new PujoAudioService();
