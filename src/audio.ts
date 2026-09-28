export const soundtracks = [
  { id: 'after-hours', title: 'After Hours', bpm: 104 },
  { id: 'blue-current', title: 'Blue Current', bpm: 92 },
] as const;
export type Soundtrack = typeof soundtracks[number]['id'];

// Original 16-bar compositions. No game recording, sample, or melody is bundled.
export class PortfolioAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private spectrum = new Uint8Array(128);
  private voices = new Set<AudioScheduledSourceNode>();
  private track: Soundtrack = 'after-hours';
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
      this.master.gain.value = 0;
      this.music = this.context.createGain();
      this.music.connect(this.master);
      const compressor = this.context.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.ratio.value = 5;
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.72;
      this.master.connect(compressor).connect(this.analyser).connect(this.context.destination);
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
    this.music!.gain.cancelScheduledValues(context.currentTime);
    this.music!.gain.setTargetAtTime(1, context.currentTime, 0.04);
    this.master!.gain.setTargetAtTime(this.level, this.context.currentTime, 0.08);
    this.next = this.context.currentTime + 0.08;
    window.clearInterval(this.timer);
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), 60);
  }

  pause() {
    this.generation += 1;
    this.playing = false;
    window.clearInterval(this.timer);
    if (this.context && this.master) {
      this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.02);
      this.stopVoices(this.context.currentTime + 0.08);
    }
  }

  volume(value: number) {
    this.level = Math.max(0, Math.min(1, value));
    if (this.context && this.master && this.playing) this.master.gain.setTargetAtTime(this.level, this.context.currentTime, 0.04);
  }

  selectTrack(track: Soundtrack) {
    if (track === this.track) return;
    this.track = track;
    this.step = 0;
    if (!this.context || !this.music || !this.playing) return;
    const now = this.context.currentTime;
    // Fade the current voices before starting the new arrangement; keep one scheduler.
    this.music.gain.cancelScheduledValues(now);
    this.music.gain.setTargetAtTime(0, now, 0.02);
    this.stopVoices(now + 0.08);
    this.music.gain.setValueAtTime(0, now + 0.085);
    this.music.gain.setTargetAtTime(1, now + 0.09, 0.06);
    this.next = now + 0.1;
    this.schedule();
  }

  readLevels(levels: Float32Array) {
    levels.fill(0);
    if (!this.analyser || !this.playing || this.level === 0) return;
    this.analyser.getByteFrequencyData(this.spectrum);
    const boundaries = [0, 4, 14, 42, 128];
    for (let band = 0; band < 4; band++) {
      let peak = 0;
      for (let bin = boundaries[band]; bin < boundaries[band + 1]; bin++) peak = Math.max(peak, this.spectrum[bin]);
      levels[band] = peak / 255;
    }
  }

  private stopVoices(time: number) {
    this.voices.forEach(voice => voice.stop(time));
    this.voices.clear();
  }

  private tone(note: number, time: number, duration: number, gain: number, type: OscillatorType = 'sine', cue = false) {
    if (!this.context || !this.master || !this.music) return;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(gain, time + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope).connect(cue ? this.master : this.music);
    this.voices.add(oscillator);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
    oscillator.onended = () => { this.voices.delete(oscillator); oscillator.disconnect(); envelope.disconnect(); };
  }

  private percussion(time: number, snare: boolean) {
    if (!this.context || !this.music || !this.noise) return;
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const envelope = this.context.createGain();
    source.buffer = this.noise;
    filter.type = 'highpass';
    filter.frequency.value = snare ? 1700 : 6800;
    envelope.gain.setValueAtTime(snare ? 0.12 : 0.038, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + (snare ? 0.15 : 0.045));
    source.connect(filter).connect(envelope).connect(this.music);
    this.voices.add(source);
    source.start(time, (this.step % 7) * 0.08);
    source.stop(time + 0.2);
    source.onended = () => { this.voices.delete(source); source.disconnect(); filter.disconnect(); envelope.disconnect(); };
  }

  private kick(time: number) {
    if (!this.context || !this.music) return;
    const source = this.context.createOscillator();
    const envelope = this.context.createGain();
    source.frequency.setValueAtTime(140, time);
    source.frequency.exponentialRampToValueAtTime(42, time + 0.13);
    envelope.gain.setValueAtTime(0.36, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.23);
    source.connect(envelope).connect(this.music);
    this.voices.add(source);
    source.start(time);
    source.stop(time + 0.25);
    source.onended = () => { this.voices.delete(source); source.disconnect(); envelope.disconnect(); };
  }

  private schedule() {
    if (!this.context || !this.playing) return;
    const quiet = this.track === 'blue-current';
    const bpm = soundtracks.find(track => track.id === this.track)!.bpm;
    const chords = quiet
      ? [[48, 55, 62, 64], [45, 52, 59, 62], [53, 60, 64, 69], [55, 62, 65, 71]]
      : [[53, 60, 64, 67], [52, 59, 62, 66], [50, 57, 60, 64], [55, 62, 65, 69]];
    const melody = quiet
      ? [79, 76, 74, 71, 76, 74, 72, 67, 69, 76, 81, 79, 77, 74, 71, 74]
      : [76, 79, 74, 72, 71, 74, 78, 76, 72, 76, 79, 81, 77, 74, 72, 69];
    while (this.next < this.context.currentTime + 0.18) {
      const bar = Math.floor(this.step / 16) % 16;
      const beat = this.step % 16;
      const chord = chords[Math.floor(bar / 2) % 4];
      const at = this.next + (beat % 2 ? 0.014 : 0);
      if ((quiet ? [0, 10] : [0, 6, 10]).includes(beat)) this.kick(at);
      if (beat === 4 || beat === 12) this.percussion(at, true);
      if (beat % (quiet ? 4 : 2) === 0) this.percussion(at, false);
      if ((quiet ? [0, 10] : [0, 7, 10]).includes(beat)) {
        chord.forEach((note, i) => {
          this.tone(note, at + i * 0.009, quiet ? 1.3 : 0.85, 0.045);
          this.tone(note + 12, at + i * 0.009, quiet ? 0.5 : 0.24, 0.014);
        });
      }
      if ((quiet ? [0, 8, 14] : [0, 6, 8, 14]).includes(beat)) this.tone(chord[0] - 12 + (beat === 14 ? 7 : 0), at, quiet ? 0.42 : 0.28, quiet ? 0.14 : 0.18, 'triangle');
      const leadBeats = quiet ? [3, 11] : [2, 9, 14];
      if (bar >= 4 && bar < 14 && leadBeats.includes(beat)) {
        const note = melody[(bar * leadBeats.length + leadBeats.indexOf(beat)) % melody.length];
        this.tone(note, at, quiet ? 0.8 : 0.45, quiet ? 0.04 : 0.055);
        this.tone(note, at + 0.3, 0.4, 0.012);
      }
      this.step = (this.step + 1) % 256;
      this.next += 60 / bpm / 4;
    }
  }

  cue(kind: 'select' | 'confirm' | 'back') {
    if (!this.context || !this.playing || this.context.currentTime - this.cueTime < 0.065) return;
    this.cueTime = this.context.currentTime;
    const notes = kind === 'select' ? [84] : kind === 'confirm' ? [76, 83, 88] : [79, 71];
    notes.forEach((note, i) => this.tone(note, this.context!.currentTime + i * 0.035, 0.1, 0.055, 'triangle', true));
  }

  dispose() {
    this.pause();
    void this.context?.close();
    this.context = null;
    this.master = null;
    this.music = null;
    this.analyser = null;
  }
}
