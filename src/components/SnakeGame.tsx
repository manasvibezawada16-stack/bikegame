import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { RefreshCcw, Play, Pause, Skull } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const onSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
      if (!hasStarted) setHasStarted(true);
    }
    
    const currentDir = directionRef.current;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) {
          setDirection({ x: 0, y: -1 });
          directionRef.current = { x: 0, y: -1 };
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) {
          setDirection({ x: 0, y: 1 });
          directionRef.current = { x: 0, y: 1 };
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) {
          setDirection({ x: -1, y: 0 });
          directionRef.current = { x: -1, y: 0 };
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) {
          setDirection({ x: 1, y: 0 });
          directionRef.current = { x: 1, y: 0 };
        }
        break;
      case ' ':
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused(p => !p);
        }
        break;
    }
  }, [hasStarted, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(60, BASE_SPEED - Math.floor(score / 30) * 10);
    const interval = setInterval(moveSnake, speed);
    
    return () => clearInterval(interval);
  }, [direction, gameOver, isPaused, hasStarted, food, score]);

  return (
    <Fragment>
      <div className="absolute top-[30px] right-[40px] text-right z-10 flex flex-col items-end pointer-events-none">
        <div className="text-[14px] font-display text-[#00ffff] mb-1 drop-shadow-[2px_2px_0_#ff00ff]">STACK_SZ</div>
        <div className="text-[40px] font-mono font-bold text-[#00ffff] leading-none mb-6">
          {(score * 10).toString().padStart(7, '0')}
        </div>
        
        <div className="text-[14px] font-display text-[#ff00ff] mb-1 drop-shadow-[2px_2px_0_#00ffff]">OVERCLOCK</div>
        <div className="text-[28px] font-mono font-bold text-[#ff00ff] leading-none mb-6">
          x{(1 + score / 100).toFixed(1)}
        </div>
        
        <div className="flex gap-4 pointer-events-auto mt-2">
          <button onClick={() => { if (!hasStarted) setHasStarted(true); else setIsPaused(!isPaused); }}
            className="w-[50px] h-[50px] bg-black border-[4px] border-[#00ffff] text-[#00ffff] flex justify-center items-center hover:bg-[#00ffff] hover:text-black hover:scale-110 transition-all cursor-pointer shadow-[4px_4px_0_#ff00ff]"
          >
            {isPaused || !hasStarted ? <Play className="w-6 h-6 fill-current ml-1" /> : <Pause className="w-6 h-6 fill-current" />}
          </button>
          
          <button onClick={resetGame}
            className="w-[50px] h-[50px] bg-black border-[4px] border-[#ff00ff] text-[#ff00ff] flex justify-center items-center hover:bg-[#ff00ff] hover:text-black hover:scale-110 transition-all cursor-pointer shadow-[4px_4px_0_#00ffff]"
          >
            <RefreshCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="relative pointer-events-none">
        <div className="w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-black border-[4px] border-[#00ffff] shadow-[0_0_20px_#00ffff_inset,0_0_20px_#00ffff] p-[2px] pointer-events-auto relative overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:5%_5%] pointer-events-none z-0"></div>
          
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((seg, i) => i !== 0 && seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;
            
            return (
              <div
                key={index}
                className={`w-full h-full z-10 transition-none
                  ${isBody ? 'bg-[#00ffff] shadow-[0_0_8px_#00ffff] scale-[0.85] border-[2px] border-black' : ''}
                  ${isHead ? 'bg-[#ffffff] shadow-[0_0_15px_#fff,0_0_15px_#00ffff] border-[2px] border-[#ff00ff] z-20 scale-[0.95]' : ''}
                  ${isFood ? 'bg-[#ff00ff] animate-pulse rounded-none scale-75 border-[2px] border-white' : ''}
                `}
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 border-[4px] border-[#ff00ff] pointer-events-auto screen-tear">
            <Skull className="w-16 h-16 text-[#ff00ff] mb-4 animate-[ping_1s_infinite]" />
            <h2 className="text-[32px] font-display text-[#ff00ff] mb-2 tracking-tighter glitch-text" data-text="KERNEL PANIC">
              KERNEL PANIC
            </h2>
            <div className="text-white text-[24px] font-mono font-bold px-6 py-2 border-[4px] border-[#00ffff] bg-black mt-4 border-dashed shadow-[4px_4px_0_#ff00ff]">
              DATA_LOST: {(score * 10).toString().padStart(7, '0')}
            </div>
          </div>
        )}

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 pointer-events-auto">
             <div className="bg-black border-[4px] border-[#00ffff] px-8 py-6 shadow-[8px_8px_0_#ff00ff] text-center cursor-pointer hover:invert transition-colors" onClick={() => setHasStarted(true)}>
               <h3 className="text-[20px] font-display text-[#00ffff] mb-4">EXECUTE</h3>
               <div className="text-[#ff00ff] text-[18px] mb-4 font-sans uppercase">Awaiting Input...</div>
               <div className="text-[14px] text-white animate-pulse font-sans bg-[#ff00ff] text-black px-2 inline-block font-bold">PRESS ANY KEY</div>
             </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
