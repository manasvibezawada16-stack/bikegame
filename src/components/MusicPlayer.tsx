import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { useState, useRef, useEffect, Fragment } from 'react';

const TRACKS = [
  { id: 1, title: 'SYS_CORRUPT', artist: 'NULL_POINTER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'MEM_LEAK', artist: 'BUFFER_OVERFLOW', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'FATAL_EXC', artist: 'KERNEL_PANIC', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <Fragment>
      {/* Sidebar */}
      <div className="col-start-1 row-start-2 bg-[#000] p-6 flex flex-col gap-[20px] relative overflow-hidden">
        <div className="text-[18px] text-[#ff00ff] bg-[#000] border-b-[4px] border-[#ff00ff] pb-2 font-display text-sm tracking-widest glitch-text" data-text="&gt; AUDIO_CTL">
          &gt; AUDIO_CTL
        </div>
        
        {TRACKS.map((track, idx) => {
          const isActive = idx === currentTrackIndex;
          return (
            <div 
              key={track.id}
              onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
              className={`p-[12px] flex flex-col justify-center text-[22px] border-[4px] cursor-pointer transition-all ${
                isActive 
                  ? 'bg-[#ff00ff] border-[#ff00ff] text-[#000]' 
                  : 'bg-black border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-[#000]'
              }`}
            >
              <div className="font-display text-[10px] sm:text-[12px] leading-tight mb-2">
                {track.title}
              </div>
              <div className={`font-mono text-lg flex justify-between ${isActive ? 'text-black' : 'text-[#ff00ff]'} opacity-80`}>
                <span>{track.artist}</span>
                <span>[{isActive ? 'ACTV' : 'IDLE'}]</span>
              </div>
            </div>
          );
        })}

        <div className="mt-auto bg-black text-[#ff00ff] p-[15px] text-[20px] leading-[1.2] border-[4px] border-[#ff00ff]">
           &gt; CMD: ARROW_KEYS<br/>
           &gt; OBJ: DATA_NODE<br/>
           &gt; AVD: KERNEL_PANIC
        </div>
      </div>

      {/* Controls Bar */}
      <div className="col-span-2 row-start-3 bg-black border-t-[4px] border-[#00ffff] px-[30px] grid grid-cols-[300px_1fr_300px] items-center">
        <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} preload="auto" />

        <div className="flex items-center gap-[15px]">
          <div className="w-[50px] h-[50px] bg-black border-[4px] border-[#ff00ff] flex justify-center items-center relative screen-tear">
             <Music className={`w-6 h-6 ${isPlaying ? 'text-[#00ffff] animate-ping' : 'text-[#ff00ff]'}`} />
          </div>
          <div className="font-display">
            <div className="font-bold text-[12px] text-[#00ffff] mb-[4px]">{currentTrack.title}</div>
            <div className="text-[10px] text-[#ff00ff]">{currentTrack.artist}</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex items-center gap-[25px]">
            <button onClick={prevTrack} className="text-[#00ffff] hover:text-[#ff00ff] hover:scale-125 transition-transform cursor-pointer">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button onClick={togglePlay} className="w-[50px] h-[50px] border-[4px] border-[#ff00ff] bg-black flex justify-center items-center text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors cursor-pointer">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-[#00ffff] hover:text-[#ff00ff] hover:scale-125 transition-transform cursor-pointer">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>
          <div className="w-[400px] h-[8px] bg-black border-[2px] border-[#ff00ff] relative overflow-hidden">
             <div className="w-[65%] h-full bg-[#00ffff]"></div>
             <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.5)_4px,rgba(0,0,0,0.5)_8px)] pointer-events-none"></div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[12px] text-[#00ffff] font-display mb-[4px] cursor-pointer hover:text-[#ff00ff] flex justify-end items-center gap-2" onClick={() => setIsMuted(!isMuted)}>
            VOL {isMuted ? '[X]' : '[MAX]'}
          </div>
          <div className={`flex justify-end gap-[4px] mt-[5px] ${isMuted ? 'opacity-20' : 'opacity-100'}`}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-[6px] h-[16px] ${i < 4 ? 'bg-[#ff00ff]' : 'bg-transparent border-[2px] border-[#ff00ff]'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
