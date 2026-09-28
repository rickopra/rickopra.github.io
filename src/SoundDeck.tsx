import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { ChevronDown, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { PortfolioAudio, soundtracks } from './audio';
import type { Soundtrack } from './audio';
import type { Language } from './content';

type Props = {
  audio: RefObject<PortfolioAudio | null>;
  playing: boolean;
  motion: boolean;
  language: Language;
  track: Soundtrack;
  volume: number;
  onToggle: () => void;
  onTrack: (track: Soundtrack) => void;
  onVolume: (volume: number) => void;
};

export default function SoundDeck({ audio, playing, motion, language, track, volume, onToggle, onTrack, onVolume }: Props) {
  const meter = useRef<HTMLSpanElement>(null);
  const trackIndex = soundtracks.findIndex(item => item.id === track);
  const toggleLabel = language === 'id' ? (playing ? 'Bisukan musik' : 'Putar musik') : (playing ? 'Mute soundtrack' : 'Play soundtrack');
  const nextLabel = language === 'id' ? 'Musik berikutnya' : 'Next soundtrack';

  useEffect(() => {
    const bars = Array.from(meter.current?.children ?? []) as HTMLElement[];
    const levels = new Float32Array(4);
    let frame = 0;
    let last = 0;
    const reset = () => bars.forEach(bar => { bar.style.transform = 'scaleY(0.16)'; });
    const draw = (now: number) => {
      if (now - last >= 50) {
        audio.current?.readLevels(levels);
        bars.forEach((bar, index) => { bar.style.transform = `scaleY(${Math.max(0.16, levels[index])})`; });
        last = now;
      }
      frame = requestAnimationFrame(draw);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      reset();
      if (playing && motion && !document.hidden) frame = requestAnimationFrame(draw);
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', update); reset(); };
  }, [audio, playing, motion]);

  return <div className="sound-deck" data-audio={playing ? 'playing' : 'off'} data-track={track}>
    <button className="p-icon" onClick={onToggle} aria-label={toggleLabel} title={toggleLabel} aria-pressed={playing}>{playing ? <Volume2 size={21} /> : <VolumeX size={21} />}</button>
    <span className="equalizer" ref={meter} aria-hidden="true"><i /><i /><i /><i /></span>
    <label className="track-name">
      <span className="track-picker"><select aria-label={language === 'id' ? 'Pilihan musik' : 'Soundtrack'} value={track} onChange={event => onTrack(event.target.value as Soundtrack)}>{soundtracks.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><ChevronDown size={12} aria-hidden="true" /></span>
      <small>0{trackIndex + 1} / 0{soundtracks.length} &middot; {soundtracks[trackIndex].bpm} BPM</small>
    </label>
    <button className="p-icon track-next" onClick={() => onTrack(soundtracks[(trackIndex + 1) % soundtracks.length].id)} aria-label={nextLabel} title={nextLabel}><SkipForward size={16} /></button>
    <input type="range" min="0" max="100" value={volume} onChange={event => onVolume(Number(event.target.value))} aria-label={language === 'id' ? 'Volume musik' : 'Soundtrack volume'} />
  </div>;
}
