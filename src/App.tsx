import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#000] text-[#00ffff] font-sans overflow-hidden selection:bg-[#ff00ff] selection:text-[#00ffff] relative">
      <div className="noise-bg opacity-30"></div>
      
      <div className="w-full max-w-[1000px] h-[740px] bg-black border-[4px] border-[#ff00ff] overflow-hidden grid grid-rows-[80px_1fr_100px] grid-cols-[300px_1fr] relative screen-tear z-10 shadow-[0_0_80px_rgba(255,0,255,0.2)]">
        
        {/* Header */}
        <div className="col-span-2 px-10 flex justify-between items-center border-b-[4px] border-[#00ffff] bg-black">
          <div className="text-2xl md:text-3xl font-display text-[#00ffff] glitch-text" data-text="SYS.SNAKE_EXE">
            SYS.SNAKE_EXE
          </div>
          <div className="text-xl text-[#ff00ff] uppercase animate-[pulse_1s_infinite]">
            ERR::SYS_OVERRIDE
          </div>
        </div>

        {/* Sidebar & Controls Bar */}
        <MusicPlayer />

        {/* Game Area */}
        <div className="col-start-2 row-start-2 relative flex justify-center items-center bg-black border-l-[4px] border-[#ff00ff] overflow-hidden">
          {/* subtle scanline overlay for game area */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none z-50"></div>
          <SnakeGame />
        </div>

      </div>
    </div>
  );
}
