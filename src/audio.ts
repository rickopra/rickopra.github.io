// Original 16-bar composition. No game recording, sample, or melody is bundled.
export class PortfolioAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | undefined;
  private step = 0;
  private next = 0;
  private noise: AudioBuffer | null = null;
  private level = 0.3;
  private playing = false;
  private cueTime = 0;
  private generation = 0;

  get active() { return this.playing; }

  async start() {
    const generation = ++this.generation;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      const compressor = this.context.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.ratio.value = 5;
      this.master.connect(compressor).connect(this.context.destination);
      this.noise = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
      const values = this.noise.getChannelData(0);
      let seed = 1729;
      for (let i = 0; i < values.length; i++) {
        seed = (seed * 16807) % 2147483647;
        values[i] = (seed / 2147483647) * 2 - 1;
      }
    }
    const context = this.context;
    await context.resume();
    if (generation !== this.generation || context !== this.context) return;
    this.playing = true;
    this.master!.gain.setTargetAtTime(this.level, this.context.currentTime, 0.08);
    this.next = this.context.currentTime + 0.08;
    this.step = 0;
    window.clearInterval(this.timer);
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), 60);
  }

  pause() {
    this.generation += 1;
    this.playing = false;
    window.clearInterval(this.timer);
    if (this.context && this.master) this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.035);
  }

  volume(value: number) {
    this.level = value;
    if (this.context && this.master && this.playing) this.master.gain.setTargetAtTime(value, this.context.currentTime, 0.04);
  }

  private tone(note: number, time: number, duration: number, gain: number, type: OscillatorType = 'sine') {
    if (!this.context || !this.master) return;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope).connect(this.master);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }

  private percussion(time: number, snare: boolean) {
    if (!this.context || !this.master || !this.noise) return;
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();
    source.buffer = this.noise;
    filter.type = 'highpass';
    filter.frequency.value = snare ? 1700 : 6800;
    envelope.gain.setValueAtTime(snare ? 0.12 : 0.038, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + (snare ? 0.15 : 0.045));
    source.connect(filter).connect(envelope).connect(this.master);
    source.start(time, (this.step % 7) * 0.08);
    source.stop(time + 0.2);
    source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect(); };
  }

  private kick(time: number) {
    if (!this.context || !this.master) return;
    const source = this.context.createOscillator();
    const envelope = this.context.createGain();
    source.frequency.setValueAtTime(140, time);
    source.frequency.exponentialRampToValueAtTime(42, time + 0.13);
    envelope.gain.setValueAtTime(0.36, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.23);
    source.connect(envelope).connect(this.master);
    source.start(time);
    source.stop(time + 0.25);
    source.onended = () => { source.disconnect(); envelope.disconnect(); };
  }

  private schedule() {
    if (!this.context || !this.playing) return;
    const chords = [[53, 60, 64, 67], [52, 59, 62, 66], [50, 57, 60, 64], [55, 62, 65, 69]];
    const melody = [76, 79, 74, 72, 71, 74, 78, 76, 72, 76, 79, 81, 77, 74, 72, 69];
    while (this.next < this.context.currentTime + 0.18) {
      const bar = Math.floor(this.step / 16) % 16;
      const beat = this.step % 16;
      const chord = chords[Math.floor(bar / 2) % 4];
      const at = this.next + (beat % 2 ? 0.014 : 0);
      if ([0, 6, 10].includes(beat)) this.kick(at);
      if (beat === 4 || beat === 12) this.percussion(at, true);
      if (beat % 2 === 0) this.percussion(at, false);
      if ([0, 7, 10].includes(beat)) {
        chord.forEach((note, i) => {
          this.tone(note, at + i * 0.009, 0.85, 0.045);
          this.tone(note + 12, at + i * 0.009, 0.24, 0.014);
        });
      }
      if ([0, 6, 8, 14].includes(beat)) this.tone(chord[0] - 12 + (beat === 14 ? 7 : 0), at, 0.28, 0.18, 'triangle');
      if (bar >= 4 && [2, 9, 14].includes(beat)) {
        const note = melody[(bar * 3 + [2, 9, 14].indexOf(beat)) % melody.length];
        this.tone(note, at, 0.45, 0.055);
        this.tone(note, at + 0.3, 0.4, 0.014);
      }
      this.step += 1;
      this.next += 60 / 104 / 4;
    }
  }

  cue(kind: 'select' | 'confirm' | 'back') {
    if (!this.context || !this.playing || this.context.currentTime - this.cueTime < 0.065) return;
    this.cueTime = this.context.currentTime;
    const notes = kind === 'select' ? [84] : kind === 'confirm' ? [76, 83, 88] : [79, 71];
    notes.forEach((note, i) => this.tone(note, this.context!.currentTime + i * 0.035, 0.1, 0.055, 'triangle'));
  }

  dispose() {
    this.pause();
    void this.context?.close();
    this.context = null;
  }
}
